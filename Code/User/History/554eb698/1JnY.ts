/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable<Subject> {
        WaitForMagentoToLoad(): Chainable<Subject>;
        magentoLogin(user): Chainable<Subject>;
        login(email, password): Chainable<Subject>;
        WaitForEshopToLoad(): Chainable<Subject>;
    }
	interface Cypress {
        grep?: (grep?: string, tags?: string, burn?: string) => void
    }
}