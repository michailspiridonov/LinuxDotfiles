const { randomString } = require("../../../helpers/random");
import 'cypress-mailosaur'

const serverId = Cypress.env('mailosaur_domain');
const testEmail = randomString + '.' + serverId + '@mailosaur.io';
let registrationLink;

const checkEmail = (emailSubject) => {
  cy.log('**Waiting for an email, might take a while.**')
  cy.mailosaurGetMessage(serverId, {
            sentTo: testEmail
        }).then((email) => {
    registrationLink = email.html.links[0].href;
  })
}

describe('', () => {
	it('Creates a new user', () => {
		cy.visit('/');
		cy.get('#kc-registration > span > a').click()
		cy.get('#onboarding_locale-select-input').click()
		cy.get('[data-value="en"]').click()
		cy.get('#onboarding_form-personal-title-select-input').click()
		cy.get('[data-value="MR"]').click()
		cy.get('#onboarding_form-first-name-input').type('Test fName')
		cy.get('#onboarding_form-last-name-input').type('Test lName')
		cy.get('#onboarding_form-email-input').type('primary' + testEmail)
		cy.get('#onboarding_form-secondary-email-radio-input').click()
        cy.get('#onboarding_form-verification-secondary-email-input').type(testEmail)
		cy.get('.MuiButton-label').click()
		checkEmail().then(link => {
			cy.visit(link);
		})	
	});
});