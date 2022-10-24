import {
  GeneralLocators,
  CommonHandler
} from 'cypress/index_'

export class GeneralHandler {
  static typeToFulltextBar (query: string): void {
    cy.getLoc(GeneralLocators.fulltext.search_input).type(query, { scrollBehavior: 'center' }).should('have.value', query)
    CommonHandler.waitForFullLoad()
    cy.getLoc(GeneralLocators.fulltext.search_popup).should('exist')
  }

  static searchFulltext (query: string): void {
    this.typeToFulltextBar(query)
    cy.getLoc(GeneralLocators.fulltext.search_input).type('{Enter}', { scrollBehavior: 'center' })
    CommonHandler.waitForFullLoad()
  }

  static goToUserLogin (): void {
    cy.getLocScroll(GeneralLocators.megamenu.locator).click()
    CommonHandler.waitForFullLoad()
    cy.getLocScroll(GeneralLocators.login).click()
  }

  static checkProductSearchResult (product: string): void {
    cy.getLocScroll(GeneralLocators.fulltext.results).should('be.visible').contains(product, { matchCase: false })
  }
}
