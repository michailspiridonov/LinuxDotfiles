const { randomString } = require("../../../helpers/random");
import 'cypress-mailosaur'

describe('', () => {

	const serverId = Cypress.env('mailosaur_domain');
	const testEmail = randomString + '.' + serverId + '@mailosaur.io';
	let regLink;

	/**
	 * Extracts registration link from the email
	 */
	const checkEmail = () => {
		cy.log('**Waiting for an email, might take a while.**')
		cy.mailosaurGetMessage(serverId, {
			sentTo: testEmail
		}).then((email) => {
			regLink = email.html.links[0].href
		})
	}

	/**
	 * Extracts a token from the email 
	 */
	const checkEmailToken = () => {
		cy.log('**Waiting for an email, might take a while.**')
		//wait for the email to arrive
		cy.wait(20 * 1000)
		cy.mailosaurGetMessage(serverId, {
			subject: 'Your eurodata One-Time-Token'
		}).then((email) => {
			//saves the token
			cy.wrap(email.html.codes[0]).as('token')
			console.log(email)
		})
	}

	it('Creates a new user', () => {
		cy.visit('/');
		//Click register
		cy.get('#kc-registration > span > a').click()
		//Set language to english
		cy.get('#onboarding_locale-select-input').click()
		cy.get('[data-value="en"]').click()
		//Fill user data
		cy.get('#onboarding_form-personal-title-select-input').click()
		cy.get('[data-value="MR"]').click()
		cy.get('#onboarding_form-first-name-input').type('Test fName')
		cy.get('#onboarding_form-last-name-input').type('Test lName')
		cy.get('#onboarding_form-email-input').type('primary' + testEmail)
		//Fill verify email
		cy.get('#onboarding_form-secondary-email-radio-input').click()
		cy.get('#onboarding_form-verification-secondary-email-input').type(testEmail)
		//Complete registration
		cy.get('.MuiButton-label').click()
		checkEmail();
	});

	it('Fill the second registration form', () => {
		cy.visit(regLink)
		//Set a password
		cy.get(':nth-child(7) > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('testPass@123')
		//confirm a password
		cy.get(':nth-child(8) > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('testPass@123')
		//request token
		cy.get('.jss39 > .MuiBox-root > .MuiButtonBase-root > .MuiButton-label').click()
		//Get token
		checkEmailToken();
		//Type the token in the form
		cy.get('@token').then($token => {
			cy.get('.MuiGrid-grid-xs-10 > .MuiBox-root > [style="position: relative;"] > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type($token.value)
			console.log($token)
		});
		//Complete the registration
		cy.get(':nth-child(12) > .MuiBox-root > .MuiButtonBase-root > .MuiButton-label').click()
		cy.get('.MuiTypography-h1').should('be.visible').and('contain', 'Registration successful');
		cy.get('.MuiButtonBase-root').click();
	})
});