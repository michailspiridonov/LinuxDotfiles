export class Product {
	id: number;
	sku: string;
	name: string;
	attribute_set_id: number;
	price: number;
	status: number;
	visibility: number;
	type_id: string;
	created_at: string;
	updated_at: string;
	weight: number;
	extension_attributes: unknown;
	product_links: Array<unknown>;
	options: Array<unknown>;
	media_gallery_entries: Array<unknown>;
	tier_prices: Array<unknown>;
	custom_attributes: Array<{attribute_code: string, value: string}>;

	constructor (id: number, sku: string, name: string, attribute_set_id: number, price: number, status: number, visibility: number, type_id: string, created_at: string, updated_at: string, weight: number, extension_attributes: any, product_links: any, options: any, media_gallery_entries: any, tier_prices: any, custom_attributes: any) {
		this.id = id;
		this.sku = sku;
		this.name = name;
		this.attribute_set_id = attribute_set_id;
		this.price = price;
		this.status = status;
		this.visibility = visibility;
		this.type_id = type_id;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.weight = weight;
		this.extension_attributes = extension_attributes;
		this.product_links = product_links;
		this.options = options;
		this.media_gallery_entries = media_gallery_entries;
		this.tier_prices = tier_prices;
		this.custom_attributes = custom_attributes;
	}
	
	/**
	 * Get a price range to search based on the product price
	 * @returns {number[]} price range min and max
	 */
	getPriceRange() {
		cy.log("**getting price range**");
		const price_min = this.price - (this.price * 0.1);
		const price_max = this.price + (this.price * 0.1);
		return [price_min, price_max];
	}
}