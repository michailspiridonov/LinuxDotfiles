export function login(email: string, password: string) {
    cy.get(`li.authorization-link`).click();
    cy.get(`input#email`).type(email);
    cy.get(`input#pass`).type(password);
    //click on login button
    cy.get(`button#send2`).first().click();
    //check that the home page is displayed
    cy.get(`h1.page-title`).should(`contain`, `Home Page`);
}