import {
  CommonHandler,
  CONFIG_CONST,
  HomepageHandler,
  TAG,
  UserHandler,
  UserLocators
} from 'cypress/index'

describe('Login/Logout', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it('2132 - Login - Positive', { tags: [] }, () => {
    HomepageHandler.goToUserLogin()
    UserHandler.login()
    UserHandler.waitForLogin()
  })

  it('2137 - Logout - Positive', { tags: [] }, () => {
    HomepageHandler.goToUserLogin()
    UserHandler.login()
    UserHandler.waitForLogin()
    cy.getLoc(UserLocators.user_profile_button).click()
    cy.getLoc(UserLocators.logout_button).click()
    cy.getLoc(UserLocators.menu_login_button)
  })
})
