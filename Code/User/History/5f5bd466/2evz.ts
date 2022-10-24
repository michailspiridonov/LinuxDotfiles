import { createJSDocTypeExpression } from 'typescript';
import {
  LoginScreenLocators,
  randomString
} from '../index';

class reglink {
  public link: string;
}

describe("Create new user", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.url().should("include", "/auth/realms/eurodata");
  });

  it("creates a new user", () => {
    let link = new reglink();
    cy.get(LoginScreenLocators.registerBtn).click();
    cy.get(LoginScreenLocators.registation.launguageSelect).click();
    cy.get(LoginScreenLocators.languages.english).click();
    cy.get(LoginScreenLocators.registation.personalTitle).click();
    cy.get(LoginScreenLocators.registation.titles.mr).click();
    cy.get(LoginScreenLocators.registation.firstName).type("John");
    cy.get(LoginScreenLocators.registation.lastName).type("Doe");
    cy.get(LoginScreenLocators.registation.primaryEmail).type(Cypress.env("ATemailName") + '+' + randomString + '@' + Cypress.env("ATemailDomain"));
    cy.get(LoginScreenLocators.registation.emailRadioSelect).click();
    cy.get(LoginScreenLocators.registation.verificationEmail).type('johndoe@example.com');
    cy.get(LoginScreenLocators.registation.submitBtn).click();
    // cy.pause();
    cy.origin(Cypress.env('ATemailURL'), { args: { link } }, ({ link }) => {
      cy.visit('/');
      cy.get('input#identifierId').type('compacerautomatedtesting@gmail.com');
      cy.get('[name="ego_secret"]').type('automatedTesting1');
      cy.get('#ego_submit').click();
      //fetch the email
      cy.wait(10000);
      cy.get('div.list-sender').contains('onboarding@capitain-io-demo.compacer.net').eq(0).click();
      cy.get('.button > tbody > tr > td').find('a').invoke('attr', 'href').then(($href) => {
        console.log(link);
        link.link = $href;
      });
    });
    cy.visit(link.link);
  });
});