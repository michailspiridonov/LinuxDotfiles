import { Product } from "../../fixtures/entities/misc/Product";

export class AdminProductApiHandlers {
	/**
	 * Retrieves list of all products
	 */
	static getAllProducts() {
		cy.log("**retrieving list of all products**");
		return cy.request({
			method: "GET",
			url: "/rest/default/V1/products",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			auth: {
				bearer: Cypress.env("admin").token
			},
			qs: {
				searchCriteria: ""
			}
		}).then(response => {
			console.log(response.body.items);
		});
	}

	/**
	 * Gets a random product from an array of products
	 * @param {Product[]} products array of products
	 * @returns {Product} random product from the array
	 */
	static getRandomProduct(products: Product[]) {
		cy.log("**getting random product**");
		return Cypress._.sample(products);
	}
}