import { MegamenuCategoryDto } from 'cypress/fixtures/api_templates/elasticsearch_request_templates'
import {
  TAG,
  CommonHandler,
  GeneralLocators,
  CONFIG_CONST,
  ElasticsearchApiHandler
} from 'cypress/index_'

let categories: MegamenuCategoryDto[] = []
const results: { href: string, statusCode: number, isOK: boolean }[] = []

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
            statusCode: response.status,
            isOK: response.isOkStatusCode
          }
          results.push(result)
        }
      })
    }
  })
}

describe('Homepage', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  xit('5612 - L1 links leads to existing pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
    cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
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
      cy.getLocScroll(GeneralLocators.hamburger_menu.locator).click()
      cy.getLocScroll(GeneralLocators.hamburger_menu.navigate_eshop).click()
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
    it('Megamenu links request test', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2], retries: 0 }, () => {
      // const ESUrl = getMegamenuRequestUrl()
      ElasticsearchApiHandler.getMegamenuItems().then(res => {
        const hitsLength = (res.body.hits.hits).length
        let itemArray: MegamenuCategoryDto[] = []
        // Extract all megamenu categories into an array
        for (let i = 0; i < hitsLength; i++) {
          itemArray = itemArray.concat(res.body.hits.hits[i]._source.items)
        }
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
        const failedHrefMessage = failedResults.map(href => { return href.statusCode + ' ' + href.href }).join('\n')
        expect(failedResults).to.have.length(0, `failedHrefMessage:\n${failedHrefMessage}\n\n`)
      })
    })
  }
})
