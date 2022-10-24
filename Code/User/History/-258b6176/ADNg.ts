import { User } from '../../fixtures/users/user';
import { FilterHandlers } from '../../handlers/admin/FilterHandlers';
import { UserListHandlers } from '../../handlers/admin/UserListHandlers';
import { UserHandlers } from '../../handlers/eshop/UserHandlers';
import { UserProfileHandlers } from '../../handlers/eshop/UserProfileHandlers';
import { UserApiHandlers } from '../../handlers/UserApiHandlers';
import { CustomerDetail } from '../../locators/admin/CustomerDetail';
import { List } from '../../locators/admin/List';
import { NavMenu } from '../../locators/admin/NavMenu';
import { CustomerProfile } from '../../locators/eshop/CustomerProfile';
import { Homepage } from '../../locators/eshop/Homepage';
import { UIElements } from '../../locators/eshop/UIElements';
import { UserRegistrationForm } from '../../locators/eshop/UserRegistrationForm';
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
        cy.wait(2000);
        UserHandlers.createUserAccount(customer);
        cy.log(`** Customer created **`);
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
        cy.get(List.edit_button).click();
        cy.get(CustomerDetail.customer_information).should(`not.contain`, `Confirmation Required`);
        cy.log(`** Customer confirmed **`);
        cy.visit('/');
        //login
        login(customer.email, customer.password);
        UserProfileHandlers.addBillingAddress(customer);
        cy.log(`** Customer address added **`);
        cy.visit(`/admin`)
        //open the side menu
        cy.get(NavMenu.customers).click();
        //click on the all customers link
        cy.get(NavMenu.all_customers).click();
        cy.WaitForMagentoToLoad();
        //filter the customers by name
        FilterHandlers.filterByLabelText(`Name`, customer.firstName);
        cy.WaitForMagentoToLoad();
        UserListHandlers.checkCustomerAddress(customer)
    });
});