import {
  TAG,
  CommonHandler,
  CONFIG_CONST,
  CheckoutLocators,
  MinicartLocators,
  ProductLocators,
  MinicartHandler,
  ElasticsearchApiHandler,
  CheckoutHandler
} from 'cypress/index'

function addRandomAvailableProductToCart () {
  ElasticsearchApiHandler.getUrlOfOneAvailableProduct().then(productUrl => {
    cy.log('**URL of available product:** ' + JSON.stringify(productUrl))
    cy.visit(CONFIG_CONST.HOMEPAGE_URL + productUrl)
    CommonHandler.waitForFullLoad()
    cy.getLoc(ProductLocators.add_to_cart_btn).click()
    cy.getLoc(CheckoutLocators.confirm_button).click()
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })
}

describe('Minicart', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    addRandomAvailableProductToCart()
    MinicartHandler.getMiniCartItemsCount().should('be.eq', '1')
    cy.getLoc(MinicartLocators.minicart_icon).click()
    CommonHandler.waitForFullLoad()
  })

  it('6874 - Minicart - Add items', { tags: [TAG.DEVCLOUD] }, () => {
    cy.get(MinicartLocators.number_of_pieces_input).invoke('val').should('be.eq', '1')
    MinicartHandler.extractMiniCartItemPrice(0, 'miniCartProductPrice')
    MinicartHandler.extractMiniCartTotalPrice('miniCartTotalPrice')
    CheckoutHandler.checkPriceIsEqual('@miniCartProductPrice', '@miniCartTotalPrice')
  })

  it('6875 - Minicart - Change quantity', { tags: [] }, () => {
    MinicartHandler.extractMiniCartItemPrice(0, 'miniCartProductPriceForOne')

    CheckoutHandler.incrementProductQty(0)
    MinicartHandler.extractMiniCartItemPrice(0, 'miniCartProductPriceForTwo')
    cy.getLoc('@miniCartProductPriceForOne').then((productPriceBefore) => {
      cy.getLoc('@miniCartProductPriceForTwo').then((productPriceAfter) => {
        cy.wrap(productPriceAfter).should('eq', Number(productPriceBefore) * 2)
      })
    })
    MinicartHandler.extractMiniCartTotalPrice('miniCartTotalPrice')
    CheckoutHandler.checkPriceIsEqual('@miniCartProductPriceForTwo', '@miniCartTotalPrice')
    cy.get(MinicartLocators.number_of_pieces_input).invoke('val').should('be.eq', '2')

    CheckoutHandler.decrementProductQty(0)
    MinicartHandler.extractMiniCartItemPrice(0, 'miniCartProductPriceForOneAfterChanges')
    MinicartHandler.extractMiniCartTotalPrice('miniCartTotalPriceAfterChanges')
    CheckoutHandler.checkPriceIsEqual('@miniCartProductPriceForOne', '@miniCartProductPriceForOneAfterChanges')
    CheckoutHandler.checkPriceIsEqual('@miniCartProductPriceForOneAfterChanges', '@miniCartTotalPriceAfterChanges')
    cy.get(MinicartLocators.number_of_pieces_input).invoke('val').should('be.eq', '1')

    cy.getLoc(CheckoutLocators.cart.product.qty_minus).click()
    cy.getLoc(CheckoutLocators.confirm_button).click()
    cy.getLoc(MinicartLocators.minicart_icon).click()
    cy.getLoc(MinicartLocators.empty_cart).should('be.visible')
  })

  it('6876 - Minicart - Remove product', { tags: [] }, () => {
    cy.getLoc(MinicartLocators.remove_item_button).click()
    cy.getLoc(CheckoutLocators.confirm_button).click()
    cy.getLoc(MinicartLocators.minicart_icon).click()
    cy.getLoc(MinicartLocators.empty_cart).should('be.visible')
  })

  it('6877 - Minicart - Click on the product', { tags: [] }, () => {
    cy.getLoc(MinicartLocators.product_name_button).click()
    CommonHandler.waitForFullLoad()
    cy.getLoc(ProductLocators.product_detail).should('be.visible')
  })
})
