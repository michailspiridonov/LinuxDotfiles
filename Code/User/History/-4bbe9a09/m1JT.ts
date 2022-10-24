import { User } from "../../fixtures/entities/user/user";
import { Checkout } from "../../locators/eshop/Checkout";
import { UIElements } from "../../locators/eshop/UIElements";

export class CheckoutHandlers {

	/**
     * Fills out the customer details form
     * @param {User} customer user fixture
     */
	static fillCustomerDetails(customer: User) {
		cy.log("**filling customer details**");
		//email --- this returns 2 inputs, thats why we use first()
		cy.get(Checkout.customer_email).first().type(customer.email);
		//first name
		this.getInputByLabelText("First Name").type(customer.firstName);
		//last name
		this.getInputByLabelText("Last Name").type(customer.lastName);
		//company
		this.getInputByLabelText("Company").type(customer.company);
		//street address
		this.getInputByLabelText("Street Address: Line 1").type(customer.address.street);
		//country
		this.getInputByLabelText("Country").select(customer.address.country);
		//city
		this.getInputByLabelText("City").type(customer.address.city);
		//zip code
		this.getInputByLabelText("Zip/Postal Code").type(customer.address.zip);
		//phone number
		this.getInputByLabelText("Phone Number").type(customer.phone);
	}

	/**
     * Gets the input/select element by label text
     * @param {string} label text of the label
     * @returns cypress chainable element that is labeled with the text
     */
	static getInputByLabelText(label: string) {
		return cy
			.contains("label", label)
			.should("be.visible")
			.invoke("attr", "for")
			.then((id) => {
				cy.get("#" + id);
			});
	}


	/**
     * Checks the order details
     * @param {User} customer order customer
     */
	static checkPaymentPage(customer: User) {
		cy.log("**checking payment page**");
		//check billing address
		cy.get(Checkout.billing_address_details).then($el => this.checkAddress($el, customer));
		//check shipping address
		cy.get(Checkout.shipping_address_details).then($el => this.checkAddress($el, customer));
		//TODO check shipping method
	}

	static checkLoggedPaymentPage(customer: User) {
		cy.log("**checking payment page**");
		//check selected shipping address
		cy.get(Checkout.selected_shipping_address).then($el => this.checkAddress($el, customer));
	}
	/**
     * Checks the element containing address of the customer
     * @param {JQuery<HTMLElement>} $el element containing address
     * @param {User} customer customer whose address is to be checked
     */
	static checkAddress($element, customer) {
		cy.log("**checking address**");
		cy.wrap($element)
			.should("contain", customer.firstName)
			.and("contain", customer.lastName)
			.and("contain", customer.address.street)
			.and("contain", customer.address.city)
			.and("contain", customer.address.zip)
			.and("contain", customer.address.country)
			.and("contain", customer.phone);
	}

	/**
     * Places the order
     */
	static placeOrder() {
		cy.log("**placing order**");
		cy.get(Checkout.place_order_button).click();
		//check that the title is correct
		cy.get(UIElements.page_title).should("contain", "Thank you for your purchase!");
		//check the continue shopping button
		cy.get(Checkout.continue_shopping_button).should("contain", "Continue Shopping");
	}

	/**
     * Extracts the order id from the order confirmation page and saves it to the local storage
     */
	static extractOrderID(is_logged_in = false) {
		cy.log("**extracting order id**");
		//extract the order id
		if(is_logged_in){
			cy.get(Checkout.logged_order_number).then(($el) => {
			//parsed through int to get rid of leading 0s
				const order_id = parseInt($el.text()).toString();
				localStorage.setItem("order_id", order_id);
			});
		} else {
			cy.get(Checkout.guest_order_number).then(($el) => {
			//parsed through int to get rid of leading 0s
				const order_id = parseInt($el.text()).toString();
				localStorage.setItem("order_id", order_id);
			});
		}
	}
}