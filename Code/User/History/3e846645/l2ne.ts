import { Review } from "../../fixtures/entities/misc/Review";
import { AdminReviewHandlers } from "../../handlers/admin/AdminReviewHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";

describe("Review submitted by guest", () => {
	const PRODUCT = "test";
	const date: string = new Date().toISOString();
	const review = new Review(`${Cypress.env("review").nickname + date}`, `${Cypress.env("review").summary + date}`, `${Cypress.env("review").review + date}`);
	let admin;
	const all_reviews = Cypress.env("urls").marketing.all_reviews;

	before(() => {
		//load admin user fixture
		cy.fixture("users/admin").then(adminFixture => admin = adminFixture);
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Submits a review", () => {
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		//submit a review
		cy.wait(1000);
		AdminReviewHandlers.submitReview(review);
		cy.log("**review submitted**");
		//login
		cy.magentoLogin(admin);
		//open reviews tab
		cy.visit(all_reviews);
		cy.WaitForMagentoToLoad();
		AdminReviewHandlers.filterReviewsByTitle(review);
		AdminReviewHandlers.updateReviewStatus(review, "Approved");
		cy.log("**review approved**");
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		//check that the review is present
		ProductHandlers.checkPresenceOfReview(review);
		cy.log("**review is present**");
		//open admin reviews tab
		cy.visit(all_reviews);
		cy.WaitForMagentoToLoad();
		AdminReviewHandlers.filterReviewsByTitle(review);
		AdminReviewHandlers.deleteReview(review);
		cy.log("**review deleted**");
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		//check that the review is not present
		ProductHandlers.checkAbsenceOfReview(review);
		cy.log("**review is not present**");
	});
});