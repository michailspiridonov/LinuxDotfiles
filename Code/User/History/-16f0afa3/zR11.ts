import { Cart } from "../../locators/eshop/Cart";

export class CartHandlers {

	/**
     * checks that the product is in the cart
     * @param {string} product product to check
     */
	static checkThatProductIsInCart(product: string) {
		cy.get(Cart.cart).click();
		cy.get(Cart.product_name).should("contain", product);
		cy.get(Cart.close_cart_btn).should("be.visible").click();
	}

	/**
     * Proceed to checkout
     */
	static proceedToCheckout() {
		cy.get(Cart.cart).click();
		cy.get(Cart.checkout_btn).click();
	}

	static clearCart() {
		cy.get(Cart.cart).click();
		cy.get(Cart.clear_cart_btn).should("be.visible").click({multiple: true});
		cy.get(Cart.close_cart_btn).should("be.visible").click();
	}

	static viewCartPage() {
		cy.get(Cart.cart).click();
		cy.get("a.action.viewcart").click();
		cy.WaitForEshopToLoad();
	}
}