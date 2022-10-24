import { isArrayLikeObject } from "cypress/types/lodash";
import { AdminFilterHandlers } from "../handlers/admin/AdminFilterHandlers";
import { AdminProductApiHandlers } from "../handlers/admin/AdminProductApiHandlers";
import { AdminProductListHandlers } from "../handlers/admin/AdminProductListHandlers";
import { SearchHandlers } from "../handlers/eshop/SearchHandlers";
import { Homepage } from "../locators/eshop/Homepage";
import { SearchPage } from "../locators/eshop/SearchPage";
import { extractTextFromHTML } from "../support/utils";

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

	it("Tests advanced search by product name", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).should("be.visible").first().click();
		AdminProductApiHandlers.getAllProducts().then(products => {
			const all_products = products;
			const searchable_products = AdminProductApiHandlers.removeNonSearchableProducts(all_products);
			const random_product = AdminProductApiHandlers.getRandomProduct(searchable_products);
			SearchHandlers.advancedSearchByParameter(SearchPage.advanced_search_name_input, random_product.name);
			SearchHandlers.checkSearchResults(random_product);
		});
	});
	
	it("Tests advanced search by product SKU", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).should("be.visible").first().click();
		AdminProductApiHandlers.getAllProducts().then(products => {
			const all_products = products;
			const searchable_products = AdminProductApiHandlers.removeNonSearchableProducts(all_products);
			const random_product = AdminProductApiHandlers.getRandomProduct(searchable_products);
			SearchHandlers.advancedSearchByParameter(SearchPage.advanced_search_sku_input, random_product.sku);
			SearchHandlers.checkSearchResults(random_product);
		});
	});

	it("Tests advanced search by product description", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).should("be.visible").first().click();
		AdminProductApiHandlers.getAllProducts().then(products => {
			const all_products = products;
			const searchable_products = AdminProductApiHandlers.removeNonSearchableProducts(all_products);
			let description: string;
			while(description === undefined) {
				const random_product = AdminProductApiHandlers.getRandomProduct(searchable_products);
				const product_custom_attributes = random_product.custom_attributes;
				const description_attribute = product_custom_attributes.find(attribute => attribute.attribute_code === "description");
				if(!description_attribute) {
					continue;
				}
				description = extractTextFromHTML(description_attribute.value);
			}
			SearchHandlers.advancedSearchByParameter(SearchPage.advanced_search_description_input, description);
		});
	});

	it("Tests advanced search by product short description", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).should("be.visible").first().click();
		AdminProductApiHandlers.getAllProducts().then(products => {
			const all_products = products;
			const searchable_products = AdminProductApiHandlers.removeNonSearchableProducts(all_products);
			let short_description: string;
			while(short_description === undefined) {
				const random_product = AdminProductApiHandlers.getRandomProduct(searchable_products);
				const product_custom_attributes = random_product.custom_attributes;
				const short_description_attribute = product_custom_attributes.find(attribute => attribute.attribute_code === "short_description");
				if(!short_description_attribute) {
					continue;
				}
				short_description = extractTextFromHTML(short_description_attribute.value);
			}
			SearchHandlers.advancedSearchByParameter(SearchPage.advanced_search_short_description_input, short_description);
		});
	});

	it("Tests advanced search by product price", () => {
		cy.visit("/");
		cy.get(Homepage.footer_links.advanced_search).should("be.visible").first().click();
		AdminProductApiHandlers.getAllProducts().then(products => {
			const all_products = products;
			const searchable_products = AdminProductApiHandlers.removeNonSearchableProducts(all_products);
			const random_product = AdminProductApiHandlers.getRandomProduct(searchable_products);
			SearchHandlers.advancedSearchByParameter(SearchPage.advanced_search_name_input ,random_product.name);
		});
	});
});