const { randomString } = require("../../../helpers/random");

const checkEmail = (emailSubject: string) => {
  cy.log('**Waiting for an email, might take a while. Be patient, no running command is visible.**')
  cy.mailosaurGetMessage(serverId, { subject: emailSubject }, { timeout: WAIT_CONST.WAIT_FOR_EMAIL }).then((email) => {
    expect(email.subject).to.contain(emailSubject)
  })
}

describe('', () => {
	let email = randomString + '.' + Cypress.env('mailosaur_domain') + '@mailosaur.io';
	it('Creates a new user', () => {
		cy.visit('/');
		cy.get('#kc-registration > span > a').click()
		cy.get('#onboarding_locale-select-input').click()
		cy.get('[data-value="en"]').click()
		cy.get('#onboarding_form-personal-title-select-input').click()
		cy.get('[data-value="MR"]').click()
		cy.get('#onboarding_form-first-name-input').type('Test fName')
		cy.get('#onboarding_form-last-name-input').type('Test lName')
		cy.get('#onboarding_form-email-input').type('primary' + email)
		cy.get('#onboarding_form-secondary-email-radio-input').click()
        cy.get('#onboarding_form-verification-secondary-email-input').type(email)
		cy.get('.MuiButton-label').click()

		
	});
});