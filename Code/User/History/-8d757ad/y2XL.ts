export class ProductListHandlers {
    static getNameOfFirstProductInList = () => {
        return cy.get(`tr[data-repeat-index="0"]`).find(`td`).eq(3).invoke('text');
    }
}