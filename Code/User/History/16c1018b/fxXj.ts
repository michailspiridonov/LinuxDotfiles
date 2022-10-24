import { fillCustomerDetails } from "../support/order/customer_details";

describe(`Create an order`, () => {
    let user;
    let admin;
    let order_id: string = `000000009`;
    before(() => {
        //load a user fixture
        cy.fixture(`users/customer`).then(userFixture => user = userFixture);
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
    });

    xit(`Creates an order`, () => {
        cy.visit('/');
        //open `test` product
        cy.get('a').contains(`test`).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, `test`);
        //add the product to cart
        cy.get(`button#product-addtocart-button`).click();
        //check success message is displayed
        cy.get(`div.message-success`).should(`contain`, `You added test to your`).and(`contain`, `shopping cart`);
        //check that the item is in the cart
        cy.get(`a.showcart`).click();
        cy.get(`strong.product-item-name`).should(`contain`, `test`);
        //check that the item has the correct price
        cy.get(`span.minicart-price`).should(`contain`, `$50.00`);
        //proceed to checkout
        cy.get(`button#top-cart-btn-checkout`).click();
        //wait for the form to load
        cy.get(`div#checkout-loader.loading-mask`).should(`not.exist`);
        //fill the order form
        fillCustomerDetails(user);
        //Continue the checkout
        cy.get(`button.continue`).click();
        //PAYMENT METHOD PAGE TESTS
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

    it(`Checks the order in the admin panel`, () => {
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
        cy.get(`table.order-account-information-table`).should(`contain`, user.firstName).and(`contain`, user.lastName);
    });
});