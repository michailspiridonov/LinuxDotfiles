import { MegamenuCategoryDto } from 'cypress/fixtures/api_templates/elasticsearch_request_templates'
import {
  TAG,
  CommonHandler,
  GeneralLocators,
  CONFIG_CONST,
  ElasticsearchApiHandler,
  requestResult
} from 'cypress/index_'

let categories: MegamenuCategoryDto[] = []
const results: requestResult[] = []

function checkLink (item: MegamenuCategoryDto) {
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
            response
          }
          results.push(result)
        }
      })
    }
  })
}

function checkOpenMegamenu () : any {
  cy.getLocScroll('.smart-menu__top > .header__hamburger > :nth-child(2)').should('be.visible')
  cy.getLocScroll('#smart-menu > div.smart-menu__top > a.header__logo').should('be.visible')
  cy.getLocScroll(GeneralLocators.megamenu.L1_items).should('be.visible')
  cy.getLocScroll(GeneralLocators.megamenu.L2_items).should('be.visible')
  cy.getLocScroll('#smart-menu > ul > li.contacts__text').should('be.visible')
  cy.getLocScroll('#smart-menu > ul > li:nth-child(2) > a').should('be.visible')
  cy.getLocScroll('#smart-menu > ul > li:nth-child(3) > a').should('be.visible')
}

describe('Homepage', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it('5612 - L1 links leads to existing pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
    cy.getLocScroll(GeneralLocators.megamenu.locator).click()
    CommonHandler.waitForFullLoad()
    cy.getLocScroll(GeneralLocators.megamenu.L1_items).should('be.visible')
    cy.getLocScroll(GeneralLocators.megamenu.L1_items).each(item => {
      const href = item.children('a').first().attr('href')
      cy.wrap(item.children('a')).should('not.be.disabled')
      cy.request(href).then(response => { expect(response.status).lessThan(400) })
    })
  })

  if (['ed', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
    it('5614 - L2 links lead to existing category pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
      cy.getLocScroll(GeneralLocators.megamenu.locator).click()
      cy.getLocScroll(GeneralLocators.megamenu.navigate_eshop).click()
      cy.getLocScroll(GeneralLocators.megamenu.L2_items).each(item => {
      // If the megamenu item is not expandable
        if (item.children('span').length === 0) {
          const href = item.children('a').first().attr('href')
          cy.request(href).then(response => expect(response.status).lessThan(400))
          return ''
        }
      })
    })
  }

  if (!['ed', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
    it('14217 - Check megamenu links', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2], retries: 0 }, () => {
      ElasticsearchApiHandler.getMegamenuItems().then(res => {
        let itemArray: MegamenuCategoryDto[] = (res.body.hits.hits).reduce((a: MegamenuCategoryDto[], e: any) => [...a, ...e._source.items], [])
        // Extract urls from the categories
        while (itemArray.length) {
          const item: MegamenuCategoryDto = itemArray.pop()
          item.link = ElasticsearchApiHandler.getMegamenuCategoryUrl(item)
          // if the item is not expandable and has defined link
          if (!item.items.length && item.link) {
            categories.push(item)
          } else {
            itemArray = itemArray.concat(item.items)
          }
        }
      }).then(() => {
        categories = Cypress._.uniqBy(categories, 'link')
        Promise.all(categories.map(category => {
          checkLink(category)
          return ''
        }))
      }).then(() => {
        const failedResults = results.filter(res => !res.isOK)
        const failedHrefMessage = failedResults.map(result => { return result.response.status + ' ' + result.href }).join('\n')
        expect(failedResults).to.have.length(0, `failedHrefMessage:\n${failedHrefMessage}\n\n`)
      })
    })
  }

  it.only('14505 - Check megamenu functionality on mobile viewport', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
    let categoryName = ''
    cy.getLocScroll(GeneralLocators.megamenu.locator).click()
    checkOpenMegamenu()
    // Open first expandable L2 item
    cy.getLocScroll(GeneralLocators.megamenu.L2_items).each(item => {
      if (item.children('span').length > 0) {
        categoryName = item.children('a').first().text().trim()
        cy.wrap(item).click()
        // Check if the L2 item is expanded
        // Check subcategories are visible
        cy.getLocScroll(GeneralLocators.megamenu.L2_items).should('be.visible')
        // Check the category title is visible
        cy.getLocScroll('.main-option__text > h3').contains(categoryName).should('be.visible')
        // Check the back button is visible
        cy.getLocScroll('#smart-menu > nav > div > div.main-option__nav > button').should('be.visible')
        return false
      }
    })
    // Go back to main menu
    cy.getLocScroll('#smart-menu > nav > div > div.main-option__nav > button').click()
    // Check if the L2 item is collapsed
    checkOpenMegamenu()
    // Close megamenu
    cy.getLocScroll('.smart-menu__top > .header__hamburger > :nth-child(2)').click()
    // Check if the megamenu is closed
    cy.getLocScroll(GeneralLocators.megamenu.L2_items).should('not.be.visible')
  })
})
