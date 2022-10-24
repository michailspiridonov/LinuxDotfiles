import { Homepage } from "../../locators/eshop/Homepage";

export class ProductHandlers {
	/**
     * Opens a product page
     * @param {string} productName name of the product to open
     */
	static openProductPage(productName: string, logged = false) {
		if(logged) {
			cy.intercept("GET", "/customer/section/load/**").as("customerSection");
			cy.get(Homepage.product_name_link).contains(productName).click({force: true}).wait("@customerSection");
			cy.get(Homepage.page_title).should("contain", productName);
		} else {
			cy.get(Homepage.product_name_link).contains(productName).click({force: true});
			cy.get(Homepage.page_title).should("contain", productName);
		}
	}
}