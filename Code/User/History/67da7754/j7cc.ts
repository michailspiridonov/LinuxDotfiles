export class Checkout {
	public static readonly customer_email = "input#customer-email";
	public static readonly continue_checkout_button = "button[data-role=\"opc-continue\"]";
	public static readonly billing_address_details = "div.billing-address-details";
	public static readonly shipping_address_details = "div.shipping-information-content";
	public static readonly place_order_button = "button[title=\"Place Order\"]";
	public static readonly continue_shopping_button = "a.continue";
	public static readonly selected_shipping_address = "div.shipping-address-item.selected-item";
	public static readonly logged_order_number = ".order-number > strong";
	public static readonly guest_order_number = "div.checkout-success > p > span";
}