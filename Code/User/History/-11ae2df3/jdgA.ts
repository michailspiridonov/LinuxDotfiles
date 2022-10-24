import {
  CommonHandler,
  CONFIG_CONST,
  GeneralHandler,
  TAG,
  UserHandler,
  UserLocators
} from 'cypress/index_'

const regEx = {
  name: new RegExp(CONFIG_CONST.DATA.user.regex_validation.name),
  email: new RegExp(CONFIG_CONST.DATA.user.regex_validation.email),
  phone: new RegExp(CONFIG_CONST.DATA.user.regex_validation.phone),
  street_and_house: new RegExp(CONFIG_CONST.DATA.user.regex_validation.street_and_house),
  city_and_postcode: new RegExp(CONFIG_CONST.DATA.user.regex_validation.city_and_postcode)
}

describe('User Account - My Data Tab', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })
  if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
    it('9318 - Visuals', { tags: [TAG.PROD_FRIENDLY, TAG.P2, TAG.DEVCLOUD] }, () => {
      GeneralHandler.goToUserLogin()
      UserHandler.login()
      cy.getLoc(UserLocators.login.alert).should('not.exist')
      // UserHandler.waitForLogin()
      cy.getLocScroll(UserLocators.user_profile_link).click()
      cy.getLocScroll(UserLocators.my_account_button).click()
      cy.getLocScroll(UserLocators.account_info.fullname).invoke('text').then($text => expect($text.trim()).to.match(regEx.name))
      cy.getLocScroll(UserLocators.account_info.email).invoke('text').should('match', regEx.email)
      cy.getLocScroll(UserLocators.account_info.phone).invoke('text').should('match', regEx.phone)
      cy.getLocScroll(UserLocators.account_info.billing_address.street_and_house).invoke('text').should('match', regEx.street_and_house)
      cy.getLocScroll(UserLocators.account_info.billing_address.city_and_postcode).invoke('text').should('match', regEx.city_and_postcode)
      cy.getLocScroll(UserLocators.account_info.delivery_address.street_and_house).invoke('text').should('match', regEx.street_and_house)
      cy.getLocScroll(UserLocators.account_info.delivery_address.city_and_postcode).invoke('text').should('match', regEx.city_and_postcode)
    })
  }
})
