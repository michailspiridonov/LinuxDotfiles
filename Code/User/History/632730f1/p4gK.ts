export class UserApiHandlers {
	/**
     * Confirms the user account
     * @param {string} id id of the user
     */
	static confirmUserRegistration(id: string) {
		cy.log(`**confirming user registration: ${id}**`);
		cy.request({
			method: "PUT",
			url: `/rest/default/V1/customers/${id}`,
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			auth: {
				bearer: Cypress.env("admin").token
			},
			body: {
				"customer": {
					"confirmation": null,
				},
			}
		});
	}

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