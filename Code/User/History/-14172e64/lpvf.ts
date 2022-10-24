export class ProductHandlers {
    /**
     * Opens a product page
     * @param productName name of the product to open
     */
    static openProductPage(productName: string) {
        cy.get(`a.product-item-link`).contains(productName).click();
    }
}