export function addAddress(customer) {
    cy.get(`input#company`).type(customer.company);
    cy.get(`input#telephone`).type(customer.phone);
    cy.get(`input#street1`).type(customer.address.street);
    cy.get(`input#city`).type(customer.address.city);
    cy.get(`input#postcode`).type(customer.address.zip);
    cy.get(`select#country`).select(customer.address.country);
    cy.get(`select#region_id`).type(customer.address.state);
}