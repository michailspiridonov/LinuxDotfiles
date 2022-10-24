export function fillCustomerDetails(customer) {
}

/**
 * Checks that the customer details are correct
 * @param customer customer fixture
 * @param price_incl_tax price of the product including tax
 * @param price_excl_tax price of the product excluding tax
 */
export function checkPaymentPage(customer) {
        //check billing address
        cy.get('div.billing-address-details').then($el => checkAddress($el, customer));
        //check shipping address
        cy.get('div.shipping-information-content').then($el => checkAddress($el, customer));
        //TODO check shipping method
}

export function checkAddress($element, customer) {
        cy.wrap($element)
                .should('contain', customer.firstName)
                .and('contain', customer.lastName)
                .and('contain', customer.address.street)
                .and('contain', customer.address.city)
                .and('contain', customer.address.state)
                .and('contain', customer.address.zip)
                .and('contain', customer.address.country)
                .and('contain', customer.phone);
}