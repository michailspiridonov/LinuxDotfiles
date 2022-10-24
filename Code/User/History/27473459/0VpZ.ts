import { Review } from "../../fixtures/users/Review";
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
}