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
      price_per_product_label: '.cart-item__per-piece-label',
      delete_btn: '[data-test-id="checkout-product-remove-button"]'
    },
    remove_modal: {
      remove_button: '.modal-footer .btn-success'
    },
    total_price: "[data-test-id='checkout-total-price']"
  },
  big_next_button: '[data-test-id="checkout-continue-button"]',
  homepage: '.header-logo',
  back_to_store: '[class*="empty-basket-content"] > a',
  products: '.col-md-12',
  pickups: {
    personal: {
      locator: '#checkout-submenu-step2-personal',
      panel: 'div[class*="js-pharm-toggler"] #pharm-list'
    },
    remove_modal: {
      remove_button: '.modal-footer .btn-success'
    },
    shipment: {
      locator: '#checkout-submenu-step2-shipment',
      panel: '[class*="tab-pane active"] [class="total-price-in"]'
    }
  },
  recomended_products: '#ps_box_basketCrosssell',
  pharmacy_modal_bottom: '.pickup-info__bottom',
  pharmacy_list: 'pharm-list-in-content',
  pharmacy_list_item: '.pickup-list__item',
  pharmacy_modal_confirm_button: 'button.btn-success-highlighted',
  pharmacy_information: '.pickup-info__inner',
  first_pharmacy: {
    panel: 'div[class="pharm-list-in-content"] li:first-of-type',
    check_selector: 'h3[class*="text-muted"]'
  },
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
  pharmacy_modal: {
    zoom_in_button: {
      cmn: '.gm-bundled-control > div:nth-child(2) > div > button',
      sk: '.gm-bundled-control [title=Priblížiť]'
    },
    zoom_out_button: {
      cmn: '.gm-bundled-control > div:nth-child(2) > div > button:nth-child(3)',
      sk: '.gm-bundled-control [title=Vzdialiť]'
    },
    search_pharmacies_input: {
      cmn: 'div.place-search #autocomplete'
    },
    list_item: {
      cmn: 'div.pickup-list__item'
    },
    detail: {
      cmn: '.pickup-info'
    },
    back_to_pharmacies_button: {
      cmn: '.pickup-info__top__button'
    },
    select_pharmacy_button: {
      cmn: '.pickup-info button.btn-success-highlighted'
    }
  },
  couriers: {
    delivery_time: 'span.shipping-radio__delivery-calculation-text',
    ceska_posta: {
      id: '[class="custom-control-label"][for="drmaxshippingczechpost"]',
      radio: '[type="radio"]#drmaxshippingczechpost'
    },
    shipment: {
      locator: '#checkout-submenu-step2-shipment',
      panel: '[class*="tab-pane active"] [class="total-price-in"]',
      dpd: {
        id: '[class="custom-control-label"][for="drmaxshippingdpd"]',
        radio: '[type="radio"]#drmaxshippingdpd'
      }
    },
    click_collect: '#drmaxclickandcollectshipping_drmaxclickandcollectshipping',
    recomended_products: '#ps_box_basketCrosssell',
    couriers: {
      delivery_time: '.container div:nth-child(2)',
      ceska_posta: {
        id: '[class="custom-control-label"][for="drmaxshippingczechpost"]',
        radio: '[type="radio"]#drmaxshippingczechpost'
      },
      ppl: {
        id: '[class="custom-control-label"][for="drmaxshippingppl"]',
        radio: '[type="radio"]#drmaxshippingppl'
      },
      dpd: {
        id: '[class="custom-control-label"][for="drmaxshippingdpd"]',
        radio: '[type="radio"]#drmaxshippingdpd'
      }
    },
    payments: {
      cashondelivery: {
        id: '[class="custom-control-label"][for="cashondelivery"]',
        radio: '[type="radio"]#cashondelivery'
      },
      csob: {
        id: '[class="custom-control-label"][for="csob_gateway"]',
        radio: '[type="radio"]#csob_gateway'
      },
      edenred: {
        id: '[class="custom-control-label"][for="edenred"]',
        radio: '[type="radio"]#edenred'
      },
      benefit: {
        id: '[class="custom-control-label"][for="benefit"]',
        radio: '[type="radio"]#benefit'
      }
    },
    items: {
      locator: 'figure.d-flex.align-items-center.m-0',
      delivery_time: 'header > div > div.mt-1',
      counter: '#counter-input',
      delete: '.trash-anim'
    },
    csob: {
      id: '[class="custom-control-label"][for="csob_gateway"]',
      radio: '[type="radio"]#csob_gateway'
    },
    edenred: {
      id: '[class="custom-control-label"][for="edenred"]',
      radio: '[type="radio"]#edenred'
    },
    benefit: {
      id: '[class="custom-control-label"][for="benefit"]',
      radio: '[type="radio"]#benefit'
    }
  },
  contact_form: '#contact-form',
  pharmacy_form: '#pharm-list',
  order_placed: {
    delivery_info: ':nth-child(3)'
  },
  items: {
    locator: 'div.cart',
    delivery_time: '.cart-item__delivery',
    cz_items: '.table > tbody > tr > :nth-child(1)'
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
    form: '.contact-form',
    email: '#email',
    last_name: '#lastname',
    first_name: '#firstname',
    phone_code: '#phoneCode',
    phone: '#phoneNumber'
  },
  user_billing_info: {
    form: '.billing-form',
    street: '#billing__street',
    street_number: '#billing_street-number',
    post_code: '#billing__postcode',
    city: '#billing__city',
    region: 'select#billing__regionCode',
    country: 'select#billing__countryCode'
  },
  user_delivery_info: {
    street: '#street',
    street_number: '#street-number',
    post_code: '#postcode',
    city: '#city',
    region: 'select#regionCode',
    country: 'select#countryCode'
  },
  different_delivery: 'input#show-shipping-address',
  company_details: '#show-company-details',
  user_company_info: {
    name: '#companyName',
    registration_number: '#companyRegistrationNumber',
    vat_id: '#vatId',
    sk_dic: { sk: '#skDic' },
    street: { cz: '#company-street' },
    city: { cz: '#company-city' },
    post_code: { cz: '#company-postal' },
    country: { cz: '#billing-country' }
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
    order_number: '[data-test-id*="order-number"] strong',
    countdown: '.forgotten-products__timer',
    exclusive_offers: '.forgotten-products__products-wrapper',
    exclusive_offer_sku_meta: 'meta[itemprop="sku"]',
    exclusive_offer_add_to_cart: '[data-test-id="product-add-to-cart-button"]',
    exclusive_expired: '.forgotten-products__description'
  },
  total_discount: '#checkout-step1-totals-discount',
  total_price: '.price-wrapper .review__price-summary',
  modal: '.modal-dialog',
  warning_div: '.alert-danger',
  coupon: {
    button: 'button.btn-coupon',
    input: '#coupon',
    confirm_button: 'div > button.btn-success-highlighted.btn-apply',
    error_message: '.cart-summary .d-block'
  },
  spinner: '.spinner',
  confirm_button: '.btn-success',
  payment_providers: {
    csob: {
      cart_number: '#cardnumber',
      expire: '#expiry',
      cvc: '#cvc',
      submit_button: '#pay-submit',
      cancel_button: '.button-cancel',
      logo: '.csob-logo',
      warning: '#system-warning'
    },
    edenred: {
      username_div: '#ctl00_cph1_CustomerGatewayLogin_LoginAspNetIdentity_UserNameCell',
      username_input: '#ctl00_cph1_CustomerGatewayLogin_LoginAspNetIdentity_UserNameAspNetIdentity',
      password_input: '#ctl00_cph1_CustomerGatewayLogin_LoginAspNetIdentity_PasswordAspNetIdentity',
      login_button: '#ctl00_cph1_CustomerGatewayLogin_LoginAspNetIdentity_LoginAspNetIdentityButton',
      order_price: '#ctl00_cph1_lOrderTotalPrice',
      submit_button: '#ctl00_cph1_btnPlaceOrderPayment',
      cancel_button: '#ctl00_cph1_btnClosePlaceOrderPayment'
    },
    benefit_plus: {
      username_input: '#ctl00_ContentPlaceHolder1_BMTextBoxName',
      password_input: '#ctl00_ContentPlaceHolder1_BMTextBoxPassword',
      login_button: '#ctl00_ContentPlaceHolder1_ButtonLogin',
      pay_order_button: '#ctl00_ContentPlaceHolder1_btnPayAccount',
      submit_button: '#ctl00_ContentPlaceHolder1_ButtonConfirm',
      cancel_button: '#ctl00_btnBackToEshop',
      order_price: '#ctl00_ContentPlaceHolder1_paymentInfoControl_lblAmount'
    },
    pay_u: {
      order_price: '.main > .column-1 > aside > div > div:nth-child(2) > div > em > div:nth-child(2)',
      payment_by_card_button: 'a[href="#/payment/card"]',
      cart_number_input: '#card-number',
      expire_input: '#card-date',
      cvc_input: '#card-cvv',
      submit_button: 'input[name="submit"]',
      cancel_button: '.payment-card .action-button.secondary',
      error_block: '.status.error'
    }
  },
  cash: '#cashondelivery',
  checkout_button: '#product-addtocart-submit',
  place_order_button: '[data-test-id="checkout-continue-button"]',
  back_to_store_button: '[data-test-id="checkout-back-button"]',
  continue_shopping_modal_button: '[data-test-id="product-cart-modal-back-to-shopping-button"]',
  sukl_widgets: '[href*="https://prehledy.sukl.cz/prehledy.html#/lekarny"]',
  verify_adress_modal: {
    confirm_and_continue_button: 'div.modal-footer button.btn-success'
  }
}
