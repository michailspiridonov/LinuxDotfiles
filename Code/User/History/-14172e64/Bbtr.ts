import { Homepage } from "../../locators/eshop/Homepage";

export class ProductHandlers {
    /**
     * Opens a product page
     * @param productName name of the product to open
     */
    static openProductPage(productName: string) {
        cy.get(Homepage.product_name_link).contains(productName).click();
    }
}