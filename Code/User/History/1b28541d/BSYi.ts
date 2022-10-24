import {
  TAG,
  ProductESRequestBuilder,
  ProductLocators,
  HomepageLocators,
  ElasticsearchApiHandler,
  CONFIG_CONST
} from 'cypress/index'

beforeEach(() => {
  cy.viewport(1920, 1080)
  cy.visit(CONFIG_CONST.HOMEPAGE_URL)
})

describe('Checkout Performance', () => {
  it('7029 - Add product to cart from product page', { tags: [TAG.PERFORMANCE] }, () => {
    ElasticsearchApiHandler.getProductData(
      (new ProductESRequestBuilder())
        .setSize(30)
        .addSource('url_path')
        .setPimStatuses(['Available'])
        .setStockQty({ gte: 10 })
    ).then(response => {
      return Cypress._.sample(response).url_path
    }).then(urlPath => {
      cy.visit(CONFIG_CONST.HOMEPAGE_URL + urlPath)
    })
    cy.getLoc(ProductLocators.product_add_to_cart).click()
    cy.get(HomepageLocators.cart_modal.go_to_cart_button, { timeout: 15 * 1000 }).should('not.be.disabled')
    cy.get(HomepageLocators.cart_modal.go_to_cart_button).click()
    cy.url().should('equal', CONFIG_CONST.DATA.url.checkout)
  })
})
