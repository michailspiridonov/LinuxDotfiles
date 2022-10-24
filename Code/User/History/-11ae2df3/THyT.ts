import {
  CommonHandler,
  CONFIG_CONST,
  GeneralHandler,
  TAG,
  UserHandler,
  UserLocators
} from 'cypress/index'

describe('User Account - My Data Tab', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })
  if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
    it('9318 - Visuals', { tags: [TAG.PROD_FRIENDLY, TAG.P2] }, () => {
      const fullName = CONFIG_CONST.DATA.user.name + ' ' + CONFIG_CONST.DATA.user.surname
      const fullPhone = CONFIG_CONST.DATA.user.phone_prefix + ((['it'].includes(CONFIG_CONST.COUNTRY)) ? '' : ' ') + CONFIG_CONST.DATA.user.phone
      GeneralHandler.goToUserLogin()
      UserHandler.login()
      cy.getLoc(UserLocators.login.alert).should('not.exist')
      UserHandler.waitForLogin()
      cy.getLocScroll(UserLocators.user_profile_link).click().wait(5000)
      cy.getLocScroll(UserLocators.my_account_button).realClick()
      cy.getLocScroll(UserLocators.account_info.fullname).should('contain', fullName)
      cy.getLocScroll(UserLocators.account_info.email).should('contain', CONFIG_CONST.DATA.user.email)
      cy.getLocScroll(UserLocators.account_info.phone).should('contain', fullPhone)
      cy.getLocScroll(UserLocators.account_info.billing_address).should('contain', CONFIG_CONST.DATA.user.street)
      cy.getLocScroll(UserLocators.account_info.billing_address).should('contain', CONFIG_CONST.DATA.user.house_number)
      cy.getLocScroll(UserLocators.account_info.billing_address).should('contain', CONFIG_CONST.DATA.user.postcode.replace(/^(.{3})/, '$1 '))
      cy.getLocScroll(UserLocators.account_info.billing_address).should('contain', CONFIG_CONST.DATA.user.city)
      cy.getLocScroll(UserLocators.account_info.delivery_address).should('contain', CONFIG_CONST.DATA.user.street)
      cy.getLocScroll(UserLocators.account_info.delivery_address).should('contain', CONFIG_CONST.DATA.user.house_number)
      cy.getLocScroll(UserLocators.account_info.delivery_address).should('contain', CONFIG_CONST.DATA.user.postcode.replace(/^(.{3})/, '$1 '))
      cy.getLocScroll(UserLocators.account_info.delivery_address).should('contain', CONFIG_CONST.DATA.user.city)
    })
  }
})
