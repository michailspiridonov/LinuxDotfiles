import { Homepage } from "../../locators/eshop/Homepage";

export class ProductHandlers {
	/**
     * Opens a product page
     * @param {string} productName name of the product to open
     */
	static openProductPage(productName: string) {
		cy.get(Homepage.product_name_link).contains(productName).click();
		cy.get(Homepage.page_title).should("contain", productName);
	}
}