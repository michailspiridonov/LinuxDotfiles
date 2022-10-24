export const CheckoutLocators = {
  cart: {
    product: {
      product_row: '.cart-item__inner',
      number_of_pieces_input: "[data-test-id='checkout-product-quantity-input']",
      name: '.cart .cart-item__name',
      qty_input: '.counter > input',
      qty_minus: "[data-test-id='checkout-product-quantity-decrease-button']",
      qty_plus: "[data-test-id='checkout-product-quantity-increase-button']",
      original_price: "[data-test-id='checkout-item-original-price']",
      price: "[data-test-id='checkout-item-total-price']",
      delete_btn: '[data-test-id="checkout-product-remove-button"]'
    },
    total_price: "[data-test-id='checkout-total-price']"
  },
  big_next_button: '[data-test-id="checkout-continue-button"]',
  shipping: {
    locator: '#shippingMethods',
    option: '#shippingMethods .custom-radio',
    price: '#shippingMethods span strong'
  },
  payment: {
    locator: '#paymentMethods',
    option: '#paymentMethods .custom-radio',
    price: '#paymentMethods span strong'
  },
  items: {
    locator: 'div.cart'
  },
  agreeToTerms: {
    terms_conditions_personal: {
      input: '#privacyAccept',
      label: 'label[for=privacyAccept]'
    },
    terms_conditions_marketing: {
      input: {
        cmn: '#tcAccept',
        ed: '#pdAccept',
        pl: '#pdAccept'
      },
      label: {
        cmn: 'label[for=tcAccept]',
        ed: 'label[for=pdAccept]',
        pl: 'label[for=pdAccept]'
      }
    },
    terms_conditions_heureka: {
      input: {
        cz: '#priceComparisonAccept',
        sk: '#heurekaAccept'
      },
      label: {
        cz: 'label[for=priceComparisonAccept]',
        sk: 'label[for=heurekaAccept]'
      }
    }
  },
  user_info: {
    email: '#email',
    last_name: '#lastname',
    first_name: '#firstname',
    phone_code: '#phoneCode',
    phone: '#phoneNumber'
  },
  user_billing_info: {
    street: '#billing__street',
    street_number: '#billing_street-number',
    post_code: '#billing__postcode',
    city: '#billing__city',
    region: 'select#billing__regionCode'
  },
  user_delivery_info: {
    street: '#street',
    street_number: '#street-number',
    post_code: '#postcode',
    city: '#city',
    region: 'select#regionCode'
  },
  address_verification: {
    suggested_address: '#suggested-address',
    custom_address: '#custom-address'
  },
  different_delivery: 'input#show-shipping-address',
  company_details: '#show-company-details',
  user_company_info: {
    name: '#companyName',
    registration_number: '#companyRegistrationNumber',
    vat_id: '#vatId',
    sk_dic: { sk: '#skDic' }
  },
  review: {
    user_info: {
      fullname: '[data-test-id="checkout-review-contact-name"]',
      email: '[data-test-id="checkout-review-contact-email"]',
      phone: '[data-test-id="checkout-review-contact-phone"]'
    },
    billing_info: {
      street: '[data-test-id="checkout-review-billing-street"]',
      postcode: '[data-test-id="checkout-review-billing-post-code"]',
      city: '[data-test-id="checkout-review-billing-city"]',
      region: '[data-test-id="checkout-review-billing-region"]'
    },
    summary: {
      locator: '[data-test-id="checkout-review-order-summary-wrapper"]',
      products_price: '[data-test-id="checkout-review-order-summary-products-price"]',
      discount_price: '[data-test-id="checkout-review-order-summary-total-discount"]',
      shipment_price: '[data-test-id="checkout-review-order-summary-shipping-price"]',
      payment_price: '[data-test-id="checkout-review-order-summary-payment-price"]',
      total_price: '[data-test-id="checkout-review-order-summary-total-price"]'
    }
  },
  thankyou_page: {
    header: '[data-test-id="checkout-thank-you-successful-header"]',
    order_number: '[data-test-id*="order-number"] strong'
  },
  coupon: {
    button: 'button.btn-coupon',
    input: '#coupon',
    confirm_button: 'div > button.btn-success-highlighted.btn-apply',
    error_message: '.cart-summary .d-block'
  },
  confirm_button: '.btn-success',
  place_order_button: '[data-test-id="checkout-continue-button"]'
}
