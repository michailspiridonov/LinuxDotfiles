import {
  TAG,
  CONFIG_CONST,
  CheckoutApiHandler,
  CommonHandler,
  CheckoutLocators,
  CheckoutHandler,
  WAIT_CONST,
  ShippingMethodStorage
} from 'cypress/index'

describe('Check checkout steps', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CheckoutApiHandler.addAvailableProductToCart().then(data => {
      cy.wrap(data.cartId).as('cartId')
      cy.wrap(data.product).as('product')
    })
    cy.visit(CONFIG_CONST.DATA.url.checkout)
    CommonHandler.waitForFullLoad()
  })

  describe('Checkout step 1', () => {
    it('2270 - Edit Quantity Of Product', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**checking that 1 product is in the cart:** ')
      cy.getLocScroll(CheckoutLocators.cart.product.product_row).should('have.length', 1)

      cy.log('**checking that there is 1 piece of product:** ')
      cy.get(CheckoutLocators.cart.product.number_of_pieces_input).invoke('val').should('be.eq', '1')

      cy.log('**checking that total price is the same as product price:** ')
      CheckoutHandler.getCartItemPrice(0).as('productPrice')
      CheckoutHandler.getCartTotalPrice().as('totalPrice')
      CheckoutHandler.checkPriceIsEqual('@productPrice', '@totalPrice')

      cy.log('**increase amount of pieces by 1 and check there are 2 pieces of product:** ')
      CheckoutHandler.incrementProductQty(0)
      cy.get(CheckoutLocators.cart.product.number_of_pieces_input).invoke('val').should('be.eq', '2')

      cy.log('**check that product price has doubled:** ')
      CheckoutHandler.getCartItemPrice(0).as('productPriceForTwo')
      CheckoutHandler.checkPriceIsEqual('@productPriceForTwo', '@productPrice', 2)

      cy.log('**check that total price has doubled:** ')
      CheckoutHandler.getCartTotalPrice().as('totalPriceAfterIncrease')
      CheckoutHandler.checkPriceIsEqual('@totalPriceAfterIncrease', '@totalPrice', 2)

      cy.log('**decrease amount of pieces by 1 and check there is 1 piece of product:** ')
      CheckoutHandler.decrementProductQty(0)
      cy.get(CheckoutLocators.cart.product.number_of_pieces_input).invoke('val').should('be.eq', '1')

      cy.log('**check the product price after decreasing number of pieces:** ')
      CheckoutHandler.getCartItemPrice(0).as('productPriceAfterDecrease')
      CheckoutHandler.checkPriceIsEqual('@productPriceAfterDecrease', '@productPrice')

      cy.log('**check total price after decreasing number of pieces:** ')
      CheckoutHandler.getCartTotalPrice().as('totalPriceAfterDecrease')
      CheckoutHandler.checkPriceIsEqual('@totalPriceAfterDecrease', '@totalPrice')
    })

    it('2272 - Remove Product From Cart', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**delete the product from the cart: **')
      cy.getLocScroll(CheckoutLocators.cart.product.delete_btn).click()
      cy.getLocScroll(CheckoutLocators.confirm_button).click()

      cy.log('**check the cart is empty after removing product:**')
      CommonHandler.waitForFullLoad()
      CheckoutHandler.verifyEmptyBasket()

      cy.log('**add product to the cart again:** ')
      CheckoutApiHandler.addAvailableProductToCart()
      cy.visit(CONFIG_CONST.DATA.url.checkout)
      CommonHandler.waitForFullLoad()

      cy.log('**remove the product using \'-\' button:**')
      CheckoutHandler.decrementProductQty(0)

      cy.log('**check the cart is empty after removing product:**')
      CommonHandler.waitForFullLoad()
      CheckoutHandler.verifyEmptyBasket()
    })

    it('8266 - Check it is possible to continue to step 2', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**check it is possible to continue to step 2:** ')
      cy.getLocScroll(CheckoutLocators.big_next_button).click()
      CommonHandler.waitForFullLoad()
      cy.url().should('eq', CONFIG_CONST.DATA.url.checkout_2_step)
      cy.visit(CONFIG_CONST.DATA.url.checkout)
      CommonHandler.waitForFullLoad()
    })
  })

  describe('Checkout step 2', () => {
    beforeEach(() => {
      CheckoutHandler.goToNextStep()
      CommonHandler.waitForFullLoad()
    })

    it.only('8119 - Try all shipping options', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.getLoc('@cartId').then((cartId) => {
        CheckoutApiHandler.getAvailableShippingMethodsCodes(String(cartId)).then((methods) => {
          const simpleShippingMethods = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY)
          const shippingMethodsWithPickup = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY, true)
          const shippingMethodsWithZipCode = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY, true, true)

          const listOfSimpleShippingMethods: string[] = []
          const listOfShippingMethodsWithPickup: string[] = []
          const listOfShippingMethodsWithZipCode: string[] = []

          for (const element of simpleShippingMethods) {
            listOfSimpleShippingMethods.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(element).carrier))
          }

          for (const element of shippingMethodsWithPickup) {
            listOfShippingMethodsWithPickup.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(element).carrier))
          }

          for (const element of shippingMethodsWithZipCode) {
            listOfShippingMethodsWithZipCode.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(element).carrier))
          }

          for (const element of methods) {
            // Remove this condition after 7.7.2022, should be no more valid.
            if (element.carrier_code === 'drmaxpickupshipping') {
              continue
            }
            CheckoutHandler.selectShipmentOption(`"${element.carrier_code}~${element.method_code}"`)
            if ((listOfShippingMethodsWithPickup.indexOf(`"${element.carrier_code}"`)) !== -1) {
              cy.log('**PICKUP METHOD**')
              cy.getLocScroll('.modal-body').within(() => {
                cy.getLocScroll('button.close:visible').click()
              })
              cy.getLoc('.modal-body').should('not.exist')
            } else if ((listOfShippingMethodsWithZipCode.indexOf(`"${element.carrier_code}"`)) !== -1) {
              cy.log('**ZIP CODE METHOD**')
              cy.getLocScroll(`[id="${element.carrier_code}~${element.method_code}"]`)
                .parent()
                .within(() => {
                  cy.getLocScroll('div > input.form-control')
                    .type(CONFIG_CONST.DATA.user.postcode)
                    .blur()
                })
              if (['cz'].includes(CONFIG_CONST.COUNTRY)) {
                cy.getLocScroll('.modal-body').within(() => {
                  cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE)
                  cy.getLocScroll('.close').click({ force: true })
                })
                cy.getLoc('.modal-body').should('not.exist')
              }
            } else if ((listOfSimpleShippingMethods.indexOf(`"${element.carrier_code}"`)) !== -1) {
              cy.log('**SIMPLE METHOD**')
            } else {
              throw new Error('Unknown shipping method')
            }
            cy.getLocScroll(`[id="${element.carrier_code}~${element.method_code}"]`)
              .parent()
              .should('have.class', 'shipping-radio--selected')
          }
        })
      })
    })

    it('8120 - Try all payment options', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.getLoc('@cartId').then((cartId) => {
        CheckoutApiHandler.getAvailablePaymentMethods(String(cartId)).then((methods) => {
          for (let i = 0; i < methods.length; i++) {
            CheckoutHandler.selectPaymentOption(methods[i].code)
          }
        })
      })
    })

    it('8121 - Go to next step', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.selectShipmentOption(CONFIG_CONST.DATA.default_shipping_method)
      CheckoutHandler.selectPaymentOption(CONFIG_CONST.DATA.default_payment_method)
      CheckoutHandler.goToNextStep()
      cy.url().should('contain', CONFIG_CONST.DATA.url.checkout_3_step)
    })
  })

  describe('Checkout step 3', () => {
    beforeEach(() => {
      CheckoutHandler.goToNextStep()
      CheckoutHandler.selectShipmentOption(CONFIG_CONST.DATA.default_shipping_method)
      CheckoutHandler.selectPaymentOption(CONFIG_CONST.DATA.default_payment_method)
      CheckoutHandler.goToNextStep()
    })

    it('2277 - Insert Contact Information', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.fillMandatoryUserInfo()
      CheckoutHandler.verifyContactDataIsValid('email')
      CheckoutHandler.verifyContactDataIsValid('firstname')
      CheckoutHandler.verifyContactDataIsValid('lastname')
      CheckoutHandler.verifyContactDataIsValid('phoneNumber')
    })

    it('2278 - Insert Billing Information', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.fillMandatoryUserInfo()
      cy.getLocScroll('#email').click()
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.user_billing_info.region).should('have.class', 'is-valid')
      }
      CheckoutHandler.verifyContactDataIsValid('billing__street')
      if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('billing_street-number')
      }
      CheckoutHandler.verifyContactDataIsValid('billing__postcode')
      CheckoutHandler.verifyContactDataIsValid('billing__city')
    })

    it('2279 - Insert Shipment Address', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.setDeliveryAddress()
      CheckoutHandler.fillDeliveryData()
      cy.getLocScroll('#email').click()
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.user_delivery_info.region).should('have.class', 'is-valid')
      }
      CheckoutHandler.verifyContactDataIsValid('street')
      if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('street-number')
      }
      CheckoutHandler.verifyContactDataIsValid('postcode')
      CheckoutHandler.verifyContactDataIsValid('city')
    })

    it('2280 - Insert Billing Information of Legal Entity', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.setCompanyDetails()
      CheckoutHandler.fillCompanyInfo()
      cy.getLocScroll('#email').click()
      if (!['pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('companyRegistrationNumber')
      }
      CheckoutHandler.verifyContactDataIsValid('vatId')
      if (['sk'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('skDic')
      }
    })

    it('7774 - Check proceeding to step 4', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.fillMandatoryUserInfo()
      CheckoutHandler.setDeliveryAddress()
      CheckoutHandler.fillDeliveryData()
      CheckoutHandler.setCompanyDetails()
      CheckoutHandler.fillCompanyInfo()
      CheckoutHandler.goToNextStep()
      CheckoutHandler.handleAddressVerificationModal(false)
      CommonHandler.waitForFullLoad()
      cy.url().should('equal', CONFIG_CONST.DATA.url.checkout_4_step)
    })
  })

  describe('Checkout step 4', () => {
    beforeEach(() => {
      CheckoutHandler.goToNextStep()
      CheckoutHandler.selectShipmentOption(CONFIG_CONST.DATA.default_shipping_method)
      CheckoutHandler.selectPaymentOption(CONFIG_CONST.DATA.default_payment_method)
      CheckoutHandler.goToNextStep()
      CheckoutHandler.fillMandatoryUserInfo()
      CheckoutHandler.goToNextStep()
      CheckoutHandler.handleAddressVerificationModal(false)
    })

    it('2292 - Terms and Conditions - Check Options', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.agreeToTerms()
      cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_personal.input).should('not.have.class', 'is-invalid')
      // HOTFIX follow-up #8524
      if (!['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_marketing.input).should('not.have.class', 'is-invalid')
      }
      if (['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.agreeToTerms.terms_conditions_heureka.input).should('not.have.class', 'is-invalid')
      }
    })

    it('7853 - Check summary', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.getLoc('@product').then(product => {
        const productName = String((<any>product).name)
        CheckoutHandler.getCartItemName(0).should('contain', productName)
      })
      cy.getLocScroll(CheckoutLocators.review.billing_info.street).should('contain', CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
      cy.getLocScroll(CheckoutLocators.review.billing_info.postcode).should('contain', CONFIG_CONST.DATA.user.postcode)
      cy.getLocScroll(CheckoutLocators.review.billing_info.city).should('contain', CONFIG_CONST.DATA.user.city)
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLocScroll(CheckoutLocators.review.billing_info.region).should('contain', CONFIG_CONST.DATA.user.region)
      }
      cy.getLocScroll(CheckoutLocators.review.user_info.fullname).should('contain', CONFIG_CONST.DATA.user.name + ' ' + CONFIG_CONST.DATA.user.surname)
      cy.getLocScroll(CheckoutLocators.review.user_info.email).should('contain', CONFIG_CONST.DATA.user.email)
      cy.getLocScroll(CheckoutLocators.review.user_info.phone).should('contain', CONFIG_CONST.DATA.user.phone)

      CheckoutHandler.getSummaryInfo().then(info => {
        expect(info.productsPrice + info.shipmentPrice + info.paymentPrice - info.discountPrice).equals(info.totalPrice)
      })
    })

    it('7861 - Check proceeding to ThankYou page', { tags: [TAG.P1] }, () => {
      CheckoutHandler.agreeToTerms()
      CheckoutHandler.finishOrder()
      cy.url().should('equal', CONFIG_CONST.DATA.url.checkout_thankyou)
    })
  })
})
