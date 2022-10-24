import { Review } from "../../fixtures/users/Review";
import { ReviewHandlers } from "../../handlers/admin/ReviewHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";

describe(`Review by logged in user`, () => {
    const PRODUCT = `test`;
    let date: string = new Date().toISOString();
    let review = new Review(`${Cypress.env("review").nickname + date}`, `${Cypress.env("review").summary + date}`, `${Cypress.env("review").review + date}`);
    let all_reviews = Cypress.env(`urls`).marketing.all_reviews;
    let admin;
    let user; 

    before(() => {
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //load user fixture
        cy.fixture(`users/user_customer`).then(userFixture => user = userFixture).then(() => {review.nickname = user.firstName + date});
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
    });

    it(`Submits a review`, () => {
        cy.login(user.email, user.password);
        cy.visit(`/`);
        ProductHandlers.openProductPage(PRODUCT);
        cy.wait(1000);
        ReviewHandlers.submitReview(review);
        cy.log(`**review submitted**`);
    });

    it(`Checks and approves the review in magento`, () => {
        cy.magentoLogin(admin);
        cy.visit(all_reviews);
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.updateReviewStatus(review, `Approved`);
        cy.log(`**review approved**`);
    });

    it(`Checks that the review is present in the product page`, () => {
        cy.visit(`/`);
        ProductHandlers.openProductPage(PRODUCT);
        ProductPageHandlers.checkPresenceOfReview(review);
        cy.log(`**review is present**`);
    });

    it(`Deletes the review`, () => {
        cy.visit(all_reviews);
        cy.WaitForMagentoToLoad();
        ReviewHandlers.filterReviewsByTitle(review);
        ReviewHandlers.deleteReview(review);
        cy.log(`**review deleted**`);
    });

    it(`Checks that the review is not present in the product page`, () => {
        cy.visit(`/`);
        ProductHandlers.openProductPage(PRODUCT);
        ProductPageHandlers.checkAbsenceOfReview(review);
        cy.log(`**review is not present**`);
    });
});