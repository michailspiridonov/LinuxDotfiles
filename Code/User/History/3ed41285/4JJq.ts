describe(`Create an order with logged in user`, () => {
    let customer;
    let admin;
    let order_id: string = `000000010`;
    let price_incl_tax;
    let price_excl_tax;
    let shipping_price;
    const PRODUCT = `test`;
    before(() => {
        //load a customer fixture
        cy.fixture(`users/user_customer`).then(customerFixture => customer = customerFixture);
        //load admin user fixture
        cy.fixture(`users/admin`).then(adminFixture => admin = adminFixture);
        //site throws an uncaught exception
        //this block prevents test fail
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        })
        //get product prices
        cy.visit(`/`);
        cy.get('a').contains(PRODUCT).click();
        //including tax
        cy.get(`span#price-including-tax-product-price-3`).find(`span.price`).then(($price) => {
            price_incl_tax = $price.text();
        });
        //excluding tax
        cy.get(`span#price-excluding-tax-product-price-3`).find(`span.price`).then(($price) => {
            price_excl_tax = $price.text();
        });
    });

    it(`Creates an order`, () => {
        cy.visit('/');
        //login
        cy.get(`li.authorization-link`).click();
        cy.get(`input#email`).type(customer.email);
        cy.get(`input#pass`).first().type(customer.password);
        cy.get(`button#send2`).first().click();
        //check the welcome message
        cy.get(`span.logged-in`).should(`contain`, `Welcome, ${customer.firstname} ${customer.lastname}`);
        //open the product
        cy.get('a').contains(PRODUCT).click();
        //check that the product has opened
        cy.get(`h1.page-title`).should(`contain`, PRODUCT);
        //add the product to cart
        cy.get(`button#product-addtocart-button`).click();
        //check success message is displayed
        cy.get(`div.message-success`).should(`contain`, `You added ${PRODUCT} to your`).and(`contain`, `shopping cart`);
        //check that the item is in the
    });
});