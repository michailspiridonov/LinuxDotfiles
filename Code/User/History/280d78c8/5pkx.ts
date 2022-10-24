export class UserListHandlers {
    static getFirstUserID = () => {
        return cy.get(`tr.data-row`).first().find(`td`).eq(1).find(`div.data-grid-cell-content`).invoke(`text`);
    }

    static checkUserIsInList = (firstName: string, lastName: string, email: string) => {
        cy.get(`div.admin__data-grid-wrap`)
            .should(`contain`, firstName)
            .should(`contain`, lastName)
            .should(`contain`, email);
    }
}