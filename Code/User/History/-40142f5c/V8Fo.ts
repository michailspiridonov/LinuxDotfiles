import { User } from "../../fixtures/users/user";
import { CartHandlers } from "../../handlers/eshop/CartHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
import { Homepage } from "../../locators/eshop/Homepage";
import { checkAddress, checkPaymentPage, fillCustomerDetails } from "../../support/order/customer_details";

describe(`Create an order`, () => {
    let customer;
    let admin;
    let order_id: string = `000000010`;
    const PRODUCT = `test`;
    before(() => {
        //set customer
        customer = User.getRandomUser();
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
        ProductHandlers.openProductPage(PRODUCT);
        //check that the product has opened
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
        //add the product to cart
        ProductPageHandlers.addProductToCart();
        //check that the item is in the cart
        CartHandlers.checkThatProductIsInCart(PRODUCT);
        CartHandlers.proceedToCheckout();
        //wait for the form to load
        cy.WaitForEshopToLoad();
        //fill the order form  
        fillCustomerDetails(customer);
        //Continue the checkout
        cy.get(`button.continue`).click();
        //PAYMENT METHOD PAGE TESTS -- no tax rules for czechia, hence no tax price twice
        checkPaymentPage(customer);
        //TODO
        //place order
        cy.get(`button.checkout`).click();
        //check that the title is correct
        cy.get(`h1.page-title`).should(`contain`, `Thank you for your purchase!`);
        //check the continue shopping button
        cy.get(`a.continue`).should(`contain`, `Continue Shopping`);
        //extract the order id
        cy.get(`div.checkout-success > p > span`).then(($el) => {
            order_id = $el.text();
        });
    });

    it(`Checks the order in the admin panel`, () => {
        cy.magentoLogin(admin);
        cy.get(`li#menu-magento-sales-sales`).should(`be.visible`).click();
        //open orders
        cy.get(`li.item-sales-order`).should(`be.visible`).click();
        cy.WaitForMagentoToLoad();
        //get the order by id
        cy.get(`div.data-grid-cell-content`).contains(order_id).click();
        //check that the order has the correct status
        cy.get(`span#order_status`).should(`contain`, `Pending`);
        //check that the order has the correct customer
        cy.get(`table.order-account-information-table`)
            .should(`contain`, customer.firstName)
            .and(`contain`, customer.lastName)
            .and(`contain`, customer.email)
            .and(`contain`, `NOT LOGGED IN`);
        //check that the order has the correct shipping and billing address
        cy.get(`div.order-billing-address`).find(`address.admin__page-section-item-content`).then($el => checkAddress($el, customer));
        cy.get(`div.order-shipping-address`).find(`address.admin__page-section-item-content`).then($el => checkAddress($el, customer));
        //get the item(s) in the order
        cy.get(`div#order_item_${parseInt(order_id)+1}`).should(`contain`, PRODUCT);
    });
});