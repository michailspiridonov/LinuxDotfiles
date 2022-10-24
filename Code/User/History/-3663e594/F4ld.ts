import { User } from "../../fixtures/entities/user/user";
import { AdminCustomerDetail } from "../../locators/admin/AdminCustomerDetail";
import { AdminUserList } from "../../locators/admin/AdminUserList";

export class AdminUserDetailHandlers {
	/**
     * Checks the address of the customer
     * @param {User} customer customer whose address is to be checked
     */
	static checkCustomerAddress(customer: User){
		cy.log("**checking customer address**");
		//click edit button
		cy.get(AdminUserList.edit_button).click();
		//check that the address is saved
		cy.get(AdminCustomerDetail.customer_address)
			.should("contain", customer.firstName)
			.should("contain", customer.lastName)
			.should("contain", customer.company)
			.should("contain", customer.address.street)
			.should("contain", customer.address.city)
			.should("contain", customer.address.state)
			.should("contain", customer.address.zip)
			.should("contain", customer.address.country)
			.should("contain", customer.phone);

	}
}