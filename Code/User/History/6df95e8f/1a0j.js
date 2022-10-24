describe(`email test`, () => {

    beforeEach(() => {
        //prevent the test from failing on uncaught errors
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
        };
    });
    it(`tests emails`, () => {
        cy.visit('/').wait(10000);
        cy.visit('google.com').wait(10000);
    })
})