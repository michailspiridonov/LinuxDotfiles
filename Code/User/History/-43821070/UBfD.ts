import { Review } from "../../fixtures/entities/misc/Review";
import { AdminUIElements } from "../../locators/admin/AdminUIElements";
import { AdminFilter } from "../../locators/admin/AdminFilter";
import { AdminReviewPage } from "../../locators/admin/AdminReviewPage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class AdminReviewHandlers {
	/**
     * filter the review list by title
     * @param review review to filter by
     */
	static filterReviewsByTitle(review: Review) {
		cy.log("**filtering reviews**");
		//reset the filter
		cy.get(AdminFilter.inline_filter.reset_filter).click();
		//search for the review
		cy.get(AdminFilter.inline_filter.title).clear({force: true}).type(`${review.summary}{enter}`);
		cy.WaitForMagentoToLoad();
		//check that the review is present
		cy.get(AdminReviewPage.review_table)
			.should("contain", review.summary)
			.should("contain", review.review);
	}

	/**
     * Update review status 
     * @param status new status
     */
	static updateFirstReviewStatus(status: string){
		cy.log("**updating review status**");
		//select the review
		cy.get(AdminReviewPage.review_checkbox).check();
		//approve the review
		cy.get(AdminReviewPage.action_select).select("Update Status");
		cy.get(AdminReviewPage.review_checkbox).check();
		cy.get(AdminReviewPage.status_select).first().select(status);
		cy.get(AdminReviewPage.submit_action).click();
		cy.WaitForMagentoToLoad();
		//check the success message
		cy.get(AdminUIElements.success_message).should("contain", "A total of 1 record(s) have been updated.");
	}

	/**
     * Delete review
     */
	static deleteFirstReview() {
		cy.log("**deleting review**");
		//select the review
		cy.get(AdminReviewPage.review_checkbox).click();
		//delete the review
		cy.get(AdminReviewPage.action_select).select("Delete");
		cy.get(AdminReviewPage.review_checkbox).check();
		cy.get(AdminReviewPage.submit_action).click();
		//confirm
		cy.get(AdminUIElements.ok_button).click();
		//check the success message
		cy.get(AdminUIElements.success_message).should("contain", "A total of 1 record(s) have been deleted.");
	}
}