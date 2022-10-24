import {
  TAG,
  CommonHandler,
  UserLocators,
  UserHandler,
  GeneralHandler,
  CONFIG_CONST
} from 'cypress/index'

function generateValidEmailAddress (): string {
  const timestamp = Date.now()
  const validEmail = timestamp + '@gmail.com'
  return validEmail
}

const SuccessfullRegistrationPageText: { [key: string]: string } = {
  cz: 'A je to! Teď vyčkejte na e-mail',
  ro: 'Asta este tot! Acum asteptati email-ul!',
  ssb: 'Asta este tot! Acum asteptati email-ul!',
  sk: 'A je to! Teraz počkajte na e-mail',
  pl: 'I to wszystko! Teraz poczekaj na wiadomość e-mail',
  ed: 'I to wszystko! Teraz poczekaj na wiadomość e-mail',
  it: 'Tutto fatto!'
}

describe('New User Registration', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    GeneralHandler.goToUserLogin()
    UserHandler.startRegistration()
  })

  // CZ will be implemented when there is common solution for registration on CZ https://dev.azure.com/drmaxglobal/qaa-team/_workitems/edit/6283
  if (!['cz'].includes(CONFIG_CONST.COUNTRY)) {
    // not working on ITA due to bug https://dev.azure.com/drmaxglobal/platform-team/_workitems/edit/6153
    it('2139 - New User Registration', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      UserHandler.fillFirstStep(
        CONFIG_CONST.DATA.user.name,
        CONFIG_CONST.DATA.user.surname,
        generateValidEmailAddress(),
        CONFIG_CONST.DATA.user.pass
      )
      cy.getLocScroll(UserLocators.continue_button).click()
      CommonHandler.waitForFullLoad()
      UserHandler.fillSecondStep()
      cy.getLocScroll(UserLocators.continue_button).click()
      CommonHandler.waitForFullLoad()
      UserHandler.fillThirdStep()
      cy.getLocScroll(UserLocators.continue_button).click()
      CommonHandler.waitForFullLoad()
      cy.getLocScroll('html').contains(SuccessfullRegistrationPageText[CONFIG_CONST.COUNTRY])
    })
  } else {
    it.skip('SKIPPED')
  }
})
