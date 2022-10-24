import { Review } from "../../fixtures/users/Review";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class ProductPageHandlers {
	/**
     * Check that the review is present
     * @param {Review} review review to check
     */
	static checkPresenceOfReview(review: Review) {
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
		cy.intercept("GET", "/customer/section/load/**").as("customerSection");
		cy.get(ProductPage.add_to_cart).click();
		cy.get(UIElements.success_message).should("contain", /You added .+ to your shopping cart/);
		cy.wait("@customerSection");
	}
}