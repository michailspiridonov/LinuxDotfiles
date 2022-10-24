import { ReviewHandlers } from "../../handlers/admin/ReviewHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
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
    let review = new Review(`${Cypress.env("review").nickname + date}`, `${Cypress.env("review").summary + date}`, `${Cypress.env("review").review + date}`);
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
        ReviewHandlers.submitReview(review);
    });

    it(`Checks and approves the review in magento`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(NavMenu.marketing).click();
        //open reviews tab
        cy.get(NavMenu.marketing_submenu.user_content.all_reviews).click();
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.updateReviewStatus(review, `Approved`);
    });

    it(`Checks that the review is present in the product page`, () => {
        cy.visit(`/`);
        //open the product
        cy.get(Homepage.product_name_link).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
        //check that the review is present
        ProductPageHandlers.checkPresenceOfReview(review);
    });

    it(`Deletes the review`, () => {
        //login
        cy.magentoLogin(admin);
        //open marketing tab
        cy.get(NavMenu.marketing).click();
        //open reviews tab
        cy.get(NavMenu.marketing_submenu.user_content.all_reviews).click();
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.deleteReview(review);
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