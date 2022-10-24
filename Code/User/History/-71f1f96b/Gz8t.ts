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
	 * Advanced product search by a price range
	 * @param {number[]} price_range price range
	 */
	static advancedSearchByPriceRange(price_range: number[]) {
		cy.log("**advanced search by price range**");
		cy.get(UIElements.page_title).should("contain", "Advanced Search");
		cy.get(SearchPage.advanced_search_price_from_input).type(`${price_range[0]}`);
		cy.get(SearchPage.advanced_search_price_to_input).type(`${price_range[1]}{enter}`);
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
}