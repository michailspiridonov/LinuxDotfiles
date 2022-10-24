import { User } from "../../fixtures/users/user";
import { AddressForm } from "../../locators/eshop/AddressForm";
import { CustomerProfile } from "../../locators/eshop/CustomerProfile";

export class UserProfileHandlers {
    static add_address(customer: User) {
        cy.get(AddressForm.company).type(customer.company);
        cy.get(AddressForm.telephone).type(customer.phone);
        cy.get(AddressForm.street_address).type(customer.address.street);
        cy.get(AddressForm.city).type(customer.address.city);
        cy.get(AddressForm.zip).type(customer.address.zip);
        cy.get(AddressForm.country).select(customer.address.country);
        cy.get(AddressForm.region).type(customer.address.state);
        cy.get(CustomerProfile.save_address_button);
    }
}