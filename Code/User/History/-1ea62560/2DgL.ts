import {
  TAG,
  CommonHandler,
  HomepageHandler,
  UserHandler,
  CheckoutApiHandler,
  ElasticsearchApiHandler,
  ProductESRequestBuilder,
  ShippingMethodStorage,
  PaymentMethodStorage,
  RandomEmailGenerator,
  AdminRequestHandler,
  ProductHandler,
  CheckoutHandler,
  UserLocators,
  CONFIG_CONST,
  WAIT_CONST
} from 'cypress/index'
import 'cypress-mailosaur'

const serverId: string = 'pjvurmhd'
const confirmEmailSubject: { [key: string]: string } = {
  cz: 'DrMax.cz: Vaši objednávku č. ',
  sk: 'Potvrdenie o prijatí objednávky číslo: ',
  ro: 'Confirmare inregistrare comanda: ',
  ssb: 'Confirmare inregistrare comanda: ',
  pl: 'Apteka Drmax.pl - nowe zamówienie, nr ',
  ed: 'Drogeria drmaxdrogeria.pl - nowe zamówienie, nr '
}
const generatedEmail: string = RandomEmailGenerator.generate()
const elasticBuilder = (new ProductESRequestBuilder())
  .setSize(50)
  .setPimStatuses(['Available'])
  .setStockQty({ gte: 10 })
  .addSource('sku')
  .addSource('url_path')
if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
  elasticBuilder.setOTC(false)
}

const checkEmail = (emailSubject: string) => {
  cy.log('**Waiting for an email, might take a while. Be patient, no running command is visible.**')
  cy.mailosaurGetMessage(serverId, { subject: emailSubject }, { timeout: WAIT_CONST.WAIT_FOR_EMAIL }).then((email) => {
    expect(email.subject).to.contain(emailSubject)
  })
}

