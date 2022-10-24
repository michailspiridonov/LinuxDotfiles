import { Review } from "../../fixtures/users/Review";
import { AdminUIElements } from "../../locators/admin/AdminUIElements";
import { Filter } from "../../locators/admin/Filter";
import { ReviewPage } from "../../locators/admin/ReviewPage";
import { ProductPage } from "../../locators/eshop/ProductPage";
import { UIElements } from "../../locators/eshop/UIElements";

export class ReviewHandlers {
    static submitReview(review: Review) {
        cy.get(ProductPage.rewiews.nickname).type(review.nickname);
        cy.get(ProductPage.rewiews.summary).type(review.summary);
        cy.get(ProductPage.rewiews.review).type(review.review);
        cy.get(ProductPage.rewiews.submit).click();
        //check the success message
        cy.get(UIElements.success_message).should(`contain`, `You submitted your review for moderation.`);
    }

    static filterReviewsByTitle(review: Review) {
        //reset the filter
        cy.get(Filter.inline_filter.reset_filter).click();
        //search for the review
        cy.get(Filter.inline_filter.title).type(`${review.summary}{enter}`);
        cy.WaitForMagentoToLoad();
        //check that the review is present
        cy.get(ReviewPage.review_table)
            .should(`contain`, review.summary)
            .should(`contain`, review.review);
    }

    static updateReviewStatus(review: Review, status: string){
        //select the review
        cy.get(ReviewPage.review_checkbox).click();
        //approve the review
        cy.get(ReviewPage.action_select).select(`Update Status`);
        cy.get(ReviewPage.review_checkbox).click();
        cy.get(ReviewPage.status_select).first().select(status);
        cy.get(ReviewPage.submit_action).click();
        cy.WaitForMagentoToLoad();
        //check the success message
        cy.get(AdminUIElements.success_message).should(`contain`, `A total of 1 record(s) have been updated.`);
    }

    static checkPresenceOnProductPage(review: Review) {
        cy.get(ProductPage.rewiews.review_item)
            .should(`contain`, review.nickname)
            .should(`contain`, review.summary)
            .should(`contain`, review.review);
    }
}