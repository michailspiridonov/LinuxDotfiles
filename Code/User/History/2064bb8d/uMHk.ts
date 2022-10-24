import { Review } from "../../fixtures/users/Review";
import { ProductPage } from "../../locators/eshop/ProductPage";

export class ProductPageHandlers {
    /**
     * Check that the review is present
     * @param review review to check
     */
    static checkPresenceOfReview(review: Review) {
        cy.get(ProductPage.rewiews.review_item)
            .should(`contain`, review.nickname)
            .should(`contain`, review.summary)
            .should(`contain`, review.review);
    }

    /**
     * Check that the review is not present
     * @param review review to check
     */
    static checkAbsenceOfReview(review: Review) {
        cy.get(ProductPage.rewiews.review_item)
            .should(`not.contain`, review.nickname)
            .should(`not.contain`, review.summary)
            .should(`not.contain`, review.review);
    }
}