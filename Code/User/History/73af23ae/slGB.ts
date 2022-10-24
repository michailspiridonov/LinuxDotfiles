import { Review } from "../../fixtures/entities/misc/Review";
import { AdminReviewHandlers } from "../../handlers/admin/AdminReviewHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";

describe("Review by logged in user", () => {
	const PRODUCT = "test";
	const date: string = new Date().toISOString();
	const review = new Review(`${Cypress.env("review").nickname + date}`, `${Cypress.env("review").summary + date}`, `${Cypress.env("review").review + date}`);
	const all_reviews = Cypress.env("urls").marketing.all_reviews;
	let admin;
	let user; 

	before(() => {
		//load admin user fixture
		cy.fixture("users/admin").then(adminFixture => admin = adminFixture);
		//load user fixture
		cy.fixture("users/user_customer").then(userFixture => user = userFixture).then(() => {review.nickname = user.firstName + date;});
		//site throws an uncaught exception
		//this block prevents test fail
		Cypress.on("uncaught:exception", () => {
			return false;
		});
	});

	it("Submits a review", () => {
		cy.login(user.email, user.password);
		// cy.reload();
		ProductHandlers.openProductPage(PRODUCT);
		//wait for the prefilled username to fill
		cy.wait(1000);
		AdminReviewHandlers.submitReview(review);
		cy.log("**review submitted**");
		cy.magentoLogin(admin);
		cy.visit(all_reviews);
		cy.WaitForMagentoToLoad();
		AdminReviewHandlers.filterReviewsByTitle(review);
		AdminReviewHandlers.updateReviewStatus(review, "Approved");
		cy.log("**review approved**");
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		ProductHandlers.checkPresenceOfReview(review);
		cy.log("**review is present**");
		cy.visit(all_reviews);
		cy.WaitForMagentoToLoad();
		AdminReviewHandlers.filterReviewsByTitle(review);
		AdminReviewHandlers.deleteReview(review);
		cy.log("**review deleted**");
		cy.visit("/");
		ProductHandlers.openProductPage(PRODUCT);
		ProductHandlers.checkAbsenceOfReview(review);
		cy.log("**review is not present**");
	});
});