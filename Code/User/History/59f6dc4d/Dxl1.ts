import { User } from "../../fixtures/entities/user/user";
import { AddressForm } from "../../locators/eshop/AddressForm";
import { CustomerProfile } from "../../locators/eshop/CustomerProfile";
import { UIElements } from "../../locators/eshop/UIElements";
import { UserProfile } from "../../locators/eshop/UserProfile";

export class UserProfileHandlers {
	/**
     * Fill the address form
     * @param {User} customer customer whose address is to be filled
     */
	static fill_address_form(customer: User) {
		cy.log("**filling address form**");
		cy.get(AddressForm.company).type(customer.company);
		cy.get(AddressForm.telephone).type(customer.phone);
		cy.get(AddressForm.street_address).type(customer.address.street);
		cy.get(AddressForm.city).type(customer.address.city);
		cy.get(AddressForm.zip).type(customer.address.zip);
		cy.get(AddressForm.country).select(customer.address.country);
		cy.get(AddressForm.region).type(customer.address.state);
		cy.get(CustomerProfile.save_address_button).click();
	}

	/**
     * Add billing address
     * @param {User} customer customer whose address is to be added
     */
	static addBillingAddress(customer: User) {
		cy.log("**adding billing address**");
		//open customer dropdown
		cy.get(UIElements.customer_dropdown_menu).first().click();
		//open acount settings
		cy.get(UIElements.customer_account_settings).first().click();
		cy.get(CustomerProfile.edit_billing_address_button).click();
		//add the billing address
		UserProfileHandlers.fill_address_form(customer);
		//check that the address is saved
		cy.get(UIElements.success_message).should("contain", "You saved the address.");
	}

	/**
	 * Check that the product is in the wishlist
	 * @param {string} product_name name of the product
	 */
	static checkProductInWishlist(product_name: string) {
		cy.log("**checking product in wishlist**");
		cy.visit(Cypress.env("eshop_urls").user_profile_nav_menu.my_account);
		cy.get(UserProfile.side_block.wishlist_block).should("contain", product_name);
		cy.visit(Cypress.env("eshop_urls").user_profile_nav_menu.my_wishlist);
		cy.get(UserProfile.wishlist.product_item).should("contain", product_name);
	}

	/**
	 * Clear the wishlist
	 */
	static clearWishlist() {
		cy.log("**clearing wishlist**");
		cy.visit(Cypress.env("eshop_urls").user_profile_nav_menu.my_wishlist);
		cy.get("body").then(($body) => {
			if($body.find("div.products-grid.wishlist").length == 0) {
				return;
			} else {
				cy.get(UserProfile.side_block.wishlist_block).find("div.product-item-info").each(($el) => {
					cy.log(`**removing ${$el.text()} from wishlist**`);
					cy.get(UserProfile.side_block.wishlist_block).find(UserProfile.wishlist.remove_product_button).should("be.visible").first().click();
					cy.get(UIElements.success_message).should("contain", "has been removed from your Wish List.");
				});
			}
		});
	}
}