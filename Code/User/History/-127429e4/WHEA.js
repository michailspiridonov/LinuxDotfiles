// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//login to magento
Cypress.Commands.add(`magentoLogin`, (admin) => {
    cy.intercept(`/admin/mui/index/render/**`).as(`render`);
    //login to the admin panel
    cy.visit(`/admin/`);
    cy.get(`input#username`).type(admin.username);
    cy.get(`input#login`).type(admin.password);
    cy.get(`button.action-login`).click();
    //check that the login was successful
    cy.get(`h1.page-title`).should(`contain`, `Dashboard`).wait(`@render`);
});

Cypress.Commands.add(`WaitForMagentoToLoad`, () => {
    cy.get(`div.spinner`).should(`not.be.visible`);
});

Cypress.Commands.add(`visitMagento`, () => {
    cy.intercept(`/admin/mui/index/render/**`).as(`render`);
    //login to the admin panel
    cy.visit(`/admin/`);
    cy.wait(`@render`);
});