import { checkPaymentPage, fillCustomerDetails } from "../support/order/customer_details";

describe(`Create an order`, () => {
    let customer;
    let admin;
    let order_id: string = `000000009`;
    let price_incl_tax;
    let price_excl_tax;
    let shipping_price;
    const PRODUCT = `test`;
    before(() => {
        //load a customer fixture
        cy.fixture(`users/customer`).then(customerFixture => customer = customerFixture);
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
    });

    it(`Creates an order`, () => {
        cy.visit('/');
        //open the product
        cy.get('a').contains(PRODUCT).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, PRODUCT);
        //save the prices of the product
        cy.get(`span#price-including-tax-product-price-3`).find(`span.price`).then(($price) => {
            price_incl_tax = $price.text();  
        });
        cy.get(`span#price-excluding-tax-product-price-3`).find(`span.price`).then(($price) => {
            price_excl_tax = $price.text();
        });
        //add the product to cart
        cy.get(`button#product-addtocart-button`).click();
        //check success message is displayed
        cy.get(`div.message-success`).should(`contain`, `You added ${PRODUCT} to your`).and(`contain`, `shopping cart`);
        //check that the item is in the cart
        cy.get(`a.showcart`).click();
        cy.get(`strong.product-item-name`).should(`contain`, PRODUCT);
        //check that the item has the correct price
        //including tax
        cy.get(`span.price-including-tax`).should(`contain`, price_incl_tax);
        //excluding tax
        cy.get(`span.price-excluding-tax`).should(`contain`, price_excl_tax);
        //proceed to checkout
        cy.get(`button#top-cart-btn-checkout`).click();
        //wait for the form to load
        cy.get(`div#checkout-loader.loading-mask`).should(`not.exist`);
        //fill the order form
        fillCustomerDetails(customer);
        //get the shipping price
        cy.get(`div#checkout-shipping-method-load`).find(`span.price`).then(($price) => {
            shipping_price = $price.text();
            console.log(shipping_price);
        });
        //Continue the checkout
        cy.get(`button.continue`).click();
        //PAYMENT METHOD PAGE TESTS
        checkPaymentPage(customer, price_incl_tax, price_excl_tax);
        //TODO
        //place order
        cy.get(`button.checkout`).click();
        //check that the title is correct
        cy.get(`h1.page-title`).should(`contain`, `Thank you for your purchase!`);
        //check the continue shopping button
        cy.get(`a.continue`).should(`contain`, `Continue Shopping`);
        //extract the order id
        cy.get(`div.checkout-success`).then(($el) => {
            order_id = $el.text();
        });
    });

    xit(`Checks the order in the admin panel`, () => {
        //login to the admin panel
        cy.visit(`/admin/`);
        cy.get(`input#username`).type(admin.username);
        cy.get(`input#login`).type(admin.password);
        cy.get(`button.action-login`).click();
        //check that the login was successful
        cy.get(`h1.page-title`).should(`contain`, `Dashboard`);
        //hardcoded wait for the admin panel to load
        cy.wait(2000);
        cy.get(`li#menu-magento-sales-sales`).click();
        //open orders
        cy.get(`li.item-sales-order`).click(); 
        //get the order by id
        cy.get(`div.data-grid-cell-content`).contains(order_id).click();
        //check that the order has the correct status
        cy.get(`span#order_status`).should(`contain`, `Pending`);
        //check that the order has the correct customer
        cy.get(`table.order-account-information-table`).should(`contain`, customer.firstName).and(`contain`, customer.lastName);
    });
});