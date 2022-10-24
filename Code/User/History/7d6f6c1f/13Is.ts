import {
  CommonHandler,
  CONFIG_CONST,
  HomepageHandler,
  TAG,
  UserHandler
} from 'cypress/index'

describe('Password Features', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it('2136 - Login - Forgot password', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    HomepageHandler.goToUserLogin()
    UserHandler.passwordRecovery()
  })
})
