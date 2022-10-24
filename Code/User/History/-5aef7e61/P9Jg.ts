import { PaymentCode, ShippingCode } from 'cypress/fixtures/api_templates/checkout_request_templates'
import { CheckoutLocators, ShippingMethodSelector, CommonHandler, CONFIG_CONST, ShippingCodeShortcut, PaymentCodeShortcut, PaymentMethodSelector } from 'cypress/index'

export type SetShippingOptionDto = {
  shippingCode: ShippingCode
  pickup?: string
}

export type SetShippingOptionWithSelectorDto = {
  preferedShippings: ShippingCodeShortcut[]
}

export type SetPaymentOptionDto = {
  paymentCode: PaymentCode
}

export type SetPaymentOptionWithSelectorDto = {
  preferedPayments: PaymentCodeShortcut[]
}

export class FillMandatoryUserInfoDto {
  email?: string
  surname?: string
  name?: string
  phonePrefix?: string
  phone?: string
  region?: string
  street?: string
  streetNumber?: string
  postCode?: string
  city?: string
}

export class FillDeliveryDataDto {
  region?: string
  street?: string
  streetNumber?: string
  postCode?: string
  city?: string
}

export class FillCompanyInfoDto {
  name?: string
  registrationNumber?: string
  vatId?: string
  skDic?: string
  itPec?: string
  itSdi?: string
}

export class SummaryInfoDto {
  productsPrice?: number
  discountPrice?: number
  shipmentPrice?: number
  paymentPrice?: number
  totalPrice?: number
}

export class CheckoutHandler {
  static verifyEmptyBasket (): void {
    cy.log('**CheckoutHandler.verifyEmptyBasket**')
    const emptyCart: { [key: string]: string } = {
      cz: 'Váš košík je prázdný',
      ro: 'Cosul de cumparaturi este gol',
      ssb: 'Cosul de cumparaturi este gol',
      sk: 'Váš košík je prázdny',
      pl: 'Twój koszyk jest pusty',
      ed: 'Twój koszyk jest pusty',
      it: 'Il tuo carrello è vuoto'
    }
    cy.getLocScroll('.empty-basket-title').should('be.visible').and('contain.text', emptyCart[CONFIG_CONST.COUNTRY])
  }

