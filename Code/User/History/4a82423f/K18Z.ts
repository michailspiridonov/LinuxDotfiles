import { User } from "../../fixtures/users/user";
import { AdminCustomerDetail } from "../../locators/admin/AdminCustomerDetail";
import { AdminList } from "../../locators/admin/AdminList";

export class AdminUserListHandlers {
	/**
     * Gets the id of the first user in the list 
     * @returns {string} id of the first user in the list
     */
	static getFirstUserID = () => {
		cy.get("tr.data-row").first().find("td").eq(1).find("div.data-grid-cell-content").invoke("text").then((text) => {
			localStorage.setItem("user", text.trim());
		});
	};

	/**
     * Checks the the user is in the list
     * @param {User} customer customer to search for
     */
	static checkUserIsInList = (customer: User) => {
		cy.get("div.admin__data-grid-wrap")
			.should("contain", customer.firstName)
			.should("contain", customer.lastName)
			.should("contain", customer.email);
	};

	/**
     * Checks the address of the customer
     * @param {User} customer customer whose address is to be checked
     */
	static checkCustomerAddress = (customer: User) => {
		//click edit button
		cy.get(AdminList.edit_button).click();
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

	};
}