import { createYield } from 'typescript';
import {
  LoginScreenLocators
} from '../index';
describe("Create new user", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/auth/realms/eurodata");
  });

  it("creates a new user", () => {
    cy.get(LoginScreenLocators.registerBtn).click();
    cy.get(LoginScreenLocators.registation.launguageSelect).click();
    cy.get(LoginScreenLocators.languages.english).click();
    cy.get(LoginScreenLocators.registation.personalTitle).click();
    cy.get(LoginScreenLocators.registation.titles.mr).click();
    cy.get(LoginScreenLocators.registation.firstName).type("John");
    cy.get(LoginScreenLocators.registation.lastName).type("Doe");
    cy.get(LoginScreenLocators.registation.primaryEmail).type(Cypress.env("ATemail"));
    cy.get(LoginScreenLocators.registation.emailRadioSelect).click();
    cy.get(LoginScreenLocators.registation.verificationEmail).type('johndoe@example.com');
    cy.get(LoginScreenLocators.registation.submitBtn).click();
    // cy.pause();
    cy.origin(Cypress.env('ATemailURL'), () => {
      cy.visit('/');
      cy.wait(7000);
      cy.get('#didomi-notice-agree-button').click();
      cy.get('[name="ego_user"]').type('compacerautomatedtesting@centrum.cz');
      cy.get('[name="ego_secret"]').type('automatedTesting1');
      cy.get('#ego_submit').click();
      //fetch the email
      cy.wait(10000);
      cy.get('div.list-sender').contains('onboarding@capitain-io-demo.compacer.net').eq(0).click();
    });
  });
});