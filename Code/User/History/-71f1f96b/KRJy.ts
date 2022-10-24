import { Product } from "../../fixtures/entities/misc/Product";
import { Homepage } from "../../locators/eshop/Homepage";
import { SearchPage } from "../../locators/eshop/SearchPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class SearchHandlers {
	/**
     * Search products
     * @param {string} searchTerm search term 
     */
	static search(searchTerm: string){
		cy.log("**searching for " + searchTerm + "**");
		cy.get(Homepage.searchInput).type(`${searchTerm}{enter}`);
		//check the page title
		cy.get(UIElements.page_title).should("contain", searchTerm);
	}

	/**
	 * Advanced product search by product name
	 * @param {string} input_locator search field input locator
	 * @param {string} searchTerm search term
	 */
	static advancedSearchByParameter(input_locator: string, searchTerm: string) {
		cy.log("**advanced search by product name**");
		cy.get(UIElements.page_title).should("contain", "Advanced Search");
		cy.get(input_locator).type(`${searchTerm}{enter}`);
		cy.get(UIElements.page_title).should("contain", "Catalog Advanced Search");
	}

	/**
	 * Check search results
	 * @param {Product} product product to check
	 */
	static checkSearchResults(product: Product) {
		cy.log("**checking search results**");
		cy.get(SearchPage.searched_product).should("contain", product.name);
	}

	/**
	 * Get a price range to search based on the product price
	 * @param {number} price of the product
	 * @returns {number[]} price range min and max
	 */
	static getPriceRange(price: number) {
		cy.log("**getting price range**");
		return [price - 5, price + 5];
	}
}