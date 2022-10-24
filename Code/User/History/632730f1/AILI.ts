export class AdminUserApiHandlers {
	/**
     * Confirms the user account
     * @param {string} id id of the user
     */
	static confirmUserRegistration(id: string) {
		cy.log(`**confirming user registration: ${id}**`);
		return cy.request({
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
}