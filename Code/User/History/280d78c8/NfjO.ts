import { User } from "../../fixtures/users/user";
import { CustomerDetail } from "../../locators/admin/CustomerDetail";
import { List } from "../../locators/admin/List";

export class UserListHandlers {
    /**
     * 
     * @returns {string}
     */
    static getFirstUserID = () => {
        cy.get(`tr.data-row`).first().find(`td`).eq(1).find(`div.data-grid-cell-content`).invoke(`text`).then((text) => {return text.trim()});
    }

    static checkUserIsInList = (firstName: string, lastName: string, email: string) => {
        cy.get(`div.admin__data-grid-wrap`)
            .should(`contain`, firstName)
            .should(`contain`, lastName)
            .should(`contain`, email);
    }

    static checkCustomerAddress = (customer: User) => {
        //click edit button
        cy.get(List.edit_button).click();
        //check that the address is saved
        cy.get(CustomerDetail.customer_address)
            .should(`contain`, customer.firstName)
            .should(`contain`, customer.lastName)
            .should(`contain`, customer.company)
            .should(`contain`, customer.address.street)
            .should(`contain`, customer.address.city)
            .should(`contain`, customer.address.state)
            .should(`contain`, customer.address.zip)
            .should(`contain`, customer.address.country)
            .should(`contain`, customer.phone);

    }
}