import { Product } from "../../fixtures/entities/misc/Product";

export class AdminProductApiHandlers {
	/**
	 * Retrieves list of all products
	 */
	static getAllProducts() {
		cy.log("**retrieving list of all products**");
		return cy.request({
			method: "GET",
			url: "/rest/default/V1/products",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			auth: {
				bearer: Cypress.env("admin").token
			},
			qs: {
				searchCriteria: ""
			}
		}).then(response => {
			const products: Product[] = [];
			response.body.items.forEach(product => {
				const product_obj = new Product(
					product.id,
					product.sku,
					product.name,
					product.attribute_set_id,
					product.price,
					product.status,
					product.visibility,
					product.type_id,
					product.created_at,
					product.updated_at,
					product.weight,
					product.extension_attributes,
					product.product_links,
					product.options,
					product.media_gallery_entries,
					product.tier_prices,
					product.custom_attributes
				);
				products.push(product_obj);
			});
			console.log(products);
		});
	}

	/**
	 * Gets a random product from an array of products
	 * @param {Product[]} products array of products
	 * @returns {Product} random product from the array
	 */
	static getRandomProduct(products: Product[]) {
		cy.log("**getting random product**");
		return Cypress._.sample(products);
	}
}