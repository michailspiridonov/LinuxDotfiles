import { User } from "../../fixtures/entities/user/user";
import { AdminUserList } from "../../locators/admin/AdminUserList";

export class AdminUserListHandlers {
	/**
     * Gets the id of the first user in the list 
     * @returns {string} id of the first user in the list
     */
	static getFirstUserID(variable_name: string) {
		cy.log("**getting id of first user in list**");
		cy.get("tr.data-row").first().find("td").eq(1).find("div.data-grid-cell-content").invoke("text").then((text) => {
			localStorage.setItem(variable_name, text.trim());
		});
	}

	/**
     * Checks the the user is in the list
     * @param {User} customer customer to search for
     */
	static checkUserIsInList(customer: User){
		cy.log("**checking user is in list**");
		cy.get("div.admin__data-grid-wrap")
			.should("contain", customer.firstName)
			.should("contain", customer.lastName)
			.should("contain", customer.email);
	}

	/**
	 * Enter customer detail page
	 */
	static enterCustomerDetailPage(customer: User) {
		cy.log("**entering customer detail page**");
		cy.get(AdminUserList.list_row)
			.contains(customer.firstName)
			.contains(customer.lastName)
			// .parentsUntil(AdminUserList.list_row)
			// .parent()
			.parentsUntil("tbody")
			.find(AdminUserList.edit_button)
			.click();
	}

}