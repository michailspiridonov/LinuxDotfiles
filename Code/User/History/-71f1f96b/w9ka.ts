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
}