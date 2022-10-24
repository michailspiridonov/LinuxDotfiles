import {
  TAG,
  AdminCommonHandler,
  IndexerHandler,
  AdminLocators,
  CheckoutApiHandler,
  SalesRuleHandler,
  SalesRuleHelper,
  CommonHandler,
  CombineCondition,
  ElasticsearchApiHandler,
  ProductESRequestBuilder,
  ProductFoundCondition,
  SKUCondition,
  UserHandler,
  UserLocators,
  GeneralHandler,
  CONFIG_CONST,
  WAIT_CONST
} from 'cypress/index_'

const elasticBuilder = (new ProductESRequestBuilder())
  .setSize(50)
  .setPimStatuses(['Available'])
  .addSource('sku')
  .addSource('final_price')
if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
  elasticBuilder.setOTC(false)
}

describe('Sales Rules', () => {
  beforeEach(() => {
    cy.viewport('macbook-16')
    ElasticsearchApiHandler.getProductData(elasticBuilder).then((products) => {
      const sku = Cypress._.sample(products).sku
      cy.wrap(sku).as('productSKU')
      cy.task('log', `Picked SKU: ${sku}`)
    })
    cy.visit(CONFIG_CONST.ADMIN_URL)
    AdminCommonHandler.login()
    CommonHandler.waitForFullLoad()
    AdminCommonHandler.goToSection(AdminLocators.panel.system.locator, AdminLocators.panel.system.items.index_management)
    IndexerHandler.updateIndexerAction('sales_rules', 'UpdateOnSave')
    AdminCommonHandler.goToSection(AdminLocators.panel.marketing.locator, AdminLocators.panel.marketing.items.cart_price_rules)
    SalesRuleHandler.addNewRule()
  })

  it('7551 - Create and apply sales rule for not-logged in user', { tags: [TAG.P2, TAG.DESKTOP, TAG.DEVCLOUD] }, () => {
    const timestamp = Date.now()
    const ruleName = 'rule_xxxx_automation_' + timestamp
    cy.getLoc('@productSKU').then((sku) => {
      SalesRuleHelper.createSimpleRule({
        ruleName,
        customerGroups: ['NOT LOGGED IN'],
        discountAmount: '10',
        discountQtyStep: '2',
        simpleAction: 'by_percent_qty',
        conditions: CombineCondition('all', '1', [ProductFoundCondition('1', 'all', [SKUCondition('==', String(sku))])]),
        actions: CombineCondition('all', '1', [SKUCondition('==', String(sku))])
      })
    })
    AdminCommonHandler.logout()
    cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'))
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    cy.wait(WAIT_CONST.WAIT_FOR_INDEXERS)
    CheckoutApiHandler.createCart().as('cart_id')
    cy.getLoc('@cart_id').then((cartId) => {
      cy.task('log', `Cart ID: ${cartId}`)
      cy.getLoc('@productSKU').then((sku) => {
        CheckoutApiHandler.addItemToCart({ cartId: String(cartId), sku: String(sku), qty: 1 })
        CheckoutApiHandler.addItemToCart({ cartId: String(cartId), sku: String(sku), qty: 1 })
      })
      CommonHandler.waitForFullLoad()
      CheckoutApiHandler.getAppliedRules(String(cartId)).then((response) => {
        const appliedRules: any[] = response.body.data.cart.applied_sales_rules
        expect(appliedRules).to.have.length.gte(1, 'Some rule is applied')
        expect(
          appliedRules.some((rule) => {
            return String(rule.label).includes(ruleName)
          })
        ).to.be.equal(
          true,
            `Applied rules contain the created rule
            (expected: [...,${ruleName},...], actual: [${appliedRules.map((rule) => `${rule.id}-${rule.label}`).join(',')}])`
        )
      })
    })
  })

  it('7552 - Create and apply sales rule for logged in user', { tags: [TAG.P2, TAG.DEVCLOUD] }, () => {
    const timestamp = Date.now()
    const ruleName = 'rule_xxxx_automation_' + timestamp
    cy.getLoc('@productSKU').then((sku) => {
      SalesRuleHelper.createSimpleRule({
        ruleName,
        customerGroups: ['General'],
        discountAmount: '10',
        discountQtyStep: '2',
        simpleAction: 'by_percent_qty',
        conditions: CombineCondition('all', '1', [ProductFoundCondition('1', 'all', [SKUCondition('==', String(sku))])]),
        actions: CombineCondition('all', '1', [SKUCondition('==', String(sku))])
      })
    })
    AdminCommonHandler.logout()
    cy.viewport('iphone-se2')
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    GeneralHandler.goToUserLogin()
    UserHandler.login()
    cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE)
    cy.getLoc(UserLocators.login.alert).should('not.exist')
    cy.wait(WAIT_CONST.WAIT_FOR_INDEXERS).then(() => {
      CheckoutApiHandler.getCartIdFromBrowserAndSaveAs().as('cartId')
    })
    cy.getLoc('@cartId').then((cartId) => {
      cy.task('log', `Cart ID: ${cartId}`)
      CheckoutApiHandler.removeAllItemsFromCart(String(cartId))
      cy.getLoc('@productSKU').then((sku) => {
        CheckoutApiHandler.addItemToCart({ cartId: String(cartId), sku: String(sku), qty: 1 })
        CheckoutApiHandler.addItemToCart({ cartId: String(cartId), sku: String(sku), qty: 1 })
      })
      CommonHandler.waitForFullLoad()
      CheckoutApiHandler.getAppliedRules(String(cartId)).then((response) => {
        const appliedRules: any[] = response.body.data.cart.applied_sales_rules
        expect(appliedRules).to.have.length.gte(1, 'Some rule is applied')
        expect(
          appliedRules.some((rule) => {
            return String(rule.label).includes(ruleName)
          })
        ).to.be.equal(
          true,
            `Applied rules contain the created rule
            (expected: [...,${ruleName},...], actual: [${appliedRules.map((rule) => `${rule.id}-${rule.label}`).join(',')}])`
        )
      })
    })
  })
})
