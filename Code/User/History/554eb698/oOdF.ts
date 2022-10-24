/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable<Subject> {
        WaitForMagentoToLoad(): Chainable<Subject>;
        magentoLogin(user): Chainable<Subject>;
        visitMagento(): Chainable<Subject>;
    }
}