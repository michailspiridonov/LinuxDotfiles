export class ProductHandlers {
    static openProductPage(productName: string) {
        cy.get(`a[href*="${productName}"]`).click();
    }
}