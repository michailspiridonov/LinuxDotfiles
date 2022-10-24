/// <reference types="cypress" />

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import registerCypressGrep from 'cypress-grep'
import 'cypress-mailosaur'
import 'cypress-real-events/support'
registerCypressGrep()

const data = Cypress.env('data')

export const CONFIG_CONST = {
  DATA: Cypress.env('data'),
  HOMEPAGE_URL: data.url.homepage,
  ADMIN_URL: data.url.admin,
  COUNTRY: data.country,
  ENV_TYPE: data.env
}

export const WAIT_CONST = {
  WAIT_FOR_INDEXERS: 60 * 1000,
  WAIT_FOR_NSF_RESPONSE: 5 * 1000,
  WAIT_FOR_CHANGE_PAGE_STATE: 2 * 1000,
  WAIT_FOR_ADMIN_SAVE: 200,
  WAIT_FOR_EMAIL: 5 * 60 * 1000,
  WAIT_FOR_COOKIE_CONSENT: 45 * 1000
}

// Hide XHR requests
Cypress.Server.defaults({
  delay: 500,
  force404: false,
  ignore: (xhr) => {
    return true
  }
})

// Prevent Cypress crash on our pages if there is some unhandler exception
Cypress.on('uncaught:exception', () => {
  return false
})

// Cookie hack for prevent dialog about accept coockies
Cypress.on('window:before:load', (window) => {
  window.document.cookie =
    'CookieConsent={stamp:%27oXnCkTFMRGDfsPSSU/T5CcjSyejRPEhVHDvufB6ND8Ka3RaZtYJjtg==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1000%2Cutc:1634817475822%2Cregion:%27cz%27}'
  window.document.cookie = 'feature-flags/common-checkout-enabled=true'
  window.document.cookie = 'CypressTest=Dr.Max'
})

// Hide XHR from log
Cypress.on('log:added', (ev) => {
  console.log(ev)
  if (ev.displayName === 'xhr' && /i\.clarity\.ms/.test(ev.consoleProps.URL)) {
    const el = Array.from(window.top.document.querySelectorAll('.command-wrapper')).slice(-1)[0]
    if (el) {
      el.css('display', 'none')
    }
  }
})
