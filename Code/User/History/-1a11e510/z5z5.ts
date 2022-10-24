import {
  TAG,
  CommonHandler,
  CONFIG_CONST,
  ElasticsearchApiHandler,
  CheckoutHandler,
  CategoryLocators,
  CategoryDetailHandler
} from 'cypress/index_'
describe('Brand List', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  // failing on ITA because of BUG https://dev.azure.com/drmaxglobal/platform-team/_workitems/edit/7633 (23.5.2022)
  it('7572 - Product list on Brand page', { tags: [TAG.PROD_FRIENDLY, TAG.P1, TAG.DEVCLOUD, TAG.DESKTOP] }, () => {
    ElasticsearchApiHandler.getBrandUrlOfOneAvailableProduct().then(brandUrl => {
      cy.log('brand to be visited: ' + brandUrl)
      cy.visit(brandUrl)
    })
    CommonHandler.waitForFullLoad()
    cy.log('**Check product list is visible**')
    cy.getLocScroll(CategoryLocators.category_list.locator).should('be.visible')
    cy.log('**Check product list has at least 1 product**')
    cy.getLocScroll(CategoryLocators.category_list.product_item).should('be.visible').and('have.length.at.least', 1)
    cy.log('**Check it is possible to add first product in cart**')
    CategoryDetailHandler.addToCart()
    CheckoutHandler.verifyProductItemCount(0, 1)
  })
})
