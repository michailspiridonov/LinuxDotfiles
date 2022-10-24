import { TAG, CheckoutApiHandler, StockStatusApiHandler, ShippingMethodStorage, PaymentMethodStorage, CONFIG_CONST } from 'cypress/index'

describe('Amazing suite', () => {
  it('Even more amazing testcase', { tags: [] }, () => {
    cy.visit(CONFIG_CONST.ADMIN_URL)
    StockStatusApiHandler.catalogue({ products: [{ sku: '44437' }, { sku: '44436' }] }).then((response) => {
      cy.log(JSON.stringify(response.body))
    })
  })

  it('Place Order', { tags: [] }, () => {
    cy.visit(CONFIG_CONST.ADMIN_URL)
    CheckoutApiHandler.createCart().then((cartId) => {
      CheckoutApiHandler.addItemToCart({ cartId: String(cartId), sku: '44437' })
      CheckoutApiHandler.setEmail({ cartId: String(cartId) })
      CheckoutApiHandler.setBillingAddress({ cartId: String(cartId) })
      CheckoutApiHandler.setShippingAddress({ cartId: String(cartId) })
      CheckoutApiHandler.setPaymentMethod({ cartId: String(cartId), code: PaymentMethodStorage.getCodeByShortcut('sk_banktransfer') })
      CheckoutApiHandler.setShippingMethod({
        cartId: String(cartId),
        shippingCode: ShippingMethodStorage.getCodeByShortcut('sk_ups')
      })
      if (['it'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutApiHandler.placeOrderAndSaveOrderNumberAs({
          cartId: String(cartId),
          cartAgreements: [
            { channel: 'PPD', topic: 'ESHOP', value: 'Y' }
          ]
        },
        'orderId')
      } else {
        CheckoutApiHandler.placeOrderAndSaveOrderNumberAs({ cartId: String(cartId) }, 'orderId')
      }
    })
    cy.get('@order_number').then((orderNumber) => {
      cy.log('Order number is ' + orderNumber)
    })
  })
})
