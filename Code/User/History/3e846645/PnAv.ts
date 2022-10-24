import { getRandomString } from "../../fixtures/users/user";

describe(`Review submitted by guest`, () => {
    const PRODUCT = `test`;
    let nickname = getRandomString(`nickname`);
    let summary = getRandomString(`summary`);
    let review = getRandomString(`review`);
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
        cy.get(`a`).contains(PRODUCT).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, PRODUCT);
        //submit a review
        cy.wait(2000)
        cy.get(`a`).contains(`Add Your Review`).click();
        cy.get(`input#nickname_field`).type(`${nickname}`);
        cy.get(`input#summary_field`).type(summary);
        cy.get(`textarea#review_field`).type(review);
        cy.get(`button`).contains(`Submit Review`).click();
        //check the success message
        cy.get(`div.message-success`).should(`contain`, `You submitted your review for moderation.`);
    });

    it(`Checks and approves the review in magento`, () => {
        cy.visit(`/admin`);
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
        cy.get(`select#status`).first().find(`option`).contains(`Approved`).click({force: true});
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
});