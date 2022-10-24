import {
  TAG,
  ProductESRequestBuilder,
  ProductLocators,
  GeneralLocators,
  ElasticsearchApiHandler,
  CONFIG_CONST
} from 'cypress/index_'

beforeEach(() => {
  cy.viewport('macbook-16')
  cy.visit(CONFIG_CONST.HOMEPAGE_URL)
})

describe('Checkout Performance', () => {
  it('7029 - Add product to cart from product page', { tags: [TAG.PERFORMANCE, TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P1] }, () => {
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
    cy.getLocScroll(ProductLocators.product_add_to_cart).click()
    cy.get(GeneralLocators.cart_modal.go_to_cart_button, { timeout: 15 * 1000 }).should('not.be.disabled')
    cy.get(GeneralLocators.cart_modal.go_to_cart_button).click()
    cy.url().should('equal', CONFIG_CONST.DATA.url.checkout)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.btn').click()
    cy.get('#submenu-1 > :nth-child(3) > a').click()
    cy.get(':nth-child(2) > .tile__link > .tile__title').should('have.attr', 'data-test-id', 'category-tile-product-name')
    cy.get(':nth-child(3) > .custom-control-label').click()
    cy.get('#sortby-final_price\\:desc').check()
    cy.get(':nth-child(1) > .tile__link > .tile__image > .products__image > picture > img').click()
    cy.get('.close > .icon').click()
    /* ==== End Cypress Studio ==== */
  })
})
