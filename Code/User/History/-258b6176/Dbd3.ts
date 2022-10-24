import { User } from "../../fixtures/entities/user/user";
import { AdminFilterHandlers } from "../../handlers/admin/AdminFilterHandlers";
import { AdminUserListHandlers } from "../../handlers/admin/AdminUserListHandlers";
import { UserHandlers } from "../../handlers/eshop/UserHandlers";
import { UserProfileHandlers } from "../../handlers/eshop/UserProfileHandlers";
import { UserApiHandlers } from "../../handlers/admin/AdminUserApiHandlers";
import { AdminCustomerDetail } from "../../locators/admin/AdminCustomerDetail";
import { AdminList } from "../../locators/admin/AdminList";
describe("Tests for account creation", () => {
	let customer;
	let admin;
	const customers = Cypress.env("urls").customers.all_customers;

	before(() => {
		//set customer
		customer = User.getRandomUser();
		//load admin user fixture
		cy.fixture("users/admin").then(adminFixture => admin = adminFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Creates a new customer", () => {
		cy.visit("/");
		cy.wait(2000);
		UserHandlers.createUserAccount(customer);
		cy.log("**Customer created**");
		cy.magentoLogin(admin);
		cy.visit(customers);
		cy.WaitForMagentoToLoad();
		//filter the customers by name
		AdminFilterHandlers.filterTextByLabelText("Name", customer.firstName);
		cy.WaitForMagentoToLoad();
		//extract customer's id and confirm their account
		AdminUserListHandlers.getFirstUserID();
		cy.WaitForMagentoToLoad().then(() => {
			UserApiHandlers.confirm_user_registration(localStorage.getItem("user"));
		});
		//check that the customer is in the list
		AdminUserListHandlers.checkUserIsInList(customer);
		//verify the customer details
		cy.get(AdminList.edit_button).click();
		cy.get(AdminCustomerDetail.customer_information).should("not.contain", "Confirmation Required");
		cy.log("**Customer confirmed**");
		cy.visit("/");
		//login
		cy.login(customer.email, customer.password);
		UserProfileHandlers.addBillingAddress(customer);
		cy.log("**Customer address added**");
		cy.visit(customers);
		cy.WaitForMagentoToLoad();
		//filter the customers by name
		AdminFilterHandlers.filterTextByLabelText("Name", customer.firstName);
		cy.WaitForMagentoToLoad();
		AdminUserListHandlers.checkCustomerAddress(customer);
	});
});