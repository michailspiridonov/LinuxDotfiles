import { CommonHandler, AdminLocators, CONFIG_CONST } from 'cypress/index_'

export class AdminCommonHandler {
  static login (username = CONFIG_CONST.DATA.admin.login, password = CONFIG_CONST.DATA.admin.pass): void {
    cy.getLocScroll(AdminLocators.login).clear().type(username)
    cy.getLocScroll(AdminLocators.password).clear().type(password)
    cy.getLocScroll(AdminLocators.login_button).click()
    CommonHandler.waitForFullLoad()
  }

  static logout () {
    cy.getLocScroll('.admin-user .admin__action-dropdown').click()
    cy.getLocScroll('.admin-user .account-signout').click()
  }

  static goToSection (panel: string, section: string): void {
    cy.getLocScroll(panel).trigger('mouseover').click()
    cy.getLocScroll(AdminLocators.active_panel).should('be.visible')
    cy.getLocScroll(section).click()
    this.waitForSpinner()
  }

  static filterDatagridValue (fieldName: string, fieldValue: string): void {
    cy.scrollTo('top', { ensureScrollable: false })
    cy.getLocScroll(`input[name="${fieldName}"]`).clear().type(fieldValue).should('have.value', fieldValue)
  }

  static openFilters (): void {
    cy.getLocScroll(AdminLocators.datagrid.filter.locator).eq(0).click({ force: true })
  }

  static applyFilters (): void {
    cy.getLocScroll(AdminLocators.datagrid.filter.apply).click()
    this.waitForSpinner2()
  }

  static clearAllFiltering (): void {
    cy.getLocScroll('body').then(($body) => {
      if ($body.find(AdminLocators.datagrid.filter.reset).length > 0) {
        // evaluates as true
        cy.getLocScroll(AdminLocators.datagrid.filter.reset).eq(0).click({ force: true })
        this.waitForSpinner()
      }
    })
  }

  static extractNumberOfRecordsFound (): Cypress.Chainable<Number> {
    return cy
      .get('.admin__control-support-text')
      .contains(' records found')
      .invoke('text')
      .then((text) => {
        return parseInt(String(text))
      })
  }

  static waitForSpinner (): void {
    CommonHandler.waitForFullLoad()
    cy.getLocScroll('body').then(body => {
      if (body.find(AdminLocators.datagrid.spinner).length > 0) {
        cy.getLocScroll(AdminLocators.datagrid.spinner, { timeout: 60000 }).should('not.be.visible')
      }
    })
  }

  static waitForSpinner2 (): void {
    cy.waitUntil(() => cy.get('body').then($body => $body.find(AdminLocators.datagrid.spinner).length === 0))
  }

  static wrapNumberOfRecords (): Cypress.Chainable<number> {
    return cy.contains('span', 'records found')
      .parent()
      .invoke('text')
      .then(($text) => {
        return Number($text.replace(' records found', ''))
      })
  }

  static selectMulticheckAction (multicheckAction: string) {
    cy.get(AdminLocators.datagrid.table.header.multicheck.dropdown).click()
    cy.get(AdminLocators.datagrid.table.header.multicheck.option).contains(multicheckAction).click()
  }

  static selectAction (action: string) {
    cy.get(AdminLocators.datagrid.table.header.actions.dropdown).click()
    cy.get(AdminLocators.datagrid.table.header.actions.option).contains(action).click()
  }
}
