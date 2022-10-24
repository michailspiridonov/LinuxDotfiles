import { User } from '../../fixtures/users/user';
import { filterCustomersByName } from '../../support/magento/filter_cutomers';
describe(`Tests for account creation`, () => {
    let customer;
    let admin;

    before(() => {
        //set customer
        customer = User.getRandomUser();

        console.log(`customer: ${customer.firstName} ${customer.lastName}`);
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    });

    it(`Creates a new customer`, () => {
        cy.visit('/');
        //open the customer registration page
        cy.contains(`Create an Account`).should(`be.visible`).click();
        //check title
        cy.get(`h1.page-title`).should(`contain`, `Create New Customer Account`);
        //fill the registration form
        cy.get(`input#firstname`).type(customer.firstName);
        cy.get(`input#lastname`).type(customer.lastName);
        cy.get(`input#email_address`).type(customer.email);
        cy.get(`input#password`).type(customer.password);
        cy.get(`input#password-confirmation`).type(customer.password);
        //create the account
        cy.get(`button[title="Create an Account"]`).click();
        //check success message
        cy.get(`div.message-success`).should(`contain`, `You must confirm your account. Please check your email for the confirmation link`);
    });

    it(`Check that the customer is created`, () => {
        cy.magentoLogin(admin);
        //open the side menu
        cy.get(`li#menu-magento-customer-customer`).click();
        //click on the all customers link
        cy.get(`li.item-customer-manage`).click();
        cy.WaitForMagentoToLoad();
        //filter the customers by name
        filterCustomersByName(customer.firstName);
        cy.WaitForMagentoToLoad();
        //extract customer's id and confirm their account
        cy.get(`tr.data-row`).first().find(`td`).eq(1).find(`div.data-grid-cell-content`).invoke(`text`).then(id => {
            cy.request({
                method: `PUT`,
                url: `/rest/default/V1/customers/${id}`,
                auth: {
                    bearer: admin.token
                },
                body: {
                    "customer": {
                        "confirmation": null,
                    },
                }
            });
        });
        //check that the customer is in the list
        cy.get(`div.admin__data-grid-wrap`)
            .should(`contain`, customer.firstName)
            .should(`contain`, customer.lastName)
            .should(`contain`, customer.email);
        //verify the customer details
        cy.get(`a`).contains(`Edit`).click();
        cy.get(`div.customer-information`).should(`not.contain`, `Confirmation Required`);
    });
});