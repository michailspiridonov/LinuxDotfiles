export class ProductListHandlers {
    /**
     * get the name of the first product in the list
     * @returns the name of the first product in the list 
    */
    static getNameOfFirstProductInList = () => {
        return cy.get(`tr[data-repeat-index="0"]`).find(`td`).eq(3).invoke('text');
    }
}