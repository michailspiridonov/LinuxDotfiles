import { AdminFilterHandlers } from "../handlers/admin/AdminFilterHandlers";
import { AdminProductListHandlers } from "../handlers/admin/AdminProductListHandlers";
import { SearchHandlers } from "../handlers/eshop/SearchHandlers";
import { Homepage } from "../locators/eshop/Homepage";
import { SearchPage } from "../locators/eshop/SearchPage";

describe("Search test", () => {
	const product_var_name = "product_name";
	let admin;
	const products = Cypress.env("admin_urls").catalog.products;
    
	before(() => {
		//get admin user fixture
		cy.fixture("data/user/admin").then(adminFixture => admin = adminFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Searches for a product", () => {
		//get a product from magento
		cy.magentoLogin(admin);
		cy.visit(products);
		cy.WaitForMagentoToLoad();
		//filter products by visibility
		AdminFilterHandlers.filterSelectByLabelText("Visibility", "Catalog, Search");
		cy.WaitForMagentoToLoad();
		//get a name of the 1st product
		AdminProductListHandlers.getNameOfFirstProductInList(product_var_name);
		cy.visit("/");
		cy.WaitForEshopToLoad().then(() => {
			SearchHandlers.search(localStorage.getItem(product_var_name));
			cy.get(SearchPage.searched_product).should("contain", localStorage.getItem(product_var_name));
		});
	});

	it("Tests advanced search", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).click();
	});
});