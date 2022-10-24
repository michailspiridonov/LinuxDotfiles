import { TAG, CONFIG_CONST, AdminCommonHandler, CheckoutApiHandler, PaymentMethodStorage, ShippingMethodStorage } from 'cypress/index'
import moment from 'moment'

const orders: [string, string][] = []
const currency = 'EUR'
const paymentDate = moment().format('YYYYMMDD')

if (!['sk'].includes(CONFIG_CONST.COUNTRY)) {
  describe('GLECOM-2556', () => {
    it('generate orders', { tags: [] }, () => {
      cy.visit(CONFIG_CONST.HOMEPAGE_URL)
      cy.task('log', Cypress.env('run_id'))
      createOrders(120)
    })
    it('print orders', { tags: [] }, () => {
      orders.forEach((order) => {
        cy.log(order[0] + ' - ' + order[1])
      })
    })
    it('generate XML and import', { tags: [] }, () => {
      generateXml('output/vub' + Cypress.env('run_id') + '.xml', orders, 'vub')
    })
    it.skip('import', { tags: [] }, () => {
      importPayments('output/vub.xml', 'vub_xml')
      cy.getLoc('[data-ui-id=messages-message-success]').should('contain', 'Success imports: ')
    })
  })
} else {
  it.skip('Skipped')
}

function createApiOrder (index: number) {
  const productSKU = ['X37970', '96406', '26797', 'X43452']
  CheckoutApiHandler.createCart().then((cartIdRaw) => {
    const cartId = String(cartIdRaw)
    cy.task('log', String(index))
    CheckoutApiHandler.addItemToCart({ cartId: cartId, sku: productSKU[index % 4] })
    CheckoutApiHandler.setEmail({ cartId: cartId, email: CONFIG_CONST.DATA.user.login })
    CheckoutApiHandler.setBillingAddress({ cartId: cartId })
    CheckoutApiHandler.setShippingAddress({ cartId: cartId })
    CheckoutApiHandler.setPaymentMethod({ cartId: cartId, code: PaymentMethodStorage.getCodeByShortcut('sk_banktransfer') })
    CheckoutApiHandler.setShippingMethod({
      cartId: cartId,
      preferedShippings: ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY)
    })
    CheckoutApiHandler.getGrandTotalAndSaveAs(cartId).as('grand_total')
    CheckoutApiHandler.placeOrderAndSaveOrderNumberAs({ cartId: cartId, orderType: 'order' }, 'order_number')
  })
}

function createOrders (ordersCount: number) {
  for (let index = 0; index < ordersCount; index++) {
    createApiOrder(index)
    cy.getLoc('@order_number').then((orderNumber) => {
      cy.getLoc('@grand_total').then((grandTotal) => {
        orders.push([String(orderNumber), String(grandTotal)])
      })
    })
  }
}
function getOrderForIndex (originalOrder: [string, string], index: number): [string, string] {
  const orderNumber = originalOrder[0]
  const originalOrderPrice = originalOrder[1]
  // every sixth order has lower price
  const orderPrice = index % 6 === 5 ? String(parseFloat(originalOrderPrice) - 2) : originalOrderPrice
  return [orderNumber, orderPrice]
}
function generateXml (outputPath: string, orders: [string, string][], importType: 'tatrabanka' | 'vub') {
  cy.wrap('').as('payments')
  cy.readFile('cypress/fixtures/payment_import/' + importType + '_payment.xml').as('payment')
  orders.forEach((order, index) => {
    cy.log(order[0])
    const outputOrder: [string, string] = getOrderForIndex(order, index)
    pushToPayments(outputOrder[1], outputOrder[0], currency, paymentDate)
  })
  cy.readFile('cypress/fixtures/payment_import/' + importType + '_example.xml').then((output) => {
    cy.getLoc('@payments').then((payments) => {
      cy.writeFile('cypress/fixtures/' + outputPath, String(output).replace(/__PAYMENTS__/g, String(payments)))
    })
  })
}

function pushToPayments (price: string, variableSymbol: string, currency: string, paymentDate: string) {
  cy.getLoc('@payment').then((paymentXml) => {
    cy.getLoc('@payments')
      .then((payments) => {
        return String(payments).concat(
          String(paymentXml)
            .replace(/__PRICE__/g, price)
            .replace(/__VARIABLE_SYMBOL__/g, variableSymbol)
            .replace(/__CURRENCY__/g, currency)
            .replace(/__PAYMENT_DATE__/g, paymentDate)
        )
      })
      .as('payments')
  })
}

function importPayments (filePath: string, importType: 'tatra' | 'vub_xml') {
  cy.visit(CONFIG_CONST.ADMIN_URL)
  AdminCommonHandler.login()
  cy.visit(CONFIG_CONST.ADMIN_URL + 'drmax_import/payments/')
  cy.getLoc('#new').click()
  cy.url().should('contain', 'drmax_import/payments/create/')
  cy.getLoc('[name="import_payments[import_type]"]').select(importType)
  cy.getLoc('[name="import_payments[import_file]"]').selectFile('cypress/fixtures/' + filePath)
  cy.getLoc('#save').click()
}
