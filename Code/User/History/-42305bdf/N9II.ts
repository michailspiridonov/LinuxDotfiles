import { MegamenuESRequestBuilder } from 'cypress/helpers/elastic_search/megamenu_es_request_bulder'
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
  slug: string
}

const links: string[] = []
const categories: Category[] = []
const results: { href: string, statusCode: number, isOK: boolean, category_title: any }[] = []

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

function extractUrl (item: Category): string {
  let url = item.value
  if (url === 'dynamically') {
    url = item.url_path
  }
  return url
}

function checkLink (item: Category) {
  return new Promise((resolve, reject) => {
    const url = extractUrl(item)
    cy.request({
      url,
      failOnStatusCode: false,
      timeout: 180000
    }).then(response => {
      if (response.status >= 400) {
        const result = {
          href: url,
          statusCode: response.status,
          isOK: response.isOkStatusCode,
          category_title: item.title
        }
        results.push(result)
      }
    })
  })
}

describe('Homepage', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  xit('5612 - L1 links leads to existing pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
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

  xit('5614 - L2 links lead to existing category pages', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
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

  if (!['ed', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
    it('Megamenu links request test', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2], retries: 0 }, () => {
      ElasticsearchApiHandler.getMegamenuItems().then(res => {
        const flattener = arr => arr._source.items.flat()
        const hitsLength = (res.body.hits.hits).length
        let itemArray: Category[] = flattener(res.body.hits.hits).then(() => console.log(itemArray))
        // Extract all megamenu categories into an array
        // for (let i = 0; i < hitsLength; i++) {
        //   itemArray = itemArray.concat(res.body.hits.hits[i]._source.items)
        // }
        // Extract urls from the categories
        while (itemArray.length) {
          const item: Category = itemArray.pop()
          const link = extractUrl(item)
          if (!item.items.length && !links.includes(link)) {
            links.push(link)
            categories.push(item)
          } else {
            itemArray = itemArray.concat(item.items)
          }
        }
      }).then(() => {
        Promise.all(categories.map(category => {
        // checks that url is valid (defined, non null)
          if (extractUrl(category)) {
            checkLink(category)
          }
          return ''
        }))
      }).then(() => {
        const failedResults = results.filter(res => !res.isOK)
        const failedHrefMessage = failedResults.map(href => { return `Category: ${href.category_title} \n` + href.statusCode + ' ' + href.href }).join('\n')
        expect(failedResults).to.have.length(0, `failedHrefMessage:\n${failedHrefMessage}\n\n`)
      })
    })
  }
})
