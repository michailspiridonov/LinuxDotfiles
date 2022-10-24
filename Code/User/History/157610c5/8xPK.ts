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
	product_links: unknown = [];
	options: unknown = [];
	media_gallery_entries: unknown = [];
	tier_prices: unknown = [];
	custom_attributes: unknown = [];

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
}