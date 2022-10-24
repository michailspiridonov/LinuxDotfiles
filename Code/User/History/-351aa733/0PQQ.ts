import {
  TAG,
  CommonHandler,
  ElasticsearchApiHandler,
  ProductESRequestBuilder,
  CategoryESRequestBuilder,
  BrandESRequestBuilder,
  CategoryLocators,
  CategoryDetailHandler,
  CheckoutHandler,
  CONFIG_CONST,
  ProductLocators,
  ProductHandler
} from 'cypress/index'

describe('Product Lists', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it.only('6122 - List of products in category', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    const productESBuilder = (new ProductESRequestBuilder())
      .setSize(20)
      .setPimStatuses(['Available'])
      .setStockQty({ gte: 50 })
      .addSource('category')
    if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      productESBuilder.setOTC(false)
    }
    ElasticsearchApiHandler.getProductData(productESBuilder)
      .then(products => {
        return Cypress._.sample(products)
      })
      .then(product => {
        const mainCategory = (<any[]>product.category)
          .map(category => { return category.category_id })
          .reduce((acc, curr) => { return (acc < curr) ? curr : acc })
        ElasticsearchApiHandler.getCategoryData(
          (new CategoryESRequestBuilder())
            .setSize(1)
            .addTerm({ key: 'id', must: true, value: mainCategory })
            .addSource('name')
            .addSource('url_path')
        ).as('category')
      })
    cy.getLoc('@category')
      .then((categories) => {
        return <any>Cypress._.sample(categories)
      }).then((category) => {
        cy.log(`Selected category: **${category.name}**`)
      }).then(product => {
        const fullUrl = CONFIG_CONST.HOMEPAGE_URL + product.url_path
        cy.request(fullUrl).then(response => { expect(response.status).lessThan(400) })
        cy.visit(fullUrl)
        CommonHandler.waitForFullLoad()
      })
    cy.getLocScroll(CategoryLocators.category_list.locator).should('be.visible')
    cy.getLocScroll(CategoryLocators.category_list.product_item).should('be.visible').and('have.length.at.least', 1)
    CategoryDetailHandler.addToCart()
    CheckoutHandler.verifyProductItemCount(0, 1)
  })

  it('6118 - Product detail', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P1] }, () => {
    const elasticBuilder = (new ProductESRequestBuilder())
      .setSize(10)
      .setPimStatuses(['Available'])
      .setStockQty({ gte: 3 })
      .addSource('url_path')
      .addSource('sku')
    if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      elasticBuilder.setOTC(false)
    }
    ElasticsearchApiHandler.getProductData(elasticBuilder)
      .then((products) => {
        return Cypress._.sample(products)
      }).then((product) => {
        cy.log(`Selected product SKU: **${product.sku}**`)
      }).then(product => {
        const fullUrl = CONFIG_CONST.HOMEPAGE_URL + product.url_path
        cy.request(fullUrl).then(response => { expect(response.status).lessThan(400) })
        cy.visit(fullUrl)
        CommonHandler.waitForFullLoad()
      })
    cy.getLocScroll(ProductLocators.products_name).should('be.visible')
    cy.getLocScroll(ProductLocators.product_price).should('be.visible')
    ProductHandler.addToCart()
    CheckoutHandler.verifyProductItemCount(0, 1)
  })

  if (['cz'].includes(CONFIG_CONST.COUNTRY)) {
    // can fail on empty "Produktové řady" tab due to https://dev.azure.com/drmaxglobal/catalog-team/_workitems/edit/7567
    it('7555 - Product line', { tags: [TAG.PROD_FRIENDLY, TAG.CZ, TAG.P1] }, () => {
      const brandESBuilder = (new BrandESRequestBuilder())
        .setSize(20)
        .addExistsTerm({ key: 'product_line', must: true })
        .addSource('url_path')
      ElasticsearchApiHandler.getBrandData(brandESBuilder)
        .then(brands => {
          return Cypress._.sample(brands)
        }).then(brand => {
          cy.visit(brand.url_path)
        })
      cy.getLocScroll(CategoryLocators.category_tabs_rollout).click()
      cy.getLocScroll(CategoryLocators.category_tab).should('be.visible').contains('Produktové řady').click()
      cy.getLocScroll(CategoryLocators.product_line_title).eq(0).click()
      cy.getLocScroll(CategoryLocators.category_list.locator).should('be.visible')
      cy.getLocScroll(CategoryLocators.category_list.product_item).should('be.visible').and('have.length.at.least', 1)
      CategoryDetailHandler.addToCart()
      CheckoutHandler.verifyProductItemCount(0, 1)
    })

    it('7864 - Product list on actions and sales page', { tags: [TAG.PROD_FRIENDLY, TAG.CZ, TAG.P1] }, () => {
      cy.visit('vsechny-akce-a-slevy')
      CommonHandler.waitForFullLoad()

      cy.log('**Check product list is visible**')
      cy.getLocScroll(CategoryLocators.category_list.locator).should('be.visible')

      cy.log('**Check product list has at least 1 product**')
      cy.getLocScroll(CategoryLocators.category_list.product_item).should('be.visible').and('have.length.at.least', 1)

      cy.log('**Check it is possible to add first product in cart**')
      CategoryDetailHandler.addToCart()
      CheckoutHandler.verifyProductItemCount(0, 1)

      cy.log('**checking that original price is lower than sale price:** ')
      CommonHandler.waitForFullLoad()
      CheckoutHandler.getCartItemOriginalPrice(0).as('productOriginalPrice')
      CheckoutHandler.getCartItemPrice(0).as('productPrice')
      cy.getLoc('@productOriginalPrice').then((productOriginalPrice) => {
        cy.getLoc('@productPrice').then((productSalePrice) => {
          cy.wrap(productOriginalPrice).should('gt', Number(productSalePrice))
        })
      })

      cy.log('**checking that total price is the same as product price:** ')
      CheckoutHandler.getCartTotalPrice().as('totalPrice')
      CheckoutHandler.checkPriceIsEqual('@productPrice', '@totalPrice')
    })
  }
})
