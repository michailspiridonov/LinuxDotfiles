# Cypress tests for quanti magento instance
Cypress tests testing basic funcionality of some features of magento eshop
## Installation
Depends on [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).
Clone the repository to your local machine, run:
```
npm install
```
## Running tests
To run the tests from cypress gui run:
```
npm run cypress:open
```
To run the tests from command line run:
```
npm run cypress:run
```
# Test cases
## Orders
Tests order creation.
### Create guest order
Selects any product and creates an order while logged out, checks if the order is created.
### Create registered order
Selects any product and creates an order while logged in, checks if the order is created.
## Reviews
Tests review creation and deletion.
### Create guest review
Selects any product and creates a review while logged out, checks if the review is created.
### Create registered review
Selects any product and creates a review while logged in, checks if the review is created.
## Users
Tests account creation process, user profile editing, login functionality.
### Create a user account
Creates the user account, confirms it and checks it was created successfully.
## Wishlist
Tests adding procucts to the wishlist, removing them, wishlist display in the user profile.
### Add product to wishlist while logged out
Selects any product and adds it to the wishlist while logged out, checks if the product was added.
### Add product to wishlist while logged in
Selects any product and adds it to the wishlist while logged in, checks if the product was added.
## Search
Tests functionality of basic page search and advanced search.
### Search for product using basic search
Searches for any product using basic search, checks if the product was found.
### Search for product using advanced search
Searches for any product using advanced search by different product parameters extracted from admin page, checks if the product was found.
#### Search for product using advanced search by name
#### Search for product using advanced search by SKU
#### Search for product using advanced search by description
#### Search for product using advanced search by short description
#### Search for product using advanced search by price range