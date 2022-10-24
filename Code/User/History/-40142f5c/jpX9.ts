import { User } from "../../fixtures/users/user";
import { FilterHandlers } from "../../handlers/admin/FilterHandlers";
import { OrderHandlers } from "../../handlers/admin/OrderHandlers";
import { CartHandlers } from "../../handlers/eshop/CartHandlers";
import { CheckoutHandlers } from "../../handlers/eshop/CheckoutHandlers";
import { ProductHandlers } from "../../handlers/eshop/ProductHandlers";
import { ProductPageHandlers } from "../../handlers/eshop/ProductPageHandlers";
import { Checkout } from "../../locators/eshop/Checkout";
import { Homepage } from "../../locators/eshop/Homepage";

describe(`Create an order`, () => {
    let customer;
    let admin;
    const PRODUCT = `test`;
    let orders = Cypress.env(`urls`).sales.orders;
    let order_id;
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
        cy.get(Homepage.page_title).should(`contain`, PRODUCT);
        ProductPageHandlers.addProductToCart();
        CartHandlers.checkThatProductIsInCart(PRODUCT);
        CartHandlers.proceedToCheckout();
        cy.WaitForEshopToLoad();
        CheckoutHandlers.fillCustomerDetails(customer);
        //Continue the checkout
        cy.get(Checkout.continue_checkout_button).click();
        //PAYMENT METHOD PAGE TESTS -- no tax rules for czechia, hence no tax price twice
        CheckoutHandlers.checkPaymentPage(customer);
        //TODO
        CheckoutHandlers.placeOrder();
        CheckoutHandlers.extractOrderID();
    });

    it(`Checks the order in the admin panel`, () => {
        cy.magentoLogin(admin);
        cy.visit(orders);
        cy.WaitForMagentoToLoad();
        cy.get(`@order_id`).then(id => {
            FilterHandlers.filterByLabelText(`ID`, id.text());
            cy.log(`ORDER ID: ${id}`)
            OrderHandlers.openOrderByOrderId(id.text());
        });
        OrderHandlers.checkOrderStatus(`Pending`);
        OrderHandlers.checkCustomerNotLoggedIn(customer);
        //check that the order has the correct shipping and billing address
        //get the item(s) in the order
        cy.get(`@order_id`).then(id => {
            cy.log(`ORDER ID: ${id}`)
            cy.get(`div#order_item_${parseInt(id.text()) + 1}`).should(`contain`, PRODUCT);
        });
    });
});