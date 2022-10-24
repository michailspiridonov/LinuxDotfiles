import { User } from '../../fixtures/users/user';
import { FilterHandlers } from '../../handlers/admin/FilterHandlers';
import { UserListHandlers } from '../../handlers/admin/UserListHandlers';
import { UserApiHandlers } from '../../handlers/UserApiHandlers';
import { NavMenu } from '../../locators/admin/NavMenu';
import { Homepage } from '../../locators/eshop/Homepage';
import { UserRegistrationForm } from '../../locators/eshop/UserRegistrationForm';
import { filterCustomersByName } from '../../support/magento/filter_cutomers';
import { addAddress } from '../../support/users/add_address';
import { login } from '../../support/users/login';
describe(`Tests for account creation`, () => {
    let customer;
    let admin;

    before(() => {
        //set customer
        customer = User.getRandomUser();
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
        cy.get(Homepage.createAccountLink).click();
        //check title
        cy.get(Homepage.page_title).should(`contain`, `Create New Customer Account`);
        //fill the registration form
        cy.get(UserRegistrationForm.first_name).type(customer.firstName);
        cy.get(UserRegistrationForm.last_name).type(customer.lastName);
        cy.get(UserRegistrationForm.email).type(customer.email);
        cy.get(UserRegistrationForm.password).type(customer.password);
        cy.get(UserRegistrationForm.confirm_password).type(customer.password);
        //create the account
        cy.get(UserRegistrationForm.register_button).click();
        //check success message
        cy.get(`div.message-success`).should(`contain`, `You must confirm your account. Please check your email for the confirmation link`);
    });

    it(`Check that the customer is created`, () => {
        cy.magentoLogin(admin);
        //open the side menu
        cy.get(NavMenu.customers).click();
        //click on the all customers link
        cy.get(NavMenu.all_customers).click();
        cy.WaitForMagentoToLoad();
        //filter the customers by name
        FilterHandlers.filterByLabelText(`Name`, customer.firstName);
        cy.WaitForMagentoToLoad();
        //extract customer's id and confirm their account
        UserListHandlers.getFirstUserID().then(id => {
            UserApiHandlers.confirm_user_registration(id);
        });
        //check that the customer is in the list
        UserListHandlers.checkUserIsInList(customer.firstName, customer.lastName, customer.email);
        //verify the customer details
        cy.get(`a`).contains(`Edit`).click();
        cy.get(`div.customer-information`).should(`not.contain`, `Confirmation Required`);
    });

    it(`Tries to login as user with wrong password`, () => {
        cy.visit('/');
        //login with wrong password
        login(customer.email, `wrong_password`);
        //check that the login is not successful
        cy.get(`div.message-error`).should(`contain`, `The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.`);
    });

    it(`Tries to login as user with correct password`, () => {
        cy.visit('/');
        //login with correct password
        login(customer.email, customer.password);
        //check that the login is successful
        cy.get(`span.logged-in`).should(`contain`, `Welcome, ${customer.firstName}`);
    });

    it(`Adds a billing address to the customer`, () => {
        cy.visit('/');
        //login
        login(customer.email, customer.password);
        //open customer dropdown
        cy.get(`span.customer-name`).first().click();
        //open acount settings
        cy.get(`a`).contains(`My Account`).click();
        cy.get(`a[data-ui-id="default-billing-edit-link"]`).click();
        //fill the billing address
        addAddress(customer);
        //save the address
        cy.get(`button[title="Save Address"]`).click();
        //check that the address is saved
        cy.get(`div.message-success`).should(`contain`, `You saved the address.`);
    });

    it(`Checks the addresses in magento`, () => {
        cy.magentoLogin(admin);
        //open the side menu
        cy.get(`li#menu-magento-customer-customer`).click();
        //click on the all customers link
        cy.get(`li.item-customer-manage`).click();
        cy.WaitForMagentoToLoad();
        //filter the customers by name
        filterCustomersByName(customer.firstName);
        cy.WaitForMagentoToLoad();
        //click edit button
        cy.get(`a`).contains(`Edit`).click();
        //check that the address is saved
        cy.get(`address`)
            .should(`contain`, customer.firstName)
            .should(`contain`, customer.lastName)
            .should(`contain`, customer.company)
            .should(`contain`, customer.address.street)
            .should(`contain`, customer.address.city)
            .should(`contain`, customer.address.state)
            .should(`contain`, customer.address.zip)
            .should(`contain`, customer.address.country)
            .should(`contain`, customer.phone);

    });
});