import { Homepage } from "../../locators/eshop/Homepage";

export class SearchHandlers {
	/**
     * Search products
     * @param {string} searchTerm search term 
     */
	static search = (searchTerm: string) => {
		cy.get(Homepage.searchInput).type(`${searchTerm}{enter}`);
	};
}