describe('E2E', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('7036 - Not logged-in user order via API', { tags: [TAG.E2E, TAG.P1] }, () => {
    CheckoutApiHandler.createCart().then((cartIdRaw) => {
      const cartId = String(cartIdRaw)
      ElasticsearchApiHandler.getProductSKUs(elasticBuilder).then((productSKUs) => {
        const productSKU = Cypress._.sample(productSKUs)
        cy.wrap(productSKU).as('productSKU')
        CheckoutApiHandler.addItemToCart({ cartId: cartId, sku: productSKU })
      })
      CheckoutApiHandler.setEmail({ cartId: cartId, email: generatedEmail })
      CheckoutApiHandler.setBillingAddress({ cartId: cartId })
      CheckoutApiHandler.setShippingAddress({ cartId: cartId })
      CheckoutApiHandler.setShippingMethod({ cartId: cartId, preferedShippings: ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
      CheckoutApiHandler.setPaymentMethod({
        cartId: cartId,
        preferedPayments: PaymentMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY)
      })
      CheckoutApiHandler.placeOrderAndSaveOrderNumberAs({
        cartId: cartId,
        cartAgreements: [{ channel: 'PPD', topic: 'ESHOP', value: 'Y' }]
      }, 'orderNumber')
    })
    AdminRequestHandler.createBearerToken().then(authToken => {
      cy.getLoc('@orderNumber').then((incrementIdRaw) => {
        const incrementId = String(incrementIdRaw)
        AdminRequestHandler.getOrderDetail(incrementId, authToken).then(response => {
          const data = response.body
          expect(data.items).have.length(1)
          const order = data.items[0]
          expect(order.increment_id).to.be.eq(incrementId)
          expect(order.customer_group_id).to.be.eq(0)
          expect(order.billing_address.email).to.be.eq(generatedEmail)
          expect(order.billing_address.firstname).to.be.eq(CONFIG_CONST.DATA.user.name)
          expect(order.billing_address.lastname).to.be.eq(CONFIG_CONST.DATA.user.surname)
          expect(order.billing_address.telephone).to.be.eq(CONFIG_CONST.DATA.user.phone)
          expect(order.billing_address.street[0]).to.be.eq(CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
          expect(order.billing_address.city).to.be.eq(CONFIG_CONST.DATA.user.city)
          expect(order.billing_address.postcode).to.be.eq(CONFIG_CONST.DATA.user.postcode)
          cy.getLoc('@productSKU').then((productSKU) => {
            expect(order.items).have.length(1)
            expect(order.items[0].sku).to.be.eq(productSKU)
          })
        })
        checkEmail(confirmEmailSubject[CONFIG_CONST.COUNTRY] + incrementId)
      })
    })
  })

  it('7039 - Logged-in user order via API', { tags: [TAG.E2E, TAG.P1] }, () => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    HomepageHandler.goToUserLogin()
    UserHandler.login()
    cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE)
    cy.getLoc(UserLocators.login.alert).should('not.exist')
    cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE).then(() => {
      CheckoutApiHandler.getCartIdFromBrowserAndSaveAs().as('cartId')
    })
    cy.getLoc(UserLocators.login.alert).should('not.exist')
    cy.getLoc('@cartId').then((cartIdRaw) => {
      const cartId = String(cartIdRaw)
      CheckoutApiHandler.removeAllItemsFromCart(cartId)
      ElasticsearchApiHandler.getProductSKUs(elasticBuilder).then((productSKUs) => {
        const productSKU = Cypress._.sample(productSKUs)
        cy.wrap(productSKU).as('productSKU')
        CheckoutApiHandler.addItemToCart({ cartId: cartId, sku: productSKU })
      })
      CheckoutApiHandler.setEmail({ cartId: cartId, email: CONFIG_CONST.DATA.user.email })
      CheckoutApiHandler.setBillingAddress({ cartId: cartId })
      CheckoutApiHandler.setShippingAddress({ cartId: cartId })
      CheckoutApiHandler.setShippingMethod({ cartId: cartId, preferedShippings: ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
      CheckoutApiHandler.setPaymentMethod({
        cartId: cartId,
        preferedPayments: PaymentMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY)
      })
      CheckoutApiHandler.placeOrderAndSaveOrderNumberAs({
        cartId: cartId,
        cartAgreements: [{ channel: 'PPD', topic: 'ESHOP', value: 'Y' }]
      }, 'orderNumber')
    })
    AdminRequestHandler.createBearerToken().then(authToken => {
      cy.getLoc('@orderNumber').then((incrementIdRaw) => {
        const incrementId = String(incrementIdRaw)
        AdminRequestHandler.getOrderDetail(incrementId, authToken).then(response => {
          const data = response.body
          expect(data.items).have.length(1)
          const order = data.items[0]
          expect(order.increment_id).to.be.eq(incrementId)
          expect(order.customer_group_id).to.be.eq(1)
          expect(order.billing_address.email).to.be.eq(CONFIG_CONST.DATA.user.email)
          expect(order.billing_address.firstname).to.be.eq(CONFIG_CONST.DATA.user.name)
          expect(order.billing_address.lastname).to.be.eq(CONFIG_CONST.DATA.user.surname)
          expect(order.billing_address.telephone).to.be.eq(CONFIG_CONST.DATA.user.phone)
          expect(order.billing_address.street[0]).to.be.eq(CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
          expect(order.billing_address.city).to.be.eq(CONFIG_CONST.DATA.user.city)
          expect(order.billing_address.postcode).to.be.eq(CONFIG_CONST.DATA.user.postcode)
          cy.getLoc('@productSKU').then((productSKU) => {
            expect(order.items).have.length(1)
            expect(order.items[0].sku).to.be.eq(productSKU)
          })
        })
        checkEmail(confirmEmailSubject[CONFIG_CONST.COUNTRY] + incrementId)
      })
    })
  })

  it('7060 - Not logged-in user order', { tags: [TAG.E2E, TAG.P1] }, () => {
    const timestamp = Date.now()
    ElasticsearchApiHandler.getProductData(elasticBuilder).then((products) => {
      const product = Cypress._.sample(products)
      cy.wrap(product).as('product')
      cy.visit(CONFIG_CONST.HOMEPAGE_URL + product.url_path)
      CommonHandler.waitForFullLoad()
    })
    ProductHandler.addToCart()
    CheckoutHandler.goToNextStep()
    CheckoutHandler.selectShippingOption({ preferedShippings: ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
    CheckoutHandler.selectPaymentOption({ preferedPayments: PaymentMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
    CheckoutHandler.goToNextStep()
    CommonHandler.waitForFullLoad()
    CheckoutHandler.fillMandatoryUserInfo(timestamp, { email: generatedEmail })
    CheckoutHandler.goToNextStep()
    CheckoutHandler.handleAddressVerificationModal(false)
    CommonHandler.waitForFullLoad()
    CheckoutHandler.agreeToTerms()
    CheckoutHandler.finishOrder()
    cy.getLoc('#warnings-checkout').should('not.exist', 'Error message should not exists')
    CheckoutHandler.verifySuccessfulHeader()
    CheckoutHandler.wrapOrderNumber('orderNumber')
    AdminRequestHandler.createBearerToken().then(authToken => {
      cy.getLoc('@orderNumber').then((incrementIdRaw) => {
        const incrementId = String(incrementIdRaw)
        AdminRequestHandler.getOrderDetail(incrementId, authToken).then(response => {
          const data = response.body
          expect(data.items).have.length(1)
          const order = data.items[0]
          expect(order.increment_id).to.be.eq(incrementId)
          expect(order.customer_group_id).to.be.eq(0)
          expect(order.billing_address.email).to.be.eq(generatedEmail)
          expect(order.billing_address.firstname).to.be.eq(CONFIG_CONST.DATA.user.name)
          expect(order.billing_address.lastname).to.be.eq(CONFIG_CONST.DATA.user.surname + ' ' + timestamp)
          expect(order.billing_address.telephone).to.be.eq(CONFIG_CONST.DATA.user.phone_prefix + CONFIG_CONST.DATA.user.phone)
          expect(order.billing_address.street[0]).to.be.eq(CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
          expect(order.billing_address.city).to.be.eq(CONFIG_CONST.DATA.user.city)
          expect(order.billing_address.postcode).to.be.eq(CONFIG_CONST.DATA.user.postcode)
          cy.getLoc('@product').then((product) => {
            expect(order.items).have.length(1)
            expect(order.items[0].sku).to.be.eq((<any>product).sku)
          })
        })
        checkEmail(confirmEmailSubject[CONFIG_CONST.COUNTRY] + incrementId)
      })
    })
  })

  it.only('7061 - Logged-in user order', { tags: [TAG.E2E, TAG.P1] }, () => {
    const timestamp = Date.now()
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    HomepageHandler.goToUserLogin()
    UserHandler.login()
    cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE)
    cy.getLoc(UserLocators.login.alert).should('not.exist')
    ElasticsearchApiHandler.getProductData(elasticBuilder).then((products) => {
      const product = Cypress._.sample(products)
      cy.wrap(product).as('product')
      cy.visit(CONFIG_CONST.HOMEPAGE_URL + product.url_path)
      CommonHandler.waitForFullLoad()
    })
    ProductHandler.addToCart()
    CheckoutHandler.goToNextStep()
    CheckoutHandler.selectShippingOption({ preferedShippings: ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
    CheckoutHandler.selectPaymentOption({ preferedPayments: PaymentMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY) })
    CheckoutHandler.goToNextStep()
    CommonHandler.waitForFullLoad()
    CheckoutHandler.fillMandatoryUserInfo(timestamp, { email: generatedEmail })
    CheckoutHandler.setCompanyDetails(false)
    CheckoutHandler.goToNextStep()
    CheckoutHandler.handleAddressVerificationModal(false)
    CommonHandler.waitForFullLoad()
    CheckoutHandler.agreeToTerms()
    CheckoutHandler.finishOrder()
    cy.getLoc('#warnings-checkout').should('not.exist', 'Error message should not exists')
    CheckoutHandler.verifySuccessfulHeader()
    CheckoutHandler.wrapOrderNumber('orderNumber')
    AdminRequestHandler.createBearerToken().then(authToken => {
      cy.getLoc('@orderNumber').then((incrementIdRaw) => {
        const incrementId = String(incrementIdRaw)
        AdminRequestHandler.getOrderDetail(incrementId, authToken).then(response => {
          const data = response.body
          expect(data.items).have.length(1)
          const order = data.items[0]
          expect(order.increment_id).to.be.eq(incrementId)
          expect(order.customer_group_id).to.be.eq(1)
          expect(order.billing_address.email).to.be.eq(generatedEmail)
          expect(order.billing_address.firstname).to.be.eq(CONFIG_CONST.DATA.user.name)
          expect(order.billing_address.lastname).to.be.eq(CONFIG_CONST.DATA.user.surname + ' ' + timestamp)
          expect(order.billing_address.telephone).to.be.eq(CONFIG_CONST.DATA.user.phone_prefix + CONFIG_CONST.DATA.user.phone)
          expect(order.billing_address.street[0]).to.be.eq(CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
          expect(order.billing_address.city).to.be.eq(CONFIG_CONST.DATA.user.city)
          expect(order.billing_address.postcode).to.be.eq(CONFIG_CONST.DATA.user.postcode)
          cy.getLoc('@product').then((product) => {
            expect(order.items).have.length(1)
            expect(order.items[0].sku).to.be.eq((<any>product).sku)
          })
        })
        checkEmail(confirmEmailSubject[CONFIG_CONST.COUNTRY] + incrementId)
      })
    })
  })
})
