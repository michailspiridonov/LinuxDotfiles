import { User } from "../../fixtures/users/user";
import { Checkout } from "../../locators/eshop/Checkout";
import { Homepage } from "../../locators/eshop/Homepage";

export class CheckoutHandlers {

    /**
     * Fills out the customer details form
     * @param {User} customer user fixture
     */
    static fillCustomerDetails(customer: User) {
        //email --- this returns 2 inputs, thats why we use first()
        cy.get(Checkout.customer_email).first().type(customer.email);
        //first name
        this.getInputByLabelText(`First Name`).type(customer.firstName);
        //last name
        this.getInputByLabelText(`Last Name`).type(customer.lastName);
        //company
        this.getInputByLabelText(`Company`).type(customer.company);
        //street address
        this.getInputByLabelText(`Street Address: Line 1`).type(customer.address.street);
        //country
        this.getInputByLabelText(`Country`).select(customer.address.country);
        //city
        this.getInputByLabelText(`City`).type(customer.address.city);
        //zip code
        this.getInputByLabelText(`Zip/Postal Code`).type(customer.address.zip);
        //phone number
        this.getInputByLabelText(`Phone Number`).type(customer.phone);
    }

    static getInputByLabelText = (label: string) => {
        return cy
            .contains(`label`, label)
            .should(`be.visible`)
            .invoke('attr', 'for')
            .then((id) => {
                cy.get('#' + id)
            });
    }


    static checkPaymentPage(customer) {
        //check billing address
        cy.get(Checkout.billing_address_details).then($el => this.checkAddress($el, customer));
        //check shipping address
        cy.get(Checkout.shipping_address_details).then($el => this.checkAddress($el, customer));
        //TODO check shipping method
    }

    static checkAddress($element, customer) {
        cy.wrap($element)
            .should('contain', customer.firstName)
            .and('contain', customer.lastName)
            .and('contain', customer.address.street)
            .and('contain', customer.address.city)
            .and('contain', customer.address.zip)
            .and('contain', customer.address.country)
            .and('contain', customer.phone);
    }

    static placeOrder() {
        cy.get(Checkout.place_order_button).click();
        //check that the title is correct
        cy.get(Homepage.page_title).should(`contain`, `Thank you for your purchase!`);
        //check the continue shopping button
        cy.get(Checkout.continue_shopping_button).should(`contain`, `Continue Shopping`);
    }

    static extractOrderID() {
        //extract the order id
        cy.get(`div.checkout-success > p > span`).then(($el) => {
            //parsed through int to get rid of leading 0s
            let order_id = parseInt($el.text()).toString();
            cy.wrap($el).invoke('text').as('order_id');
            // window.localStorage.setItem('order_id', order_id);
        });
    }
}