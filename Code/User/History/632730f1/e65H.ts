export class UserApiHandlers {
    static confirm_user_registration(id: number) {
        cy.request({
            method: 'PUT',
            url: `/rest/default/V1/customers/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            auth: {
                bearer: Cypress.env("admin").token
            },
            body: {
                "customer": {
                    "confirmation": null,
                },
            }
        })
    }
}