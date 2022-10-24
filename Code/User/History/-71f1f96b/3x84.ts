import { Homepage } from "../../locators/eshop/Homepage";

export class SearchHandlers {
	/**
     * Search products
     * @param {string} searchTerm search term 
     */
	static search = (searchTerm: string) => {
		cy.log("**searching for " + searchTerm + "**");
		cy.get(Homepage.searchInput).type(`${searchTerm}{enter}`);
		//check the page title
		cy.get(Homepage.page_title).should("contain", searchTerm);
	};

	/**
	 * Advanced product search by prduct name
	 */
	static advancedSearchByProductName = () => {
		cy.log("**advanced search by product name**");
		cy.get(Homepage.page_title).should("contain", "Advanced Search");
		
	};
}