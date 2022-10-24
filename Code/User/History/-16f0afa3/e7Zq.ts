import { should } from "chai";
import { Cart } from "../../locators/eshop/Cart";

export class CartHandlers {

    static checkThatProductIsInCart(product: string) {
        cy.get(Cart.cart).click();
        cy.get(Cart.product_name).should(`contain`, product);
        cy.get(Cart.close_cart_btn).should(`be.visible`).click();
    }

    static proceedToCheckout() {
        cy.get(Cart.cart).click();
        cy.get(Cart.checkout_btn).click();
    }
}