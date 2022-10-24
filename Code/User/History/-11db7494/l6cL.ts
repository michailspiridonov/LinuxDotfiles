import {
  TAG,
  CommonHandler,
  GeneralLocators,
  CONFIG_CONST,
} from 'cypress/index_'

function checkMegamenuItemRedirectsCorrectly (item: JQuery<HTMLElement>, children: string) {
  const uri = item.children('a').first().attr('href')
  if (item.children('button').length > 0) {
    cy.wrap(item).children('button').realHover().click()
    cy.wrap(item).children(children).children().first().click()
  } else {
    cy.wrap(item).realHover().click()
  }
  CommonHandler.waitForFullLoad()
  cy.url().should('contain', uri)
}

describe('Homepage', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })
  // Bug 9273: L1 category on PL/ED prod/stage have clickable expand arrow yet nothing expands https://dev.azure.com/drmaxglobal/content-team/_workitems/edit/9273
  it('5612 - L1 links leads to existing pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
    cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
    cy.getLocScroll(GeneralLocators.megamenu.L1_items).each(item => {
      const href = item.children('a').first().attr('href')
      cy.request(href).then(response => { expect(response.status).lessThan(400) })
    })
    cy.getLocScroll(GeneralLocators.megamenu.L1_items).then(items => {
      const itemsLength = items.length
      for (let index = 0; index < itemsLength; index++) {
        cy.visit(CONFIG_CONST.HOMEPAGE_URL)
        CommonHandler.waitForFullLoad()
        cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
        CommonHandler.waitForFullLoad()
        cy.getLocScroll(`#navigation-item-${index}`).then(item => {
          checkMegamenuItemRedirectsCorrectly(item, GeneralLocators.hamburger_menu.navigate_L1_collapsable)
        })
      }
    })
  })

  it('5614 - L2 links lead to existing category pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
    cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
    cy.getLocScroll(GeneralLocators.hamburger_menu.navigate_eshop).click()
    cy.getLocScroll(GeneralLocators.megamenu.L2_items).each(item => {
      const href = item.children('a').first().attr('href')
      cy.request(href).then(response => { expect(response.status).lessThan(400) })
    })
    cy.getLocScroll(GeneralLocators.megamenu.L2_items).then(items => {
      const itemsLength = items.length
      for (let index = 0; index < itemsLength; index++) {
        cy.visit(CONFIG_CONST.HOMEPAGE_URL)
        CommonHandler.waitForFullLoad()
        cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
        cy.getLocScroll(GeneralLocators.hamburger_menu.navigate_eshop).click()
        cy.getLocScroll(GeneralLocators.megamenu.L2_items).eq(index).then(item => {
          checkMegamenuItemRedirectsCorrectly(item, GeneralLocators.hamburger_menu.navigate_all_products)
        })
      }
    })
  })
})
