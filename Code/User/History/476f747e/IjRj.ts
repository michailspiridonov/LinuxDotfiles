export function login(email: string, password: string) {
    cy.get(`li.authorization-link`).click();
    cy.get(`input#email`).type(email);
    cy.get(`input#pass`).first().type(password);
    //click on login button
    cy.get(`button#send2`).first().click();
    //check that the user is logged in
    cy.get(`li.greet.welcome`).should(`be.visible`);
}