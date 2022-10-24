export class AdminProductApiHandlers {
	/**
	 * Retrieves list of all products
	 */
	static getProducts() {
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
		});
	}
}