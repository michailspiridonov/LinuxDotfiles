import {
  AddSimpleProductToCartDto,
  PlaceOrderDto,
  RemoveItemFromCartDto,
  SetBillingAddressDto,
  SetEmailDto,
  SetPaymentMethodDto,
  SetShippingAddressDto,
  SetShippingMethodDto,
  SetShippingMethodWithSelectorDto,
  SetPaymentMethodWithSelectorDto
} from 'cypress/fixtures/api_templates/checkout_request_templates'
import {
  ApiHandler,
  ElasticsearchApiHandler,
  CheckoutRequestTemplates,
  ShippingMethodSelector,
  PaymentMethodSelector,
  ProductESRequestBuilder,
  CONFIG_CONST,
  accessToken
} from 'cypress/index'

export class CheckoutApiHandler {
  static makeGraphqlRequest (query: string, remainingRepeats?: number): Cypress.Chainable<Cypress.Response<any>> {
    return ApiHandler.makeRequest({
      url: `${CONFIG_CONST.DATA.url.graphql}`,
      method: 'POST',
      body: { query },
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': accessToken.access_token_id,
        'CF-Access-Client-Secret': accessToken.access_token_secret,
        store: CONFIG_CONST.DATA.store
      }
    }, remainingRepeats)
  }

  static createCart (): Cypress.Chainable<string> {
    cy.log('**CheckoutApiHandler.createCart**')
    const query = CheckoutRequestTemplates.createEmptyCart()
    return this.makeGraphqlRequest(query).then((response) => {
      window.localStorage.setItem('checkout/cart/id', `"${response.body.data.createEmptyCart}"`)
      window.localStorage.setItem('checkout/cart/backup', `"${response.body.data.createEmptyCart}"`)
      window.localStorage.setItem('checkout/cart/refreshed', 'true')
      return String(response.body.data.createEmptyCart)
    })
  }

  static getCartIdFromBrowserAndSaveAs (): Cypress.Chainable<string> {
    cy.log('**CheckoutApiHandler.getCartIdFromBrowserAndSaveAs**')
    return cy.wrap(window.localStorage.getItem('checkout/cart/id').replace(/"/g, ''))
  }

  static addItemToCart (dto: AddSimpleProductToCartDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.addItemToCart**')
    const query = CheckoutRequestTemplates.addSimpleProductsToCart(dto)
    return this.makeGraphqlRequest(query)
  }

  static removeItemFromCart (dto: RemoveItemFromCartDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.removeItemFromCart**')
    const query = CheckoutRequestTemplates.removeItemFromCart(dto)
    return this.makeGraphqlRequest(query)
  }

  static removeAllItemsFromCart (cartId: string): void {
    cy.log('**CheckoutApiHandler.removeAllItemsFromCart**')
    this.getCheckoutItems(cartId).then(items => {
      items.forEach(item => {
        this.removeItemFromCart({ cartId: cartId, cartItemId: item.id })
      })
    })
  }

  static setEmail (dto: SetEmailDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.setEmail**')
    const query = CheckoutRequestTemplates.setEmail(dto)
    return this.makeGraphqlRequest(query)
  }

  static setBillingAddress (dto: SetBillingAddressDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.setBillingAddress**')
    const query = CheckoutRequestTemplates.setBillingAddress(dto)
    return this.makeGraphqlRequest(query)
  }

  static setShippingAddress (dto: SetShippingAddressDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.setShippingAddress**')
    const query = CheckoutRequestTemplates.setShippingAddress(dto)
    return this.makeGraphqlRequest(query)
  }

  static setPaymentMethod (dto: SetPaymentMethodDto | SetPaymentMethodWithSelectorDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.setPaymentMethod**')
    if ((<SetPaymentMethodDto>dto).code !== undefined) {
      const query = CheckoutRequestTemplates.setPaymentMethod(<SetPaymentMethodDto>dto)
      return this.makeGraphqlRequest(query)
    } else {
      return CheckoutApiHandler.getAvailablePaymentMethods(dto.cartId)
        .then(availablePaymentMethods => {
          const selectedPaymentMethod = PaymentMethodSelector.select(
            ((<SetPaymentMethodWithSelectorDto>dto).preferedPayments),
            availablePaymentMethods
          )
          return CheckoutApiHandler.setPaymentMethod({
            cartId: dto.cartId,
            code: selectedPaymentMethod
          })
        })
    }
  }

  static setShippingMethod (dto: SetShippingMethodDto | SetShippingMethodWithSelectorDto): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.setShippingMethod**')
    if ((<SetShippingMethodDto>dto).shippingCode !== undefined) {
      const query = CheckoutRequestTemplates.setShippingMethod(<SetShippingMethodDto>dto)
      return this.makeGraphqlRequest(query)
    } else {
      return CheckoutApiHandler.getAvailableShippingMethods(dto.cartId)
        .then(availableShippingMethods => {
          const selectedShippingMethod = ShippingMethodSelector.select(
            ((<SetShippingMethodWithSelectorDto>dto).preferedShippings),
            availableShippingMethods
          )
          return CheckoutApiHandler.setShippingMethod({
            cartId: dto.cartId,
            shippingCode: selectedShippingMethod
          })
        })
    }
  }

  static getCheckoutItems (cartId: string): Cypress.Chainable<any[]> {
    cy.log('**CheckoutApiHandler.getCheckoutItems**')
    const query = CheckoutRequestTemplates.getCheckoutItems(cartId)
    return this.makeGraphqlRequest(query)
      .then((res) => {
        return res.body.data.cart.items
      })
  }

  static placeOrderAndSaveOrderNumberAs (dto: PlaceOrderDto, alias: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.placeOrderAndSaveOrderNumberAs**')
    const query = CheckoutRequestTemplates.placeOrder(dto)
    return this.makeGraphqlRequest(query).then((response) => {
      cy.wrap(String(response.body.data.placeOrder.order.order_id)).as(alias)
    })
  }

  static getAvailablePaymentMethods (cartId: string): Cypress.Chainable<any> {
    cy.log('**CheckoutApiHandler.getAvailablePaymentMethods**')
    const query = CheckoutRequestTemplates.getAvailablePaymentMethods(cartId)
    return this.makeGraphqlRequest(query).then((res) => {
      return res.body.data.cart.available_payment_methods
    })
  }

  static getAvailableShippingMethods (cartId: string): Cypress.Chainable<any> {
    cy.log('**CheckoutApiHandler.getAvailableShippingMethods**')
    const query = CheckoutRequestTemplates.getAvailableShippingMethods(cartId)
    return this.makeGraphqlRequest(query).then((res) => {
      return res.body.data.cart.shipping_addresses[0].available_shipping_methods
    })
  }

  static getAvailableShippingMethodsCodes (cartId: string): Cypress.Chainable<any> {
    cy.log('**CheckoutApiHandler.getAvailableShippingMethodsCodes**')
    const query = CheckoutRequestTemplates.getAvailableShippingMethods(cartId)
    return this.makeGraphqlRequest(query).then((res) => {
      return Array.from(res.body.data.cart.shipping_addresses[0].available_shipping_methods).map((param: any) => { return { carrier_code: param.carrier_code, method_code: param.method_code } })
    })
  }

  static getAppliedRules (cartId: string): Cypress.Chainable<any> {
    cy.log('**CheckoutApiHandler.getAppliedRules**')
    const query = CheckoutRequestTemplates.getAppliedRules(cartId)
    return this.makeGraphqlRequest(query).then((res) => {
      return res.body.data.cart.applied_rules
    })
  }

  static addMultipleProduct (cartId: string, dto?: { products: { sku: string; qty?: number }[] }): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.addMultipleProduct**')
    const query = CheckoutRequestTemplates.addMultipleProduct(cartId, dto)
    return this.makeGraphqlRequest(query)
  }

  static getThankYouPageAvailableProducts (orderId: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**CheckoutApiHandler.getThankYouPageAvailableProducts**')
    const query = CheckoutRequestTemplates.getThankYouPageAvailableProductsQuery(orderId)
    return this.makeGraphqlRequest(query)
  }

  static addAvailableProductToCart (): Cypress.Chainable<{ cartId: string, product: string }> {
    cy.log('**CheckoutApiHandler.addAvailableProductToCart** ')
    const elasticBuilder = (new ProductESRequestBuilder())
      .setSize(5)
      .setPimStatuses(['Available'])
      .setStockQty({ gte: 2 })

    return CheckoutApiHandler.createCart()
      .then((cartIdRaw) => {
        return ElasticsearchApiHandler.getProductData(elasticBuilder).then((products) => {
          const product = Cypress._.sample(products)
          CheckoutApiHandler.addItemToCart({ cartId: String(cartIdRaw), sku: product.sku })
          return cy.wrap({ cartId: String(cartIdRaw), product: product })
        })
      })
  }
}
