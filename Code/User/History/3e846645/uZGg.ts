import { getRandomString } from "../../fixtures/users/user";
import { Homepage } from "../../locators/eshop/Homepage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

describe(`Review submitted by guest`, () => {
    const PRODUCT = `test`;
    let date: string = new Date().toISOString().slice(0, 10);
    let nickname = Cypress.env("nickname") + date;
    let summary = Cypress.env("summary") + date;
    let review = Cypress.env("review") + date;
    let admin;

    before(() => {
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
    });

    it(`Submits a review`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(Homepage.product_name_link).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
        //submit a review
        cy.wait(2000)
        cy.get(ProductPage.rewiews.nickname).type(`${nickname}`);
        cy.get(ProductPage.rewiews.summary).type(summary);
        cy.get(ProductPage.rewiews.review).type(review);
        cy.get(`button`).contains(`Submit Review`).click();
        //check the success message
        cy.get(`div.message-success`).should(`contain`, `You submitted your review for moderation.`);
    });

    it(`Checks and approves the review in magento`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(`li#menu-magento-backend-marketing`).click();
        //open reviews tab
        cy.get(`li.item-catalog-reviews-ratings-reviews-all`).click();
        cy.WaitForMagentoToLoad();
        //reset the filter
        cy.get(`button[title="Reset Filter"]`).click();
        //search for the review
        cy.get(`input#reviewGrid_filter_title`).type(`${summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(`table#reviewGrid_table`)
            // .should(`contain`, nickname)
            .should(`contain`, summary)
            .should(`contain`, review);
        //select the review
        cy.get(`input.admin__control-checkbox`).click();
        //approve the review
        cy.get(`select#reviewGrid_massaction-select`).select(`Update Status`);
        cy.get(`input.admin__control-checkbox`).click();
        cy.get(`select#status`).first().select(`Approved`);
        cy.get(`button[title="Submit"]`).click();
        cy.WaitForMagentoToLoad();
        //check the success message
        cy.get(`div[data-ui-id="messages-message-success"]`).should(`contain`, `A total of 1 record(s) have been updated.`);
    });

    it(`Checks that the review is present in the product page`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(`a`).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, PRODUCT);
        //check that the review is present
        cy.get(`li.review-item`)
            .should(`contain`, nickname)
            .should(`contain`, summary)
            .should(`contain`, review);
    });

    it(`Deletes the review`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(`li#menu-magento-backend-marketing`).click();
        //open reviews tab
        cy.get(`li.item-catalog-reviews-ratings-reviews-all`).click();
        cy.WaitForMagentoToLoad();
        //reset the filter
        cy.get(`button[title="Reset Filter"]`).click();
        //search for the review
        cy.get(`input#reviewGrid_filter_title`).type(`${summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(`table#reviewGrid_table`)
            // .should(`contain`, nickname)
            .should(`contain`, summary)
            .should(`contain`, review);
        //select the review
        cy.get(`input.admin__control-checkbox`).click();
        //delete the review
        cy.get(`select#reviewGrid_massaction-select`).select(`Delete`);
        cy.get(`input.admin__control-checkbox`).click();
        cy.get(`button[title="Submit"]`).click();
        //confirm
        cy.get(`button`).contains(`OK`).click();
        //check the success message
        cy.get(`div[data-ui-id="messages-message-success"]`).should(`contain`, `A total of 1 record(s) have been deleted.`);
    });

    it(`Checks that the review is not present in the product page`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(`a`).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, PRODUCT);
        //check that the review is not present
        cy.get(`div#reviews`).then($div => {
            if ($div.find(`li.review-item`).length > 0) {
                cy.get(`li.review-item`)
                    .should(`not.contain`, nickname)
                    .should(`not.contain`, summary)
                    .should(`not.contain`, review);
            } else {
                cy.get(`li.review-item`).should('not.exist');
            }
        });
    });
});