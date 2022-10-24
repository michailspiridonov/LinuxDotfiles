import {
  TAG,
  CommonHandler,
  ElasticsearchApiHandler,
  ProductESRequestBuilder,
  HomepageLocators,
  ProductLocators,
  CONFIG_CONST
} from 'cypress/index'

describe('Availability', () => {
  beforeEach(() => {
    const elasticBuilder = (new ProductESRequestBuilder())
      .setSize(10)
      .setPimStatuses(['Available'])
      .setStockQty({ gte: 3 })
      .addSource('url_path')
    if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      elasticBuilder.setOTC(false)
    }
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    ElasticsearchApiHandler.getProductData(elasticBuilder).then((urlPath) => {
      cy.log(JSON.stringify(urlPath))
    }).then((urlPath) => {
      return Cypress._.sample(urlPath).url_path
    }).then(productUrlPath => {
      cy.visit(CONFIG_CONST.HOMEPAGE_URL + productUrlPath)
    })
    CommonHandler.waitForFullLoad()
  })

  it('2239 - Availability - not available', { tags: [] }, () => {
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
    cy.getLoc(ProductLocators.products_name).should('be.visible')
    cy.getLoc(HomepageLocators.cart_button_count).should('have.property', '0')
    cy.getLoc(ProductLocators.description).should('be.visible')
    cy.getLoc(ProductLocators.product_add_to_cart_unavailable)
      .should('be.visible')
      .scrollIntoView({ offset: { left: 0, top: -200 } })
  })
})
