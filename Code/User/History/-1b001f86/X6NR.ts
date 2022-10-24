import { UserLocators, GeneralLocators, CommonHandler, CONFIG_CONST } from 'cypress/index_'

export class UserHandler {
  static login (username?: string, password?: string): void {
    const user = typeof username === 'undefined' ? CONFIG_CONST.DATA.user.login : username
    const pass = typeof password === 'undefined' ? CONFIG_CONST.DATA.user.pass : password
    cy.getLocScroll(UserLocators.login.email).type(user)
    cy.getLocScroll(UserLocators.login.password).type(pass)
    cy.getLocScroll(UserLocators.login.submit).click()
    CommonHandler.waitForFullLoad()
  }

  public static waitForLogin (): void {
    // on IT and CZ hamburger menu closes after successfull login
    if (['it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(GeneralLocators.megamenu.locator).click()
    }
    cy.getLocScroll(UserLocators.main_page_user_name).should('be.visible')
    cy.getLocScroll(UserLocators.main_page_user_name).should('contain', CONFIG_CONST.DATA.user.name)
  }

  static passwordRecovery (): void {
    cy.getLoc(UserLocators.login.forgot_password_link).click({ scrollBehavior: 'center' })
    cy.getLoc(UserLocators.forgot_password.email).type(CONFIG_CONST.DATA.user.login, { scrollBehavior: 'center' })
    cy.getLoc(UserLocators.forgot_password.submit_button).click({ scrollBehavior: 'center' })
    cy.getLocScroll(UserLocators.forgot_password.alert).should('be.visible')
  }

  static startRegistration (): void {
    cy.getLocScroll(UserLocators.login.register_button).click()
    if (['sk', 'it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.registration.no_card_registration).click()
    } else if (['cz'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.registration.no_card_registration).click()
      cy.getLocScroll(UserLocators.registration.digital_card).click()
      cy.getLocScroll(UserLocators.registration.digital_card_continue).click()
    }
    CommonHandler.waitForFullLoad()
  }

  static typeContactData = (field: any, value?: string) => {
    if (value == null || value === '') {
      cy.getLocScroll(field).clear().blur()
    } else {
      cy.getLocScroll(field).clear().type(value).blur()
    }
  }

  static fillFirstStep (userName: string, userSurname: string, userEmail: string, userPassword: string): void {
    UserHandler.typeContactData(UserLocators.user.first_name, userName)
    UserHandler.typeContactData(UserLocators.user.last_name, userSurname)
    UserHandler.typeContactData(UserLocators.user.email, userEmail)
    UserHandler.typeContactData(UserLocators.user.pass, userPassword)
    if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
      UserHandler.typeContactData(UserLocators.user.pass_confirmation, CONFIG_CONST.DATA.user.pass)
    }
  }

  static fillSecondStep (): void {
    UserHandler.typeContactData(UserLocators.billing_address.city, CONFIG_CONST.DATA.user.city)
    if (['sk', 'pl', 'ed', 'ap'].includes(CONFIG_CONST.COUNTRY)) {
      UserHandler.typeContactData(UserLocators.billing_address.street, CONFIG_CONST.DATA.user.street)
    } else {
      UserHandler.typeContactData(UserLocators.billing_address.street, CONFIG_CONST.DATA.user.street + ' ' + CONFIG_CONST.DATA.user.house_number)
    }
    if (['sk', 'pl', 'ed', 'ap'].includes(CONFIG_CONST.COUNTRY)) {
      UserHandler.typeContactData(UserLocators.billing_address.street_number, CONFIG_CONST.DATA.user.house_number)
    }
    UserHandler.typeContactData(UserLocators.billing_address.post_code, CONFIG_CONST.DATA.user.postcode)
    if (['it', 'ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.billing_address.region_code).select(CONFIG_CONST.DATA.user.region_code)
    }
    if (['cz'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.continue_button).click()
      CommonHandler.waitForFullLoad()
      cy.getLocScroll(UserLocators.delivery_address.confirm_address_checkbox).click()
    }
  }

  static fillThirdStep (): void {
    if (!['it'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.user.birth_day).select(CONFIG_CONST.DATA.user.birth_day)
      cy.getLocScroll(UserLocators.user.birth_month).select(CONFIG_CONST.DATA.user.birth_month)
      cy.getLocScroll(UserLocators.user.birth_year).select(CONFIG_CONST.DATA.user.birth_year)
    }
    if (['sk', 'pl', 'ed', 'ap'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.user.phone_code).select(CONFIG_CONST.DATA.user.phone_prefix)
    }
    UserHandler.typeContactData(UserLocators.user.phone, CONFIG_CONST.DATA.user.phone)
    if (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
      cy.getLocScroll(UserLocators.user.gender).select('M')
    }
    cy.getLocScroll(UserLocators.user.agreement.privacy).then(($btn) => {
      if ($btn.prop('checked').toString() !== 'true') {
        cy.getLocScroll(UserLocators.user.agreement.privacy).click({ force: true })
      }
    })
  }
}
