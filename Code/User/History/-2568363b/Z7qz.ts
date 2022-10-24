export const UserLocators = {
  login_link: '[data-test-id="header-login-link-logged-out"]',
  user_profile_link: {
    cmn: '.login__logged__btn',
    cz: '[data-test-id="header-login-link-logged-in"]'
  },
  login: {
    email: {
      cmn: '#email',
      cz: '#username',
      it: '#username'
    },
    password: {
      cmn: 'input[type="password"]',
      cz: '#password'
    },
    submit: {
      cmn: '.login-modal-dialog button[type="submit"]',
      cz: '#submit',
      it: '#submit'
    },
    register_button: {
      cmn: 'form[name=loginForm] button.btn-outline-info',
      cz: '.btn.btn--sec',
      it: '.btn.btn--sec'
    },
    forgot_password_link: {
      cmn: 'div[class*="justify-content-end"]',
      cz: 'a.form-item--right',
      it: 'a.form-item--right'
    },
    alert: {
      cmn: '.login-modal-dialog .alert-danger',
      cz: '.alert-error .alert-danger',
      it: '.alert-box.error'
    }
  },
  my_account_button: {
    cmn: '.account__menu > :nth-child(1) > a',
    cz: '[data-test-id="header-login-popover-account-link"]:nth-child(1)'
  },
  watchdogs_button: '[data-test-id="header-login-popover-account-link"]:nth-child(2)', // update when https://dev.azure.com/drmaxglobal/customer-team/_workitems/edit/9702 is completed
  logout_button: {
    cmn: ':nth-child(2) > .nuxt-link-exact-active',
    cz: '[data-test-id="header-login-popover-logout-link"]',
    ed: '[data-test-id="header-login-popover-logout-link"]'
  },
  main_page_user_name: {
    cmn: 'div.login__logged',
    pl: "div[class*='login-profile']",
    cz: '.sso__header strong a'
  },
  account_info: {
    fullname: '.mx-3 > :nth-child(1) > .title',
    email: '.mx-3 > :nth-child(1) > :nth-child(2)',
    phone: '.mx-3 > :nth-child(1) > :nth-child(3)',
    billing_address: '.mx-3 > :nth-child(2)',
    delivery_address: '.mx-3 > :nth-child(3)',
    personal_info: '.mx-3 > :nth-child(4)',
    edit_user_info_link: 'div.list-item:nth-child(5) > div:nth-child(1) > a:nth-child(1)'
  },
  user: {
    first_name: {
      cmn: 'input#first-name',
      cz: "input[name='firstName']"
    },
    last_name: {
      cmn: 'input#last-name',
      cz: 'input[name="lastName"]'
    },
    email: {
      cmn: 'input#email',
      cz: '#frm-personalInfoForm-email'
    },
    pass: {
      cmn: '#password',
      cz: 'input[name="password"]'
    },
    pass_confirmation: 'input#passwordConfirmation',
    phone: {
      cmn: 'input#phoneNumber',
      cz: '#frm-detailedForm-detailedInfo-telephone'
    },
    birth_day: {
      cmn: 'select#dateDay',
      cz: 'select[name="birth_day"]'
    },
    birth_month: {
      cmn: 'select#dateMonth',
      cz: 'select[name="birth_month"]'
    },
    birth_year: {
      cmn: 'select#dateYear',
      cz: 'select[name="birth_year"]'
    },
    gender: {
      cz: 'input[name="sex"]',
      ro: 'select#sex',
      ssb: 'select#sex'
    },
    pregnant: {
      ro: 'select#pregnant',
      ssb: 'select#pregnant'
    },
    breast_feeding: {
      ro: 'select#breast-feeding',
      ssb: 'select#breast-feeding'
    },
    weight: {
      ro: 'input#weight',
      ssb: 'input#weight'
    },
    height: {
      ro: 'input#height',
      ssb: 'input#height'
    },
    show_allergies_checkbox: {
      ro: 'input#show-allergies',
      ssb: 'input#show-allergies'
    },
    allergies: {
      ro: 'input#allergies',
      ssb: 'input#allergies'
    },
    show_treatments_checkbox: {
      ro: 'input#show-treatments',
      ssb: 'input#show-treatments'
    },
    treatments: {
      ro: 'input#treatments',
      ssb: 'input#treatments'
    },
    agreement: {
      privacy: {
        cmn: '#personal-data-agreement',
        cz: 'input[id="frm-detailedForm-approval"]'
      }
    }
  },
  save_personal_info_button: 'form.needs-validation:nth-of-type(1) .btn-success',
  save_personal_info_success_message: 'form.needs-validation:nth-of-type(1) .alert-success',
  billing_address: {
    city: {
      cmn: 'input#billing-address-city',
      cz: 'input[name="city"]'
    },
    street: {
      cmn: 'input#billing-address-street',
      cz: 'input[name="streetNumber"]'
    },
    street_number: 'input#billing-address-street-number',
    post_code: {
      cmn: 'input#billing-address-zip',
      cz: 'input[name="zip"]'
    },
    region_code: 'select#billing-address-regionCode'
  },
  delivery_address: {
    confirm_address_checkbox: '#frm-addressForm-checkAddress'
  },
  forgot_password: {
    email: {
      cmn: '#email',
      cz: '#frm-recoveryPasswordForm-email'
    },
    submit_button: {
      cmn: 'form.needs-validation button[type="submit"]',
      cz: 'input[type="submit"]'
    },
    alert: 'div[class*="alert"]'
  },
  registration: {
    no_card_registration: {
      cz: 'a[href="/registrace/typ-karty"]',
      sk: 'a[class="btn btn-lg btn-success mb-2 isCurrent"]'
    },
    digital_card: 'a[href="/registrace/digitalni-karta"]',
    digital_card_continue: '[class="btn btn-lg btn-success-highlighted px-2 mb-2"]'
  },
  continue_button: "[class='btn btn-success-highlighted btn-lg']"
}
