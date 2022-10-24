export class NavMenu {
    public static readonly dashboard = `li#menu-magento-backend-dashboard`;
    public static readonly sales = `li#menu-magento-sales-sales`;
    public static readonly catalog = `li#menu-magento-catalog-catalog`;
    public static readonly customers = `li#menu-magento-customer-customer`;
    public static readonly marketing = `li#menu-magento-backend-marketing`;
    public static readonly content = `li#menu-magento-backend-content`;
    public static readonly reports = `li#menu-magento-reports-report`;
    public static readonly stores = `li#menu-magento-backend-stores`;
    public static readonly system = `li#menu-magento-backend-system`;
    //catalog
    public static readonly catalog_submenu = {
        catalog_products: `li.item-catalog-products`,
        catalog_categories: `li.item-catalog-categories`
    }
    //customers
    public static readonly customers_submenu = {
        all_customers: `li.item-customer-manage`,
        online_customers: `li.item-customer-online`,
        login_as_customer_login: `li.item-login-log`,
        customer_groups: `li.item-customer-group`
    }
}