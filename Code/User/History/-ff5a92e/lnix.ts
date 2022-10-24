import { User } from "../../fixtures/users/user";
import { Homepage } from "../../locators/eshop/Homepage";
import { UIElements } from "../../locators/eshop/UIElements";
import { UserRegistrationForm } from "../../locators/eshop/UserRegistrationForm";

export class UserHandlers {
    static createUserAccount(user: User): void {
        //open the user registration page
        cy.get(Homepage.createAccountLink).click();
        //check title
        cy.get(Homepage.page_title).should(`contain`, `Create New user Account`);
        //fill the registration form
        cy.get(UserRegistrationForm.first_name).type(user.firstName);
        cy.get(UserRegistrationForm.last_name).type(user.lastName);
        cy.get(UserRegistrationForm.email).type(user.email);
        cy.get(UserRegistrationForm.password).type(user.password);
        cy.get(UserRegistrationForm.confirm_password).type(user.password);
        //create the account
        cy.get(UserRegistrationForm.register_button).click();
        //check success message
        cy.get(UIElements.success_message).should(`contain`, `You must confirm your account. Please check your email for the confirmation link`);
    }
}