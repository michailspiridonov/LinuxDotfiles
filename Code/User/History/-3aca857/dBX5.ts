import { User } from "../../fixtures/users/user";
import { OrderDetail } from "../../locators/eshop/OrderDetail";

export class OrderHandlers {
    static openOrderByOrderId(orderId: string) {
        cy.get(`tr.data-row`).contains(orderId).click();
    }

    static checkOrderStatus(status: string){
        cy.get(OrderDetail.order_status).should(`contain`, status);
    }

    static checkCustomerInfo(customer: User){
    }

    static checkCustomerNotLoggedIn(customer: User){
        cy.get(OrderDetail.account_information)
            .should(`contain`, customer.firstName)
            .and(`contain`, customer.lastName)
            .and(`contain`, customer.email)
            .and(`contain`, `NOT LOGGED IN`);
    }

    static checkAddresses(address: string){
    }

    static checkAddress(address: string){
    }
}