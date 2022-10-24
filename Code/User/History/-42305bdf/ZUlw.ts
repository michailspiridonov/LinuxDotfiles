import {
  TAG,
  CommonHandler,
  GeneralLocators,
  CONFIG_CONST,
  ElasticsearchApiHandler
} from 'cypress/index_'

type Category = {
  id: string,
  parent_id: number,
  title: string,
  link_type: string,
  image: string,
  value: string,
  css_class?: string,
  footer_image?: string,
  footer_title?: string,
  footer_text?: string,
  footer_tag?: string,
  footer_link_type?: string,
  footer_link_value?: string,
  items: Category[],
  entity_id: number,
  url_key: string,
  url_path: string,
  slug: string,
  link: string
}

const categories: Category[] = []
const results: { href: string, statusCode: number, isOK: boolean}[] = []

function extractUrl (item: Category): string {
  if (item.url_path) {
    return item.url_path
  }
  if (item.value === 'dynamically') {
    return ''
  }
  return item.value
}

function checkLink (item: Category) {
  return new Promise((resolve, reject) => {
    const url = item.link
    if (!url.includes('files.drmax.pl') || CONFIG_CONST.ENV_TYPE !== 'stage') {
      cy.request({
        url,
        failOnStatusCode: false,
        timeout: 3 * 60 * 1000
      }).then(response => {
        if (!response.isOkStatusCode) {
          const result = {
            href: url,
            statusCode: response.status,
            isOK: response.isOkStatusCode
          }
          results.push(result)
        }
      })
    }
  })
}

if (Cypress.env('environment') !== 'cz_upgrade_stage') {
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
} else {
  it.skip('SKIPPED')
}
