import { AdminFilterHandlers } from "../handlers/admin/AdminFilterHandlers";
import { AdminProductListHandlers } from "../handlers/admin/AdminProductListHandlers";
import { SearchHandlers } from "../handlers/eshop/SearchHandlers";
import { Filter } from "../locators/admin/AdminFilter";
import { AdminNavMenu } from "../locators/admin/AdminNavMenu";
import { Homepage } from "../locators/eshop/Homepage";
import { SearchPage } from "../locators/eshop/SearchPage";

describe("Search test", () => {
	let product;
	let admin;
	const products = Cypress.env("urls").catalog.products;
    
	before(() => {
		//get admin user fixture
		cy.fixture("users/admin").then(adminFixture => admin = adminFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Gets a product name from magento", () => {
		//get a product from magento
		cy.magentoLogin(admin);
		cy.visit(products);
		cy.WaitForMagentoToLoad();
		//filter products by visibility
		AdminFilterHandlers.filterSelectByLabelText("Visibility", "Catalog, Search");
		cy.get(Filter.ApplyFilterButton).click();
		cy.WaitForMagentoToLoad();
		//get a name of the 1st product
		ProductListHandlers.getNameOfFirstProductInList().then(name => product = name.trim());
	});

	it("Searches for a product", () => {
		cy.visit("/").wait(1500);
		//type the product name into the search field
		SearchHandlers.search(product);
		//check the page title
		cy.get(Homepage.page_title).should("contain", product);
		//check that the product is included in the search results
		cy.get(SearchPage.searched_product).should("contain", product);
	});
});