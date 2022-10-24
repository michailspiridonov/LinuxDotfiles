import { Review } from "../../fixtures/users/Review";
import { Homepage } from "../../locators/eshop/Homepage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class ProductHandlers {
	/**
     * Opens a product page
     * @param {string} productName name of the product to open
     */
	static openProductPage(productName: string, logged = false) {
		cy.log("**Opening product page**");
		if(logged) {
			cy.intercept("GET", "/customer/section/load/**").as("customerSection");
			cy.get(Homepage.product_name_link).contains(productName).click({force: true}).wait("@customerSection");
			cy.get(Homepage.page_title).should("contain", productName);
		} else {
			cy.get(Homepage.product_name_link).contains(productName).click({force: true});
			cy.get(Homepage.page_title).should("contain", productName);
		}
	}
	
	/**
     * Check that the review is present
     * @param {Review} review review to check
     */
	static checkPresenceOfReview(review: Review) {
		cy.log("**Checking presence of review**");
		cy.get(ProductPage.rewiews.review_item)
			.should("contain", review.nickname)
			.should("contain", review.summary)
			.should("contain", review.review);
	}

	/**
     * Check that the review is not present
     * @param {Review} review review to check
     */
	static checkAbsenceOfReview(review: Review) {
		cy.log("**Checking absence of review**");
		//if no review is present, the review item is not present
		//else reviews do not contain the review
		cy.get("div#reviews").then($div => {
			if ($div.find("li.review-item").length > 0) {
				cy.get(ProductPage.rewiews.review_item)
					.should("not.contain", review.nickname)
					.should("not.contain", review.summary)
					.should("not.contain", review.review);
			} else {
				cy.get(ProductPage.rewiews.review_item).should("not.exist");
			}
		});
	}

	/**
     * Adds a product to the cart
     */
	static addProductToCart() {
		cy.log("**Adding product to cart**");
		cy.intercept("GET", "/customer/section/load/**").as("customerSection");
		cy.get(ProductPage.add_to_cart).click();
		cy.get(UIElements.success_message).should("be.visible").should("contain", "You added").and("contain", "to your");
		cy.wait("@customerSection");
	}

	/**
	 * Adds a product to the wishlist for the guest user (logged out)
	 * @param {string} productName name of the product to add to the wishlist
	 * @param user user to add the product to the wishlist
	 */
	static addProductToWishlistGuest(productName: string, user) {
		cy.log("**Adding product to wishlist**");
		cy.get(UIElements.add_to_wishlist).click();
		cy.get(UIElements.error_message).should("be.visible").should("contain", "You must login or register to add items to your wishlist.");
		cy.get("input#email").type(user.email);
		cy.get("input#pass").first().type(user.password);
		//click on login button
		cy.get("button#send2").first().click();
		cy.get(UIElements.success_message).should("be.visible").should("contain", `${productName} has been added to your Wish List.`);
	}

	/**
	 * Adds a product to the wishlist for the logged user
	 * @param {string} productName name of the product to add to the wishlist
	 */
	static addProductToWishlistLogged(productName: string) {
		cy.log("**Adding product to wishlist**");
		cy.get(UIElements.add_to_wishlist).click();
		cy.get(UIElements.success_message).should("be.visible").should("contain", `${productName} has been added to your Wish List.`);
	}
}