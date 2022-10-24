import { CartHandlers } from "../../handlers/eshop/CartHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
import { Cart } from "../../locators/eshop/Cart";

describe("Create an order with logged in user", () => {
	let customer;
	let admin;
	const PRODUCT = "test";
	const orders = Cypress.env("urls").sales.orders;
	before(() => {
		//load a customer fixture
		cy.fixture("users/user_customer").then(customerFixture => customer = customerFixture);
		//load admin user fixture
		cy.fixture("users/admin").then(adminFixture => admin = adminFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Creates an order", () => {
		cy.intercept("GET", "/customer/section/load/**").as("customer_section_load");
		cy.visit("/");
		cy.login(customer.email, customer.password).wait("@customer_section_load");
		CartHandlers.viewCartPage();
		CartHandlers.clearCart();
		ProductHandlers.openProductPage(PRODUCT);
		ProductPageHandlers.addProductToCart();
		CartHandlers.checkThatProductIsInCart(PRODUCT);
		CartHandlers.proceedToCheckout();
		cy.WaitForEshopToLoad();
	});
});