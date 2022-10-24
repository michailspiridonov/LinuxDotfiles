/**
 * Fills out the customer details form
 * @param customer customer fixture
 */
export function fillCustomerDetails(customer) {
        //email --- this returns 2 inputs, thats why we use first()
        cy.get(`input#customer-email`).first().type(customer.email);
        //first name
        cy.get(`div[name="shippingAddress.firstname"]`).find(`input`).type(customer.firstName);
        //last name
        cy.get(`div[name="shippingAddress.lastname"]`).find(`input`).type(customer.lastName);
        //company
        cy.get(`div[name="shippingAddress.company"]`).find(`input`).type(customer.company);
        //street address
        cy.get(`div[name="shippingAddress.street.0"]`).find(`input`).type(customer.address.street);
        //country
        cy.get(`div[name="shippingAddress.country_id"]`).find(`select`).select(customer.address.country);
        //state
        cy.get(`div[name="shippingAddress.region"]`).find(`input`).type(customer.address.state);
        //city
        cy.get(`div[name="shippingAddress.city"]`).find(`input`).type(customer.address.city);
        //zip code
        cy.get(`div[name="shippingAddress.postcode"]`).find(`input`).type(customer.address.zip);
        //phone number
        cy.get(`div[name="shippingAddress.telephone"]`).find(`input`).type(customer.phone);
}

/**
 * Checks that the customer details are correct
 * @param customer customer fixture
 * @param price_incl_tax price of the product including tax
 * @param price_excl_tax price of the product excluding tax
 */
export function checkPaymentPage(customer, price_incl_tax: number, price_excl_tax: number) {
        //check billing address
        cy.get('div.billing-address-details')
                .should('contain', customer.firstName)
                .and('contain', customer.lastName)
                .and('contain', customer.address.street)
                .and('contain', customer.address.city)
                .and('contain', customer.address.state)
                .and('contain', customer.address.zip)
                .and('contain', customer.address.country)
                .and('contain', customer.phone);
        //check shipping address
        cy.get('div.shipping-information-content')
                .should('contain', customer.firstName)
                .and('contain', customer.lastName)
                .and('contain', customer.address.street)
                .and('contain', customer.address.city)
                .and('contain', customer.address.state)
                .and('contain', customer.address.zip)
                .and('contain', customer.address.country)
                .and('contain', customer.phone);
        //TODO check shipping method
        //check price
        
}