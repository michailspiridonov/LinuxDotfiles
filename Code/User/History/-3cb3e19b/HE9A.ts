import {
  CommonHandler,
  CONFIG_CONST,
  GeneralHandler,
  TAG,
  UserHandler,
  UserLocators
} from 'cypress/index_'

describe('Login/Logout', () => {
  before(() => {
    cy.recordHar()
  })
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it('2132 - Login - Positive', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P1] }, () => {
    GeneralHandler.goToUserLogin()
    UserHandler.login()
    UserHandler.waitForLogin()
  })

  it('2137 - Logout - Positive', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    GeneralHandler.goToUserLogin()
    UserHandler.login()
    UserHandler.waitForLogin()
    cy.getLocScroll(UserLocators.user_profile_link).click()
    cy.getLocScroll(UserLocators.logout_button).click()
    cy.getLocScroll(UserLocators.login_link)
  })

  after(() => {
    cy.saveHar()
  })
})
