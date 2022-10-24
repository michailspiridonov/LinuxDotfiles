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
import '@bahmutov/cy-api/support'
import {
  locate,
  scrollLocated
} from '../helpers/tools'
import 'cypress-mailosaur'
import 'cypress-real-events/support'
import 'cypress-file-upload'
import 'cypress-fill-command'
require('cypress-grep')()
require('cypress-mailosaur')

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

export const accessToken = {
  access_token_id: 'ade98faccd80f4d75e76d23e5e8894e9.access',
  access_token_secret: '40ea5349a7343ba9962af109a92a6a006e24c6792ee432aa3cf53ad4a70292e5'
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

// Interface for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      getLoc(sel: string | object, opt?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>
      getLocScroll(sel: string | object, opt?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>
      findLoc(sel: string | object, opt?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Adding custom commands
Cypress.Commands.add('getLoc', (locator: any, options: {}) => {
  cy.get(locate(locator), options)
})

Cypress.Commands.add('getLocScroll', (locator: any, options: {}) => {
  cy.getLoc(locator, options).then($el => {
    scrollLocated($el)
  })
})

Cypress.Commands.add('findLoc', { prevSubject: 'element' }, ($element: JQuery<HTMLElement>, locator, options) => {
  return cy.wrap($element).find(locate(locator), options)
})

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url, {
    headers: {
      'CF-Access-Client-Id': accessToken.access_token_id,
      'CF-Access-Client-Secret': accessToken.access_token_secret
    }
  })
})
