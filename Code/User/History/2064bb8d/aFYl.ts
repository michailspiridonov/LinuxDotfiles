import { ProductPage } from "../../locators/eshop/ProductPage";

export class ProductPageHandlers {
    static checkPresenceOfReview(review: Review) {
        cy.get(ProductPage.rewiews.review_item)
            .should(`contain`, review.nickname)
            .should(`contain`, review.summary)
            .should(`contain`, review.review);
    }
}