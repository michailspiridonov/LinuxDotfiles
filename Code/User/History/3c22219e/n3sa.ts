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

export const REQUEST_TYPES_TO_HIDE = ['xhr', 'fetch']
export const REQUEST_URLS_TO_HIDE = [/i\.clarity\.ms/]
export const HIDE_ALL_REQUESTS = false

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

// Hide fetch/XHR requests
// const app = window.top
// if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
//   const style = app.document.createElement('style')
//   style.innerHTML =
//     '.command-name-request, .command-name-xhr { display: none }'
//   style.setAttribute('data-hide-command-log-request', '')

//   app.document.head.appendChild(style)
// }

// Hide XHR from log
// Cypress.on('log:added', (ev) => {
//   if (HIDE_ALL_REQUESTS ||
//     (REQUEST_TYPES_TO_HIDE.includes(ev.displayName) && REQUEST_URLS_TO_HIDE.some((reg) => reg.test(ev.consoleProps.URL)))) {
//     const el = Array.from(window.top.document.querySelectorAll('.command-name-request')).slice(-1)[0]
//     if (el) {
//       el.style.display = 'none'
//     }
//   }
// })
