import { FilterHandlers } from "../../handlers/admin/FilterHandlers";
import { OrderHandlers } from "../../handlers/admin/OrderHandlers";
import { CartHandlers } from "../../handlers/eshop/CartHandlers";
import { CheckoutHandlers } from "../../handlers/eshop/CheckoutHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
import { Checkout } from "../../locators/eshop/Checkout";

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
		CartHandlers.clearCart();
		ProductHandlers.openProductPage(PRODUCT);
		ProductPageHandlers.addProductToCart();
		CartHandlers.checkThatProductIsInCart(PRODUCT);
		CartHandlers.proceedToCheckout();
		cy.WaitForEshopToLoad();
		cy.url().should("contain", "checkout/#shipping");
		CheckoutHandlers.checkLoggedPaymentPage(customer);
		cy.get(Checkout.continue_checkout_button).click();
		CheckoutHandlers.checkPaymentPage(customer);
		CheckoutHandlers.placeOrder();
		CheckoutHandlers.extractOrderID();
		cy.magentoLogin(admin);
		cy.visit(orders);
		cy.WaitForMagentoToLoad().then(() => {
			FilterHandlers.filterByLabelText("ID", localStorage.getItem("order_id"));
			OrderHandlers.openOrderByOrderId(localStorage.getItem("order_id"));
			OrderHandlers.checkOrderStatus("Pending");
			OrderHandlers.checkCustomerLoggedIn(customer);
			//check that the order has the correct shipping and billing address
			cy.get(`div#order_item_${parseInt(localStorage.getItem("order_id")) + 1}`).should("contain", PRODUCT);
		});
	});
});