export class OrderHandlers {
    static openOrderByOrderId(orderId: string) {
        cy.get(`tr.data-row`).contains(orderId).click();
    }
}