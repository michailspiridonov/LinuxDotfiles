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
    cy.pause();
    cy.origin(Cypress.env('ATemailURL'), () => {
      cy.visit('/');
      cy.wait(7000);
      cy.get('#didomi-notice-agree-button').click();
      cy.get('[name="ego_user"]').type('compacerautomatedtesting@centrum.cz');
      cy.get('[name="ego_secret"]').type('automatedTesting1');
      cy.get('#ego_submit').click();
    });
  });
});