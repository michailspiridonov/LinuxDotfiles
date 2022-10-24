import { ProductHandlers } from "../handlers/eshop/ProductHandlers";
import { UserProfileHandlers } from "../handlers/eshop/UserProfileHandlers";

describe("Wishlist tests", () => {

	const PRODUCT = "test";
	let user;

	before(() => {
		//set user fixture
		cy.fixture("users/user_customer").then(userFixture => user = userFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Adds a product to wishlist when logged out", () => {
		cy.visit("/");
		cy.WaitForEshopToLoad();
		ProductHandlers.openProductPage(PRODUCT);
		cy.wait(2000);
		ProductHandlers.addProductToWishlistGuest(PRODUCT, user);
		UserProfileHandlers.checkProductInWishlist(PRODUCT);
		UserProfileHandlers.clearWishlist();
	});

	it("Adds a product to wishlist when logged in", () => {
		cy.login(user.email, user.password);
		UserProfileHandlers.clearWishlist();
		cy.visit("/");
		cy.WaitForEshopToLoad();
		ProductHandlers.openProductPage(PRODUCT);
		cy.wait(2000);
		ProductHandlers.addProductToWishlistLogged(PRODUCT);
		UserProfileHandlers.clearWishlist();
	});
});	
