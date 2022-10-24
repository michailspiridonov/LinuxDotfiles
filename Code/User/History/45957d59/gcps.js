const { randomString } = require("../../../helpers/random");
import 'cypress-mailosaur'

describe('', () => {

const serverId = Cypress.env('mailosaur_domain');
const testEmail = randomString + '.' + serverId + '@mailosaur.io';
let regLink;
let token;

const checkEmail = (emailSubject) => {
  cy.log('**Waiting for an email, might take a while.**')
  cy.mailosaurGetMessage(serverId, {
            sentTo: testEmail
        }).then((email) => {
			regLink = email.html.links[0].href
  })
}

const checkEmailToken = (emailSubject) => {
  cy.log('**Waiting for an email, might take a while.**')
  cy.wait(20 * 1000)
  cy.mailosaurGetMessage(serverId,{
			subject: 'Your eurodata One-Time-Token'
        }).then((email) => {
		cy.wrap(email.html.codes[0]).as('token')
		token = email.html.codes[0]
		console.log(email)
		cy.wait(9999)
  })
}

const typeToken = () => {
	cy.get('@token').then($token => {
		cy.get('.MuiGrid-grid-xs-10 > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type($token.value)
		console.log($token)
	});
}

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
		checkEmail();
	});

	it('', () => {
		cy.visit(regLink)
		cy.get(':nth-child(7) > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('testPass@123')
		cy.get(':nth-child(8) > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('testPass@123')
		cy.get('.jss39 > .MuiBox-root > .MuiButtonBase-root > .MuiButton-label').click()
		checkEmailToken();
		typeToken();
		cy.get(':nth-child(12) > .MuiBox-root > .MuiButtonBase-root > .MuiButton-label').click()
		cy.get(':nth-child(12) > .MuiBox-root > .MuiButtonBase-root > .MuiButton-label').should('be.visible').and('contain', 'Registration successful');
		cy.get('.MuiButtonBase-root').click();
	})
});