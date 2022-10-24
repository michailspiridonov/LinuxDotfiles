import { Cart } from "../../locators/eshop/Cart";
import { UIElements } from "../../locators/eshop/UIElements";

export class CartHandlers {

	/**
     * checks that the product is in the cart
     * @param {string} product product to check
     */
	static checkThatProductIsInCart(product: string) {
		cy.log("**checking that product is in cart**");
		cy.get(Cart.cart).click();
		cy.get(Cart.product_name).should("be.visible").should("contain", product);
		cy.get(Cart.close_cart_btn).should("be.visible").click();
	}

	/**
     * Proceed to checkout
     */
	static proceedToCheckout() {
		cy.log("**proceeding to checkout**");
		cy.get(Cart.cart).click();
		cy.get(Cart.checkout_btn).click();
	}

	static clearCart() {
		cy.log("**clearing cart**");
		cy.get(Cart.cart).click();
		cy.get(Cart.cart_main_element).then($cart => {
			if ($cart.find("li.item").length > 0) {
				cy.get(Cart.clear_cart_btn).each($btn => {
					cy.wrap($btn).should("be.visible").click();
					cy.get(UIElements.confirmation_button).click();
					cy.get(Cart.cart_main_element).should("be.visible");
				});
			}
		});
		cy.get(Cart.close_cart_btn).should("be.visible").click();
	}

	static viewCartPage() {
		cy.log("**viewing cart page**");
		cy.get(Cart.cart).click();
		cy.get("a.action.viewcart").click();
		cy.WaitForEshopToLoad();
	}
}