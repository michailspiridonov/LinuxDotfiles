import {
  TAG,
  CommonHandler,
  ElasticsearchApiHandler,
  ProductESRequestBuilder,
  GeneralLocators,
  ProductLocators,
  CONFIG_CONST
} from 'cypress/index_'

describe('Availability', () => {
  it('2239 - Availability - not available', { tags: [TAG.PROD_FRIENDLY, TAG.P1, TAG.DEVCLOUD, TAG.DESKTOP] }, () => {
    const elasticBuilder = (new ProductESRequestBuilder())
      .setSize(10)
      .addSource('url_path')
    if (!['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      elasticBuilder
        .setPimStatuses(['Temporary unavailable'])
    } else {
      elasticBuilder
        .setPimStatuses(['Available'])
        .setStockSalableQty({ gte: 0, lte: 0 })
        .setOTC(false)
    }

    ElasticsearchApiHandler.getProductData(elasticBuilder)
      .then((urlPath: any) => {
        return Cypress._.sample(urlPath).url_path
      }).then(productUrlPath => {
        cy.visit(CONFIG_CONST.HOMEPAGE_URL + productUrlPath)
      })
    CommonHandler.waitForFullLoad()
    cy.getLocScroll(ProductLocators.products_name).should('be.visible')
    cy.getLocScroll(GeneralLocators.cart_button_count).should('have.property', '0')
    cy.getLocScroll(ProductLocators.description).should('be.visible')
    cy.scrollTo(0, 500)
    cy.get(ProductLocators.product_add_to_cart)
      .should('not.exist')
  })
})
