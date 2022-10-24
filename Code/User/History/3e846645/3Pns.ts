import { Review } from "../../fixtures/users/Review";
import { ReviewHandlers } from "../../handlers/admin/ReviewHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
import { Homepage } from "../../locators/eshop/Homepage";

describe(`Review submitted by guest`, () => {
    const PRODUCT = `test`;
    let date: string = new Date().toISOString();
    let review = new Review(`${Cypress.env("review").nickname + date}`, `${Cypress.env("review").summary + date}`, `${Cypress.env("review").review + date}`);
    let admin;
    let all_reviews = Cypress.env(`urls`).marketing.all_reviews;

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
        ProductHandlers.openProductPage(PRODUCT);
        //submit a review
        cy.wait(1000)
        ReviewHandlers.submitReview(review);
        cy.log(`**review submitted**`);
        //login
        cy.magentoLogin(admin);
        //open reviews tab
        cy.visit(all_reviews)
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.updateReviewStatus(review, `Approved`);
        cy.log(`**review approved**`);
        cy.visit(`/`);
        ProductHandlers.openProductPage(PRODUCT);
        //check that the review is present
        ProductPageHandlers.checkPresenceOfReview(review);
        cy.log(`**review is present**`);
        //open admin reviews tab
        cy.visit(all_reviews);
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.deleteReview(review);
        cy.log(`**review deleted**`);
        cy.visit(`/`);
        ProductHandlers.openProductPage(PRODUCT);
        //check that the review is not present
        ProductPageHandlers.checkAbsenceOfReview(review);
        cy.log(`**review is not present**`);
    });
});