import { User } from "../../fixtures/users/user";

export class OrderHandlers {
    static openOrderByOrderId(orderId: string) {
        cy.get(`tr.data-row`).contains(orderId).click();
    }

    static checkOrderStatus(status: string){

    }

    static checkCustomerInfo(customer: User){
    }

    static checkCustomerNotLoggedIn(customer: User){
    }

    static checkAddresses(address: string){
    }

    static checkAddress(address: string){
    }
}