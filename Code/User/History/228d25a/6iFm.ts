import { FilterHandlers } from '../handlers/admin/FilterHandlers';
import { ProductListHandlers } from '../handlers/admin/ProductListHandlers';
import { SearchHandlers } from '../handlers/eshop/SearchHandlers';
import { Filter } from '../locators/admin/Filter';
import { NavMenu } from '../locators/admin/NavMenu';
import { SearchPage } from '../locators/eshop/SearchPage';
import { getFilterInputByLabelText } from '../support/selector_helper'

describe(`Search test`, () => {
    let product;
    let admin;
    
    before(() => {
        //get admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
    });

    it(`Gets a product name from magento`, () => {
        //get a product from magento
        cy.magentoLogin(admin);
        cy.get(NavMenu.catalog).click();
        //open products page
        cy.get(NavMenu.catalog_products).click();
        cy.WaitForMagentoToLoad();
        //filter products by visibility
        cy.get(Filter.openFilterButton).first().click({force: true});
        FilterHandlers.getFilterInputByLabelText(`Visibility`).select(`Catalog, Search`);
        cy.get(Filter.ApplyFilterButton).click();
        cy.WaitForMagentoToLoad();
        //get a name of the 1st product
        ProductListHandlers.getNameOfFirstProductInList().then(name => product = name);
    });

    it(`Searches for a product`, () => {
        cy.intercept('GET', '**/Magento_Checkout/template/minicart/**').as('cart');
        cy.visit(`/`).wait(`@cart`);
        //type the product name into the search field
        SearchHandlers.search(product);
        //check the page title
        cy.get(SearchPage.page_title).should(`contain`, product);
        //check that the product is included in the search results
        cy.get(SearchPage.searched_product).should(`contain`, product);
    });
});