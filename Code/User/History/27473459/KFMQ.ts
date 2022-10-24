import { Review } from "../../fixtures/users/Review";
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
}