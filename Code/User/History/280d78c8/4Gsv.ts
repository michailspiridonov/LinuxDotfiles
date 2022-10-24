export class UserListHandlers {
    static getFirstUserID = () => {
        return cy.get(`tr.data-row`).first().find(`td`).eq(1).find(`div.data-grid-cell-content`).invoke(`text`);
    }
}