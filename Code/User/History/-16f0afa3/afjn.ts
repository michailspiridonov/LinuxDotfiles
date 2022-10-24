import { Cart } from "../../locators/eshop/Cart";

export class CartHandlers {

    static checkThatProductIsInCart(product: string) {
        cy.get(Cart.cart).click();
        cy.get(Cart.product_name).should(`contain`, product);
    }
}