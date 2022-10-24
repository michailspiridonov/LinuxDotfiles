import { Homepage } from "../../locators/eshop/Homepage";

export class SearchHandlers {
    static search = (searchTerm: string) => {
        cy.get(Homepage.searchInput).type(`${searchTerm}{enter}`);
    }
}