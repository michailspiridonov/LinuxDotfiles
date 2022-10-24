import { AdminUIElements } from "../../locators/admin/AdminUIElements";
import { Filter } from "../../locators/admin/Filter";
import { NavMenu } from "../../locators/admin/NavMenu";
import { ReviewPage } from "../../locators/admin/ReviewPage";
import { Homepage } from "../../locators/eshop/Homepage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

describe(`Review submitted by guest`, () => {
    const PRODUCT = `test`;
    let date: string = new Date().toISOString();
    let nickname = Cypress.env("review").nickname + date;
    let summary = Cypress.env("review").summary + date;
    let review = Cypress.env("review").review + date;
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
        cy.get(ProductPage.rewiews.nickname).type(nickname);
        cy.get(ProductPage.rewiews.summary).type(summary);
        cy.get(ProductPage.rewiews.review).type(review);
        cy.get(ProductPage.rewiews.submit).click();
        //check the success message
        cy.get(UIElements.success_message).should(`contain`, `You submitted your review for moderation.`);
    });

    it(`Checks and approves the review in magento`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(NavMenu.marketing).click();
        //open reviews tab
        cy.get(NavMenu.marketing_submenu.user_content.all_reviews).click();
        cy.WaitForMagentoToLoad();
        //reset the filter
        cy.get(Filter.inline_filter.reset_filter).click();
        //search for the review
        cy.get(Filter.inline_filter.title).type(`${summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(ReviewPage.review_table)
            .should(`contain`, summary)
            .should(`contain`, review);
        //select the review
        cy.get(ReviewPage.review_checkbox).click();
        //approve the review
        cy.get(ReviewPage.action_select).select(`Update Status`);
        cy.get(ReviewPage.review_checkbox).click();
        cy.get(ReviewPage.status_select).first().select(`Approved`);
        cy.get(ReviewPage.submit_action).click();
        cy.WaitForMagentoToLoad();
        //check the success message
        cy.get(AdminUIElements.success_message).should(`contain`, `A total of 1 record(s) have been updated.`);
    });

    it(`Checks that the review is present in the product page`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(Homepage.product_name_link).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
        //check that the review is present
        cy.get(ProductPage.rewiews.review_item)
            .should(`contain`, nickname)
            .should(`contain`, summary)
            .should(`contain`, review);
    });

    it(`Deletes the review`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(NavMenu.marketing).click();
        //open reviews tab
        cy.get(NavMenu.marketing_submenu.user_content.all_reviews).click();
        cy.WaitForMagentoToLoad();
        //reset the filter
        cy.get(Filter.inline_filter.reset_filter).click();
        //search for the review
        cy.get(Filter.inline_filter.title).type(`${summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(ReviewPage.review_table)
            .should(`contain`, summary)
            .should(`contain`, review);
        //select the review
        cy.get(ReviewPage.review_checkbox).click();
        //delete the review
        cy.get(ReviewPage.action_select).select(`Delete`);
        cy.get(ReviewPage.review_checkbox).click();
        cy.get(ReviewPage.submit_action).click();
        //confirm
        cy.get(AdminUIElements.ok_button).click();
        //check the success message
        cy.get(AdminUIElements.success_message).should(`contain`, `A total of 1 record(s) have been deleted.`);
    });

    it(`Checks that the review is not present in the product page`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(Homepage.product_name_link).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
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