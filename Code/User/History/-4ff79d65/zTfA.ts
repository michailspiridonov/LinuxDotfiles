export const AdminNavMenu = {
	dashboard: "li#menu-magento-backend-dashboard",
	sales: "li#menu-magento-sales-sales",
	catalog: "li#menu-magento-catalog-catalog",
	customers: "li#menu-magento-customer-customer",
	marketing: "li#menu-magento-backend-marketing",
	content: "li#menu-magento-backend-content",
	reports: "li#menu-magento-reports-report",
	stores: "li#menu-magento-backend-stores",
	system: "li#menu-magento-backend-system",
	//catalog
	catalog_submenu: {
		catalog_products: "li.item-catalog-products",
		catalog_categories: "li.item-catalog-categories"
	},
	//customers
	customers_submenu: {
		all_customers: "li.item-customer-manage",
		online_customers: "li.item-customer-online",
		login_as_customer_login: "li.item-login-log",
		customer_groups: "li.item-customer-group"
	},
	//marketing
	marketing_submenu: {
		promotions: {
			catalog_price_rule: "li.item-promo-catalog",
			cart_price_rule: "li.item-promo-quote",
		},
		communications: {
			email_templates: "li.item-template",
			newsletter_templates: "li.item-newsletter-template",
			newsletter_queue: "li.item-newsletter-queue",
			newsletter_subscribers: "li.item-newsletter-subscriber"
		},
		seo_and_search: {
			url_rewrites: "li.item-urlrewrite",
			search_terms: "li.item-search-terms",
			search_synonyms: "li.item-search-synonyms",
			site_map: "li.item-catalog-sitemap"
		},
		user_content: {
			all_reviews: "li.item-catalog-reviews-ratings-reviews-all",
			pending_reviews: "li.item-catalog-reviews-ratings-pending",
			yotpo_reviews: "li.item-yotpo-report-reviews"
		}
	}
};