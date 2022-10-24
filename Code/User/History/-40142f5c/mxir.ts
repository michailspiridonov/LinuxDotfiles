import { User } from "../../fixtures/entities/user/user";
import { AdminFilterHandlers } from "../../handlers/admin/AdminFilterHandlers";
import { AdminOrderHandlers } from "../../handlers/admin/AdminOrderHandlers";
import { CartHandlers } from "../../handlers/eshop/CartHandlers";
import { CheckoutHandlers } from "../../handlers/eshop/CheckoutHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { Checkout } from "../../locators/eshop/Checkout";

describe("Create an order with guest account", () => {
	let customer;
	let admin;
	const PRODUCT = "test";
	const orders = Cypress.env("admin_urls").sales.orders;
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

	it("Creates an order", () => {
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		ProductHandlers.addProductToCart();
		CartHandlers.checkThatProductIsInCart(PRODUCT);
		CartHandlers.proceedToCheckout();
		cy.WaitForEshopToLoad();
		CheckoutHandlers.fillCustomerDetails(customer);
		//Continue the checkout
		cy.get(Checkout.continue_checkout_button).click();
		//PAYMENT METHOD PAGE TESTS -- no tax rules for czechia, hence no tax price twice
		CheckoutHandlers.checkPaymentPage(customer);
		//TODO
		CheckoutHandlers.placeOrder();
		CheckoutHandlers.extractOrderID();
		cy.magentoLogin(admin);
		cy.visit(orders);
		cy.WaitForMagentoToLoad().then(() => {
			AdminFilterHandlers.filterTextByLabelText("ID", localStorage.getItem("order_id"));
			AdminOrderHandlers.openOrderByOrderId(localStorage.getItem("order_id"));
			AdminOrderHandlers.checkOrderStatus("Pending");
			AdminOrderHandlers.checkCustomerNotLoggedIn(customer);
			//check that the order has the correct shipping and billing address
			cy.get(`div#order_item_${parseInt(localStorage.getItem("order_id")) + 1}`).should("contain", PRODUCT);
		});
	});
});