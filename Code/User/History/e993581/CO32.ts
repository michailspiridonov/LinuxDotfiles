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
    xit('2270 - Edit Quantity Of Product', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**checking that 1 product is in the cart:** ')
      cy.getLoc(CheckoutLocators.cart.product.product_row).should('have.length', 1)

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

    xit('2272 - Remove Product From Cart', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**delete the product from the cart: **')
      cy.getLoc(CheckoutLocators.cart.product.delete_btn).click()
      cy.getLoc(CheckoutLocators.confirm_button).click()

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

    xit('8266 - Check it is possible to continue to step 2', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.log('**check it is possible to continue to step 2:** ')
      cy.getLoc(CheckoutLocators.big_next_button).click()
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

    xit('8119 - Try all shipping options', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.get('@cartId').then((cartId) => {
        CheckoutApiHandler.getAvailableShippingMethodsCodes(String(cartId)).then((methods) => {
          const simpleShippingMethods = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY)
          const shippingMethodsWithPickup = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY, true)
          const shippingMethodsWithZipCode = ShippingMethodStorage.getShortcutsByCountry(CONFIG_CONST.COUNTRY, true, true)

          const listOfSimpleShippingMethods: string [] = []
          const listOfShippingMethodsWithPickup: string [] = []
          const listOfShippingMethodsWithZipCode: string [] = []

          for (let i = 0; i < simpleShippingMethods.length; i++) {
            listOfSimpleShippingMethods.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(simpleShippingMethods[i]).carrier))
          }

          for (let i = 0; i < shippingMethodsWithPickup.length; i++) {
            listOfShippingMethodsWithPickup.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(shippingMethodsWithPickup[i]).carrier))
          }

          for (let i = 0; i < shippingMethodsWithZipCode.length; i++) {
            listOfShippingMethodsWithZipCode.push(JSON.stringify(ShippingMethodStorage.getCodeByShortcut(shippingMethodsWithZipCode[i]).carrier))
          }

          for (let i = 0; i < methods.length; i++) {
            CheckoutHandler.selectShipmentOption(`"${methods[i].carrier_code}~${methods[i].method_code}"`)
            if ((listOfShippingMethodsWithPickup.indexOf(`"${methods[i].carrier_code}"`)) !== -1) {
              cy.log('**PICKUP METHOD**')
              cy.get('.modal-body').within(() => {
                cy.get('button.close:visible').click()
              })
              cy.get('.modal-body').should('not.exist')
            } else if ((listOfShippingMethodsWithZipCode.indexOf(`"${methods[i].carrier_code}"`)) !== -1) {
              cy.log('**ZIP CODE METHOD**')
              cy.get(`[id="${methods[i].carrier_code}~${methods[i].method_code}"]`)
                .parent()
                .within(() => {
                  cy.get('div > input.form-control')
                    .type(CONFIG_CONST.DATA.user.postcode)
                    .blur()
                })
              if (['cz'].includes(CONFIG_CONST.COUNTRY)) {
                cy.get('.modal-body').within(() => {
                  cy.wait(WAIT_CONST.WAIT_FOR_NSF_RESPONSE)
                  cy.get('.close').click({ force: true })
                })
                cy.get('.modal-body').should('not.exist')
              }
            } else if ((listOfSimpleShippingMethods.indexOf(`"${methods[i].carrier_code}"`)) !== -1) {
              cy.log('**SIMPLE METHOD**')
            } else {
              throw new Error('Unknown shipping method')
            }
            cy.get(`[id="${methods[i].carrier_code}~${methods[i].method_code}"]`)
              .parent()
              .should('have.class', 'shipping-radio--selected')
          }
        })
      })
    })

    xit('8120 - Try all payment options', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.get('@cartId').then((cartId) => {
        CheckoutApiHandler.getAvailablePaymentMethods(String(cartId)).then((methods) => {
          for (let i = 0; i < methods.length; i++) {
            CheckoutHandler.selectPaymentOption(methods[i].code)
          }
        })
      })
    })

    xit('8121 - Go to next step', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
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

    xit('2277 - Insert Contact Information', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.fillMandatoryUserInfo()
      CheckoutHandler.verifyContactDataIsValid('email')
      CheckoutHandler.verifyContactDataIsValid('firstname')
      CheckoutHandler.verifyContactDataIsValid('lastname')
      CheckoutHandler.verifyContactDataIsValid('phoneNumber')
    })

    xit('2278 - Insert Billing Information', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.fillMandatoryUserInfo()
      cy.get('#email').click()
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLoc(CheckoutLocators.user_billing_info.region).should('have.class', 'is-valid')
      }
      CheckoutHandler.verifyContactDataIsValid('billing__street')
      if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('billing_street-number')
      }
      CheckoutHandler.verifyContactDataIsValid('billing__postcode')
      CheckoutHandler.verifyContactDataIsValid('billing__city')
    })

    xit('2279 - Insert Shipment Address', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.setDeliveryAddress()
      CheckoutHandler.fillDeliveryData()
      cy.get('#email').click()
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLoc(CheckoutLocators.user_delivery_info.region).should('have.class', 'is-valid')
      }
      CheckoutHandler.verifyContactDataIsValid('street')
      if (['sk', 'pl', 'ed'].includes(CONFIG_CONST.COUNTRY)) {
        CheckoutHandler.verifyContactDataIsValid('street-number')
      }
      CheckoutHandler.verifyContactDataIsValid('postcode')
      CheckoutHandler.verifyContactDataIsValid('city')
    })

    xit('2280 - Insert Billing Information of Legal Entity', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      CheckoutHandler.setCompanyDetails()
      CheckoutHandler.fillCompanyInfo()
      cy.get('#email').click()
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
      CheckoutHandler.handleAddressVerificationModal(true)
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
      cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_personal.input).should('not.have.class', 'is-invalid')
      // HOTFIX follow-up #8524
      if (!['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_marketing.input).should('not.have.class', 'is-invalid')
      }
      if (['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLoc(CheckoutLocators.agreeToTerms.terms_conditions_heureka.input).should('not.have.class', 'is-invalid')
      }
    })

    it('7853 - Check summary', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      cy.getLoc('@product').then(product => {
        const productName = String((<any>product).name)
        CheckoutHandler.getCartItemName(0).should('contain', productName)
      })
      cy.getLoc(CheckoutLocators.review.billing_info.street).should('contain', CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
      cy.getLoc(CheckoutLocators.review.billing_info.postcode).should('contain', CONFIG_CONST.DATA.user.postcode)
      cy.getLoc(CheckoutLocators.review.billing_info.city).should('contain', CONFIG_CONST.DATA.user.city)
      if (['ro', 'ssb', 'it'].includes(CONFIG_CONST.COUNTRY)) {
        cy.getLoc(CheckoutLocators.review.billing_info.region).should('contain', CONFIG_CONST.DATA.user.region)
      }
      cy.getLoc(CheckoutLocators.review.user_info.fullname).should('contain', CONFIG_CONST.DATA.user.name + ' ' + CONFIG_CONST.DATA.user.surname)
      cy.getLoc(CheckoutLocators.review.user_info.email).should('contain', CONFIG_CONST.DATA.user.email)
      cy.getLoc(CheckoutLocators.review.user_info.phone).should('contain', CONFIG_CONST.DATA.user.phone)

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