  static goToNextStep (): void {
    cy.log('**CheckoutHandler.goToNextStep**')
    if (['sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.scrollTo('bottom')
    }
    cy.getLoc(CheckoutLocators.big_next_button).focus().click()
    CommonHandler.waitForFullLoad()
  }

  static finishOrder (): void {
    cy.log('**CheckoutHandler.finishOrder**')
    cy.getLocScroll(CheckoutLocators.place_order_button).click()
    CommonHandler.waitForFullLoad()
  }

  static setDeliveryAddress (turnOn: boolean = true): void {
    cy.log(`**CheckoutHandler.setDeliveryAddress (turnOn: ${turnOn})**`)
    if (turnOn) {
      cy.getLocScroll(CheckoutLocators.different_delivery).check({ force: true })
    } else {
      cy.getLocScroll(CheckoutLocators.different_delivery).uncheck({ force: true })
    }
  }

  static setCompanyDetails (turnOn: boolean = true): void {
    cy.log(`**CheckoutHandler.setCompanyDetails (turnOn: ${turnOn})**`)
    if (turnOn) {
      cy.getLocScroll(CheckoutLocators.company_details).check({ force: true })
    } else {
      cy.getLocScroll(CheckoutLocators.company_details).uncheck({ force: true })
    }
  }

  static selectPaymentOption (dto: SetPaymentOptionDto | SetPaymentOptionWithSelectorDto): void {
    cy.log(`**CheckoutHandler.selectPaymentOption(${JSON.stringify(dto)})**`)
    if ((<SetPaymentOptionDto>dto).paymentCode !== undefined) {
      const option = (<SetPaymentOptionDto>dto).paymentCode.code
      cy.getLocScroll(CheckoutLocators.payment_methods).within(() => {
        cy.getLocScroll('label[for$="' + option + '"]').click()
        cy.getLocScroll('input[id$="' + option + '"]').should('be.checked')
      })
      CommonHandler.waitForFullLoad()
    } else {
      CheckoutHandler.getAvailablePaymentOptions()
        .then(availablePaymentMethods => {
          const selectedPaymentMethod = PaymentMethodSelector.select(
            ((<SetPaymentOptionWithSelectorDto>dto).preferedPayments),
            availablePaymentMethods
          )
          CheckoutHandler.selectPaymentOption({
            paymentCode: selectedPaymentMethod
          })
        })
    }
  }

  static selectShippingOption (dto: SetShippingOptionDto | SetShippingOptionWithSelectorDto): void {
    cy.log(`**CheckoutHandler.selectShippingOption(${JSON.stringify(dto)})**`)
    if ((<SetShippingOptionDto>dto).shippingCode !== undefined) {
      const shippingCode = (<SetShippingOptionDto>dto).shippingCode
      const option = `${shippingCode.carrier}~${shippingCode.method}`
      cy.getLocScroll(CheckoutLocators.shipping_methods).within(() => {
        cy.getLocScroll('label[for$="' + option + '"]').click()
        cy.getLocScroll('input[id$="' + option + '"]').should('be.checked')
      })
      CommonHandler.waitForFullLoad()
    } else {
      CheckoutHandler.getAvailableShippingOptions()
        .then(availableShippingMethods => {
          const selectedShippingMethod = ShippingMethodSelector.select(
            ((<SetShippingOptionWithSelectorDto>dto).preferedShippings),
            availableShippingMethods
          )
          CheckoutHandler.selectShippingOption({
            shippingCode: selectedShippingMethod
          })
        })
    }
  }

  static getAvailablePaymentOptions (): Cypress.Chainable<any> {
    cy.log('**CheckoutHandler.getAvailablePaymentOptions**')
    return cy.getLoc('[data-test-id="checkout-payment-methods-wrapper"] input[type="radio"]').then(paymentInputs => {
      return Array.from(paymentInputs).map(input => { return { code: input.getAttribute('value') } })
    })
  }

  static getAvailableShippingOptions (): Cypress.Chainable<any> {
    cy.log('**CheckoutHandler.getAvailableShippingOptions**')
    return cy.getLoc('[data-test-id="checkout-shipping-methods-wrapper"] input[type="radio"]').then(shippingInputs => {
      return Array.from(shippingInputs).map(input => { return { carrier_code: input.getAttribute('value').split('~')[0] } })
    })
  }

  static typeContactData (field: string, value?: string): void {
    cy.log(`**CheckoutHandler.typeContactData(${field}, ${value})**`)
    if (value === null || value === '') {
      cy.getLocScroll('input#' + field)
        .clear()
        .blur()
    } else {
      cy.getLocScroll('input#' + field)
        .clear()
        .fill(value)
        .blur()
    }
  }

  static verifyContactDataIsValid (field?: string): void {
    cy.log(`**CheckoutHandler.verifyContactDataIsValid(${field})**`)
    cy.getLocScroll('#' + field).should('have.class', 'is-valid')
  }

  static verifySuccessfulHeader (): void {
    cy.log('**CheckoutHandler.verifySuccessfulHeader**')
    cy.url().should('contain', CONFIG_CONST.DATA.url.checkout_thankyou)
    if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.thankyou_page.header).should('be.visible')
    }
  }

  static agreeToTerms (): void {
    cy.log('**CheckoutHandler.agreeToTerms**')
    cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_personal.input).click({ force: true })
    // HOTFIX for sk, follow-up #8524
    if (!['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_marketing.input).click({ force: true })
    }
    if (['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_heureka.input).click({ force: true })
    }
  }

  static wrapOrderNumber (alias: string): Cypress.Chainable<string> {
    cy.log('**CheckoutHandler.wrapOrderNumber**')
    return cy.getLocScroll(CheckoutLocators.thankyou_page.order_number)
      .invoke('text')
      .then(($text) => {
        cy.wrap($text.replace('.', '')).as(alias)
      })
  }

  static verifyProductItemCount (index: number, expected: number): void {
    cy.log('**CheckoutHandler.verifyProductItemCount**')
    cy.getLocScroll(CheckoutLocators.cart.product.qty_input)
      .scrollIntoView({ offset: { left: 0, top: -150 } })
      .eq(index)
      .invoke('val')
      .then((val) => {
        expect(expected).to.be.equal(Number(val.toString()))
      })
  }

  static addDiscountCoupon (code: string): void {
    cy.log('**CheckoutHandler.addDiscountCoupon**')
    cy.getLocScroll(CheckoutLocators.coupon.button).click()
    cy.getLocScroll(CheckoutLocators.coupon.input).clear().fill(code)
    cy.getLocScroll(CheckoutLocators.coupon.confirm_button).click()
  }

  static assertCouponValid (routeName: string): void {
    cy.log('**CheckoutHandler.assertCouponValid**')
    cy.wait('@' + routeName)
      .its('response.statusCode')
      .should('eq', 200)
    cy.getLoc(CheckoutLocators.coupon.error_message).should('not.exist')
  }

  static routeAddCoupon (routeName: string): void {
    cy.log('**CheckoutHandler.routeAddCoupon**')
    cy.intercept('**/graphql').as(routeName)
  }

  static routeUpdateCartItems (routeName: string): void {
    cy.log('**CheckoutHandler.routeUpdateCartItems**')
    cy.intercept('**/graphql').as(routeName)
  }

  static fillMandatoryUserInfo (date: number = Date.now(), dto?: FillMandatoryUserInfoDto): void {
    cy.log('**CheckoutHandler.fillMandatoryUserInfo**')
    const defaultUser = CONFIG_CONST.DATA.user
    dto = dto ?? {}
    cy.getLocScroll(CheckoutLocators.user_info.email).clear().type(dto.email ?? defaultUser.login)
    cy.getLocScroll(CheckoutLocators.user_info.last_name).clear().type(dto.surname ?? defaultUser.surname + ' ' + date)
    cy.getLocScroll(CheckoutLocators.user_info.first_name).clear().type(dto.name ?? defaultUser.name)
    if (!['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      if (!['sk'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.user_info.phone_code).select(dto.phonePrefix ?? defaultUser.phone_prefix)
        cy.getLocScroll(CheckoutLocators.user_info.phone).clear().type(dto.phone ?? defaultUser.phone)
      } else {
        cy.getLocScroll(CheckoutLocators.user_info.phone).clear().type(dto.phone ?? defaultUser.phone)
      }
    } else {
      const phoneWithCode = (dto.phonePrefix ?? defaultUser.phone_prefix) + (dto.phone ?? defaultUser.phone)
      cy.getLocScroll(CheckoutLocators.user_info.phone).clear().type(phoneWithCode)
    }
    if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_billing_info.region).select(dto.region ?? defaultUser.region)
    }
    if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_billing_info.street).clear().type(dto.street ?? defaultUser.street)
      cy.getLocScroll(CheckoutLocators.user_billing_info.street_number).clear().type(dto.streetNumber ?? defaultUser.house_number)
    } else {
      const streetWithNumber = (dto.street ?? defaultUser.street) + ' ' + (dto.streetNumber ?? defaultUser.house_number)
      cy.getLocScroll(CheckoutLocators.user_billing_info.street).clear().type(streetWithNumber)
    }
    cy.getLocScroll(CheckoutLocators.user_billing_info.post_code).clear().type(dto.postCode ?? defaultUser.postcode)
    cy.getLocScroll(CheckoutLocators.user_billing_info.city).clear().type(dto.city ?? defaultUser.city)
  }

  static fillDeliveryData (dto?: FillDeliveryDataDto): void {
    cy.log('**CheckoutHandler.fillDeliveryData**')
    const defaultUser = CONFIG_CONST.DATA.user
    dto = dto ?? {}
    if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_delivery_info.region).select(dto.region ?? defaultUser.region)
    }
    if (!['cz', 'ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_delivery_info.street).clear().type(dto.street ?? defaultUser.street)
      cy.getLocScroll(CheckoutLocators.user_delivery_info.street_number).clear().type(dto.streetNumber ?? defaultUser.house_number)
    } else {
      const streetWithNumber = (dto.street ?? defaultUser.street) + ' ' + (dto.streetNumber ?? defaultUser.house_number)
      cy.getLocScroll(CheckoutLocators.user_delivery_info.street).clear().type(streetWithNumber)
    }
    cy.getLocScroll(CheckoutLocators.user_delivery_info.post_code).clear().type(dto.postCode ?? defaultUser.postcode)
    cy.getLocScroll(CheckoutLocators.user_delivery_info.city).clear().type(dto.city ?? defaultUser.city)
  }

  static fillCompanyInfo (dto?: FillCompanyInfoDto) {
    cy.log('**CheckoutHandler.fillCompanyInfo**')
    dto = dto ?? {}
    const defaultBussiness = CONFIG_CONST.DATA.user.bussiness
    cy.getLocScroll(CheckoutLocators.user_company_info.name).clear().type(dto.name ?? defaultBussiness.name)
    if (!['pl', 'ed', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.log(`config: ${defaultBussiness.cin_id}`)
      cy.log(dto.registrationNumber)
      cy.getLocScroll(CheckoutLocators.user_company_info.registration_number).clear().type(dto.registrationNumber ?? defaultBussiness.cin_id)
    }
    if (['sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_company_info.sk_dic).clear().type(dto.skDic ?? defaultBussiness.sk_dic)
    }
    if (['it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(CheckoutLocators.user_company_info.it_pec).clear().type(dto.itPec ?? CONFIG_CONST.DATA.user.email)
    }
    cy.getLocScroll(CheckoutLocators.user_company_info.vat_id).clear().type(dto.vatId ?? defaultBussiness.vat_id)
  }

  static parsePrice (priceRaw: string): number {
    const priceParsed: number = parseFloat(parseFloat(priceRaw.replace(/,/, '.').replace(/\xa0/g, '')).toFixed(2))
    return String(priceParsed) === String(NaN) ? 0 : priceParsed
  }

  static getCartTotalPrice (): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartTotalPrice**')
    return cy.getLocScroll(CheckoutLocators.cart.total_price)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static getCartItemName (index: number): Cypress.Chainable<string> {
    cy.log('**CheckoutHandler.getCartItemName**')
    return cy.getLocScroll(CheckoutLocators.cart.product.name)
      .eq(index)
      .invoke('text')
  }

  static getCartItemOriginalPrice (index: number): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartItemOriginalPrice**')
    return cy.getLocScroll(CheckoutLocators.cart.product.original_price)
      .eq(index)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static getCartItemPrice (index: number): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartItemPrice**')
    return cy.getLocScroll(CheckoutLocators.cart.product.price)
      .eq(index)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static checkPriceIsEqual (expectedPrice: string, actualPrice: string, modifier: number = 1) {
    cy.getLocScroll(expectedPrice).then((expectedPrice) => {
      cy.getLocScroll(actualPrice).then((actualPrice) => {
        cy.wrap(expectedPrice).should('eq', Number(actualPrice) * modifier)
      })
    })
  }

  static incrementProductQty (index: number): void {
    CheckoutHandler.routeUpdateCartItems('priceUpdate')
    cy.getLocScroll(CheckoutLocators.cart.product.qty_plus).eq(index).click()
    cy.wait('@priceUpdate')
    CommonHandler.waitForFullLoad()
  }

  static decrementProductQty (index: number): void {
    CheckoutHandler.routeUpdateCartItems('priceUpdate')
    // Check the quantity of the product
    cy.getLocScroll(CheckoutLocators.cart.product.number_of_pieces_input).eq(index).invoke('val').then((qty) => {
      if (qty === '1') {
        cy.getLocScroll(CheckoutLocators.cart.product.qty_minus).eq(index).click()
        cy.getLocScroll('.modal-dialog').findLoc(CheckoutLocators.confirm_button).click()
      } else {
        cy.getLocScroll(CheckoutLocators.cart.product.qty_minus).eq(index).click()
      }
    })
    cy.wait('@priceUpdate')
    CommonHandler.waitForFullLoad()
  }

  static getSummaryInfo (): Cypress.Chainable<SummaryInfoDto> {
    return cy.get(CheckoutLocators.review.summary.locator).scrollIntoView({ offset: { left: 0, top: 150 } }).then(summary => {
      const productsPrice = summary.find(CheckoutLocators.review.summary.products_price)
      const discountPrice = summary.find(CheckoutLocators.review.summary.discount_price)
      const shipmentPrice = summary.find(CheckoutLocators.review.summary.shipment_price)
      const paymentPrice = summary.find(CheckoutLocators.review.summary.payment_price)
      const totalPrice = summary.find(CheckoutLocators.review.summary.total_price)
      return {
        productsPrice: (productsPrice) ? this.parsePrice(productsPrice.text()) : 0,
        discountPrice: (discountPrice) ? this.parsePrice(discountPrice.text()) : 0,
        shipmentPrice: (shipmentPrice) ? this.parsePrice(shipmentPrice.text()) : 0,
        paymentPrice: (paymentPrice) ? this.parsePrice(paymentPrice.text()) : 0,
        totalPrice: (totalPrice) ? this.parsePrice(totalPrice.text()) : 0
      }
    })
  }

  static handleAddressVerificationModal (chooseSuggested: boolean): void {
    cy.log('**CheckoutHandler.handleAddressVerificationModal**')
    cy.getLocScroll('body').then(($body) => {
      if ($body.find(CheckoutLocators.address_verification.modal).length > 0) {
        cy.get(CheckoutLocators.address_verification.modal).then($modal => {
          if ($modal.find('input[type="radio"]').length > 0) {
            if (chooseSuggested) {
              cy.get(CheckoutLocators.address_verification.address_input).eq(1).check({ force: true })
            } else {
              cy.get(CheckoutLocators.address_verification.address_input).eq(0).check({ force: true })
            }
          }
        })
        cy.get(CheckoutLocators.confirm_button).click()
      }
    })
  }
}
