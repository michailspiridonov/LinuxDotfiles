import { CheckoutLocators, CommonHandler, CONFIG_CONST } from 'cypress/index'

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
    cy.getLoc('.empty-basket-title').should('be.visible').and('contain.text', emptyCart[CONFIG_CONST.COUNTRY])
  }

  static goToNextStep (): void {
    cy.log('**CheckoutHandler.goToNextStep**')
    if (['sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.scrollTo('bottom')
    }
    cy.getLoc(CheckoutLocators.big_next_button).click()
    CommonHandler.waitForFullLoad()
  }

  static finishOrder (): void {
    cy.log('**CheckoutHandler.finishOrder**')
    cy.getLoc(CheckoutLocators.place_order_button).click()
    CommonHandler.waitForFullLoad()
  }

  static setDeliveryAddress (turnOn: boolean = true): void {
    cy.log(`**CheckoutHandler.setDeliveryAddress (turnOn: ${turnOn})**`)
    if (turnOn) {
      cy.getLoc(CheckoutLocators.different_delivery).check({ force: true })
    } else {
      cy.getLoc(CheckoutLocators.different_delivery).uncheck({ force: true })
    }
  }

  static setCompanyDetails (turnOn: boolean = true): void {
    cy.log(`**CheckoutHandler.setCompanyDetails (turnOn: ${turnOn})**`)
    if (turnOn) {
      cy.getLoc(CheckoutLocators.company_details).check({ force: true })
    } else {
      cy.getLoc(CheckoutLocators.company_details).uncheck({ force: true })
    }
  }

  static selectPaymentOption (option: string): void {
    cy.log(`**CheckoutHandler.selectPaymentOption(${option})**`)
    cy.getLoc(CheckoutLocators.payment.locator).within(() => {
      cy.getLoc('label[for$=' + option + ']').scrollIntoView({ offset: { top: -200, left: 0 } }).click()
      cy.getLoc('input[id$=' + option + ']').should('be.checked')
    })
    CommonHandler.waitForFullLoad()
  }

  static selectShipmentOption (option: string): void {
    cy.log(`**CheckoutHandler.selectShipmentOption(${option})**`)
    cy.getLoc(CheckoutLocators.shipping.locator).within(() => {
      cy.getLoc('label[for$=' + option + ']').click()
      cy.getLoc('input[id$=' + option + ']').should('be.checked')
    })
    CommonHandler.waitForFullLoad()
  }

  static typeContactData (field: string, value?: string): void {
    cy.log(`**CheckoutHandler.typeContactData(${field}, ${value})**`)
    if (value === null || value === '') {
      cy.getLoc('input#' + field)
        .clear()
        .blur()
    } else {
      cy.getLoc('input#' + field)
        .clear()
        .fill(value)
        .blur()
    }
  }

  static verifyContactDataIsValid (field?: string): void {
    cy.log(`**CheckoutHandler.verifyContactDataIsValid(${field})**`)
    cy.getLoc('#' + field).should('have.class', 'is-valid')
  }

  static verifySuccessfulHeader (): void {
    cy.log('**CheckoutHandler.verifySuccessfulHeader**')
    cy.url().should('contain', CONFIG_CONST.DATA.url.checkout_thankyou)
    if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.thankyou_page.header).should('be.visible')
    }
  }

  static agreeToTerms (): void {
    cy.log('**CheckoutHandler.agreeToTerms**')
    cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_personal.input).click({ force: true })
    // HOTFIX for sk, follow-up #8524
    if (!['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_marketing.input).click({ force: true })
    }
    if (['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_heureka.input).click({ force: true })
    }
  }

  static wrapOrderNumber (alias: string): Cypress.Chainable<string> {
    cy.log('**CheckoutHandler.wrapOrderNumber**')
    return cy.getLoc(CheckoutLocators.thankyou_page.order_number)
      .invoke('text')
      .then(($text) => {
        cy.wrap($text.replace('.', '')).as(alias)
      })
  }

  static verifyProductItemCount (index: number, expected: number): void {
    cy.log('**CheckoutHandler.verifyProductItemCount**')
    cy.getLoc(CheckoutLocators.cart.product.qty_input)
      .scrollIntoView({ offset: { left: 0, top: -150 } })
      .eq(index)
      .invoke('val')
      .then((val) => {
        expect(expected).to.be.equal(Number(val.toString()))
      })
  }

  static addDiscountCoupon (code: string): void {
    cy.log('**CheckoutHandler.addDiscountCoupon**')
    cy.getLoc(CheckoutLocators.coupon.button).click()
    cy.getLoc(CheckoutLocators.coupon.input).clear().fill(code)
    cy.getLoc(CheckoutLocators.coupon.confirm_button).click()
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
    cy.getLoc(CheckoutLocators.user_info.email).clear().type(dto.email ?? defaultUser.login)
    cy.getLoc(CheckoutLocators.user_info.last_name).clear().type(dto.surname ?? defaultUser.surname + ' ' + date)
    cy.getLoc(CheckoutLocators.user_info.first_name).clear().type(dto.name ?? defaultUser.name)
    if (!['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_info.phone_code).select(dto.phonePrefix ?? defaultUser.phone_prefix)
      cy.getLoc(CheckoutLocators.user_info.phone).clear().type(dto.phone ?? defaultUser.phone)
    } else {
      const phoneWithCode = (dto.phonePrefix ?? defaultUser.phone_prefix) + (dto.phone ?? defaultUser.phone)
      cy.getLoc(CheckoutLocators.user_info.phone).clear().type(phoneWithCode)
    }
    if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_billing_info.region).select(dto.region ?? defaultUser.region)
    }
    if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_billing_info.street).clear().type(dto.street ?? defaultUser.street)
      cy.getLoc(CheckoutLocators.user_billing_info.street_number).clear().type(dto.streetNumber ?? defaultUser.house_number)
    } else {
      const streetWithNumber = (dto.street ?? defaultUser.street) + ' ' + (dto.streetNumber ?? defaultUser.house_number)
      cy.getLoc(CheckoutLocators.user_billing_info.street).clear().type(streetWithNumber)
    }
    cy.getLoc(CheckoutLocators.user_billing_info.post_code).clear().type(dto.postCode ?? defaultUser.postcode)
    cy.getLoc(CheckoutLocators.user_billing_info.city).clear().type(dto.city ?? defaultUser.city)
  }

  static fillDeliveryData (dto?: FillDeliveryDataDto): void {
    cy.log('**CheckoutHandler.fillDeliveryData**')
    const defaultUser = CONFIG_CONST.DATA.user
    dto = dto ?? {}
    if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_delivery_info.region).select(dto.region ?? defaultUser.region)
    }
    if (!['cz', 'ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_delivery_info.street).clear().type(dto.street ?? defaultUser.street)
      cy.getLoc(CheckoutLocators.user_delivery_info.street_number).clear().type(dto.streetNumber ?? defaultUser.house_number)
    } else {
      const streetWithNumber = (dto.street ?? defaultUser.street) + ' ' + (dto.streetNumber ?? defaultUser.house_number)
      cy.getLoc(CheckoutLocators.user_delivery_info.street).clear().type(streetWithNumber)
    }
    cy.getLoc(CheckoutLocators.user_delivery_info.post_code).clear().type(dto.postCode ?? defaultUser.postcode)
    cy.getLoc(CheckoutLocators.user_delivery_info.city).clear().type(dto.city ?? defaultUser.city)
  }

  static fillCompanyInfo (dto?: FillCompanyInfoDto) {
    cy.log('**CheckoutHandler.fillCompanyInfo**')
    dto = dto ?? {}
    const defaultBussiness = CONFIG_CONST.DATA.user.bussiness
    cy.getLoc(CheckoutLocators.user_company_info.name).clear().type(dto.name ?? defaultBussiness.name)
    if (!['pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_company_info.registration_number).clear().type(dto.registrationNumber ?? defaultBussiness.vat_id)
    }
    if (['sk'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLoc(CheckoutLocators.user_company_info.sk_dic).clear().type(dto.skDic ?? defaultBussiness.sk_dic)
    }
    cy.getLoc(CheckoutLocators.user_company_info.vat_id).clear().type(dto.vatId ?? defaultBussiness.tax_id)
  }

  static parsePrice (priceRaw: string): number {
    const priceParsed: number = parseFloat(parseFloat(priceRaw.replace(/,/, '.').replace(/\xa0/g, '')).toPrecision(4))
    return String(priceParsed) === String(NaN) ? 0 : priceParsed
  }

  static getCartTotalPrice (): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartTotalPrice**')
    return cy.getLoc(CheckoutLocators.cart.total_price)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static getCartItemName (index: number): Cypress.Chainable<string> {
    cy.log('**CheckoutHandler.getCartItemName**')
    return cy.getLoc(CheckoutLocators.cart.product.name)
      .eq(index)
      .invoke('text')
  }

  static getCartItemOriginalPrice (index: number): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartItemOriginalPrice**')
    return cy.getLoc(CheckoutLocators.cart.product.original_price)
      .eq(index)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static getCartItemPrice (index: number): Cypress.Chainable<number> {
    cy.log('**CheckoutHandler.getCartItemPrice**')
    return cy.getLoc(CheckoutLocators.cart.product.price)
      .eq(index)
      .invoke('text')
      .then((price) => {
        return this.parsePrice(price)
      })
  }

  static checkPriceIsEqual (expectedPrice: string, actualPrice: string, modifier: number = 1) {
    cy.getLoc(expectedPrice).then((expectedPrice) => {
      cy.getLoc(actualPrice).then((actualPrice) => {
        cy.wrap(expectedPrice).should('eq', Number(actualPrice) * modifier)
      })
    })
  }

  static incrementProductQty (index: number): void {
    CheckoutHandler.routeUpdateCartItems('priceUpdate')
    cy.getLoc(CheckoutLocators.cart.product.qty_plus).eq(index).click()
    cy.wait('@priceUpdate')
    CommonHandler.waitForFullLoad()
  }

  static decrementProductQty (index: number): void {
    CheckoutHandler.routeUpdateCartItems('priceUpdate')
    // Check the quantity of the product
    cy.getLoc(CheckoutLocators.cart.product.number_of_pieces_input).eq(index).invoke('val').then((qty) => {
      if (qty === 1) {
        cy.log(`**${qty}**`)
        cy.getLoc(CheckoutLocators.cart.product.qty_minus).eq(index).click()
        cy.get('.modal-dialog').findLoc(CheckoutLocators.confirm_button).click()
        cy.wait('@priceUpdate')
        CommonHandler.waitForFullLoad()
      } else {
        cy.log(`**${qty}**`)
        cy.getLoc(CheckoutLocators.cart.product.qty_minus).eq(index).click()
        cy.wait('@priceUpdate')
        CommonHandler.waitForFullLoad()
      }
    })
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
}
