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
        cy.visit(orders).then(() => {
            for(var i = 0; i < localStorage.length; i++){
                cy.log(`LOCAL STORAGE ITEMS\n`);
                cy.log(`====================\n`);
                cy.log(localStorage.getItem(localStorage.key(i)));
                cy.log(`====================\n`);
            }
        });
        cy.WaitForMagentoToLoad();
        FilterHandlers.filterByLabelText(`ID`, window.localStorage.getItem('order_id'));
        OrderHandlers.openOrderByOrderId(window.localStorage.getItem('order_id'));
        OrderHandlers.checkOrderStatus(`Pending`);
        OrderHandlers.checkCustomerNotLoggedIn(customer);
        //check that the order has the correct shipping and billing address
        cy.get(`div#order_item_${parseInt(window.localStorage.getItem(`order_id`)) + 1}`).should(`contain`, PRODUCT);
    });
});