import { User } from "../../fixtures/users/user";
import { OrderDetail } from "../../locators/eshop/OrderDetail";

export class AdminOrderHandlers {
	/**
     * opens order from list by order id
     * @param orderId id of the order to open
     */
	static openOrderByOrderId(orderId: string) {
		cy.get("tr.data-row").contains(orderId).click();
	}

	/**
     * check order status
     * @param status desired status
     */
	static checkOrderStatus(status: string){
		cy.get(OrderDetail.order_status).should("contain", status);
	}

	static checkCustomerInfo(customer: User){
		cy.get(OrderDetail.account_information)
			.should("contain", customer.firstName)
			.and("contain", customer.lastName)
			.and("contain", customer.email);
	}

	/**
     * check customer info in order detail
     * @param customer customer to check
     */
	static checkCustomerNotLoggedIn(customer: User){
		cy.get(OrderDetail.account_information)
			.should("contain", customer.firstName)
			.and("contain", customer.lastName)
			.and("contain", customer.email)
			.and("contain", "NOT LOGGED IN");
	}

	/**
     * check customer info in order detail
     * @param customer customer to check
     */
	static checkCustomerLoggedIn(customer: User){
		cy.get(OrderDetail.account_information)
			.should("contain", customer.firstName)
			.and("contain", customer.lastName)
			.and("contain", customer.email);
	}

	/**
     * check addresses in order detail
     * @param customer customer to check
     */
	static checkAddresses(customer: string){
		cy.get("div.order-billing-address").find("address.admin__page-section-item-content").then($el => this.checkAddress($el, customer));
		cy.get("div.order-shipping-address").find("address.admin__page-section-item-content").then($el => this.checkAddress($el, customer));
	}

	/**
     * check address in specific element in order detail 
     * @param $element element where address is located
     * @param customer customer to check
     */
	static checkAddress($element, customer) {
		cy.wrap($element)
			.should("contain", customer.firstName)
			.and("contain", customer.lastName)
			.and("contain", customer.address.street)
			.and("contain", customer.address.city)
			.and("contain", customer.address.zip)
			.and("contain", customer.address.country)
			.and("contain", customer.phone);
	}
}