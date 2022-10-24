import {
  TAG,
  CheckoutHandler,
  CommonHandler,
  CheckoutApiHandler,
  ElasticsearchApiHandler,
  AdminCommonHandler,
  AdminLocators,
  SalesRuleHandler,
  ProductHandler,
  ProductESRequestBuilder,
  CONFIG_CONST
} from 'cypress/index'

const elasticBuilder = (new ProductESRequestBuilder())
  .setSize(20)
  .setPimStatuses(['Available'])
  .setFinalPrice({ gte: 35 })
  .setStockQty({ gte: 10 })
  .addSource('sku')
  .addSource('url_path')

describe('Cart Edit', () => {
  beforeEach(() => {
    ElasticsearchApiHandler.getProductData(elasticBuilder).then((productData) => { return Cypress._.sample(productData) }).as('productData')
    if (!['ed', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      CheckoutApiHandler.createCart().as('generatedCartId')
      cy.getLoc('@productData').then((productData) => {
        cy.getLoc('@generatedCartId').then((generatedCartId) => {
          CheckoutApiHandler.addItemToCart({ cartId: String(generatedCartId), sku: String((<any>productData).sku) })
        })
      })
      cy.visit(CONFIG_CONST.DATA.url.checkout)
    } else {
      cy.getLoc('@productData').then(productData => {
        cy.visit(String((<any>productData).url_path))
      })
      ProductHandler.addToCart()
      CommonHandler.waitForFullLoad()
    }
  })

  it('2273 - Insert Coupon Code', { tags: [TAG.P2] }, () => {
    const ruleName = '10off_automation'
    const routeAddCouponAlias = 'verifyCoupon'
    cy.viewport('macbook-16')
    cy.visit(CONFIG_CONST.ADMIN_URL)
    AdminCommonHandler.login()
    CommonHandler.waitForFullLoad()
    AdminCommonHandler.goToSection(AdminLocators.panel.marketing.locator, AdminLocators.panel.marketing.items.cart_price_rules)
    SalesRuleHandler.setFilterByRule(ruleName)
    AdminCommonHandler.applyFilters()
    CommonHandler.waitForFullLoad()
    AdminCommonHandler.extractNumberOfRecordsFound().then((recordsCount) => {
      if (recordsCount === 0) {
        SalesRuleHandler.addNewRule()
        SalesRuleHandler.setRuleName(ruleName)
        SalesRuleHandler.setActive(true)
        SalesRuleHandler.selectCoupon('Specific Coupon')
        SalesRuleHandler.setCouponCode(ruleName)
        SalesRuleHandler.selectWebsites(CONFIG_CONST.DATA.website_view)
        SalesRuleHandler.selectCustomerGroups(['General', 'NOT LOGGED IN', 'Retailer', 'Wholesale'])
        SalesRuleHandler.rolloutSection('actions')
        SalesRuleHandler.selectSimpleAction('by_fixed_qty_cart')
        SalesRuleHandler.setDiscountAmount('10')
        if (!['it'].includes(CONFIG_CONST.COUNTRY)) {
          SalesRuleHandler.selectFarmisVoucher('1')
        }
        SalesRuleHandler.save()
      }
    })
    cy.viewport('iphone-se2')
    cy.visit(CONFIG_CONST.DATA.url.checkout)
    CommonHandler.waitForFullLoad()
    CheckoutHandler.routeAddCoupon(routeAddCouponAlias)
    CheckoutHandler.addDiscountCoupon(ruleName)
    CheckoutHandler.assertCouponValid(routeAddCouponAlias)
  })
})
