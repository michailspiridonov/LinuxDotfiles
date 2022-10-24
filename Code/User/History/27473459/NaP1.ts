import { Review } from "../../fixtures/users/Review";
import { AdminUIElements } from "../../locators/admin/AdminUIElements";
import { Filter } from "../../locators/admin/Filter";
import { ReviewPage } from "../../locators/admin/ReviewPage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class ReviewHandlers {
    /**
     * submit a review
     * @param review review to be added
     */
    static submitReview(review: Review) {
        cy.get(ProductPage.rewiews.nickname).clear().type(review.nickname);
        cy.get(ProductPage.rewiews.summary).type(review.summary);
        cy.get(ProductPage.rewiews.review).type(review.review);
        cy.get(ProductPage.rewiews.submit).click();
        //check the success message
        cy.get(UIElements.success_message).should(`contain`, `You submitted your review for moderation.`);
    }

    /**
     * filter the review list by title
     * @param review review to filter by
     */
    static filterReviewsByTitle(review: Review) {
        //reset the filter
        cy.get(Filter.inline_filter.reset_filter).click();
        //search for the review
        cy.get(Filter.inline_filter.title).clear({force: true}).type(`${review.summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(ReviewPage.review_table)
            .should(`contain`, review.summary)
            .should(`contain`, review.review);
    }

    /**
     * Update review status 
     * @param review review to update
     * @param status new status
     */
    static updateReviewStatus(review: Review, status: string){
        //select the review
        cy.get(ReviewPage.review_checkbox).check();
        cy.get(ReviewPage.review_checkbox).check();
        //approve the review
        cy.get(ReviewPage.action_select).select(`Update Status`);
        cy.get(ReviewPage.status_select).first().select(status);
        cy.get(ReviewPage.submit_action).click();
        cy.WaitForMagentoToLoad();
        //check the success message
        cy.get(AdminUIElements.success_message).should(`contain`, `A total of 1 record(s) have been updated.`);
    }

    /**
     * Delete review
     * @param review review to delete
     */
    static deleteReview(review: Review) {
        //select the review
        cy.get(ReviewPage.review_checkbox).click();
        //delete the review
        cy.get(ReviewPage.action_select).select(`Delete`);
        cy.get(ReviewPage.submit_action).click();
        //confirm
        cy.get(AdminUIElements.ok_button).click();
        //check the success message
        cy.get(AdminUIElements.success_message).should(`contain`, `A total of 1 record(s) have been deleted.`);
    }
}