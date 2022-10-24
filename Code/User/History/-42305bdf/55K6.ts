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

let categories: Category[] = []
const results: { href: string, statusCode: number, isOK: boolean}[] = []

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
  // let url = item.value
  // if (url === 'dynamically') {
  //   url = item.url_path
  // }
  if (item.url_path) {
    return item.url_path
  }
  return item.value
}

function checkLink (item: Category) {
  return new Promise((resolve, reject) => {
    const url = item.link
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
        let itemArray: Category[] = (res.body.hits.hits).reduce((a, e) => [...a, ...e._source.items], [])
        // Extract urls from the categories
        while (itemArray.length) {
          const item: Category = itemArray.pop()
          item.link = extractUrl(item)
          // if the item is not expandable and has defined link
          if (!item.items.length && item.link) {
            categories.push(item)
          } else {
            itemArray = itemArray.concat(item.items)
          }
        }
      }).then(() => {
        categories = Cypress._.uniqBy(categories, 'link')
        console.log(categories.length)
        Promise.all(categories.map(category => {
          checkLink(category)
          return ''
        }))
      }).then(() => {
        const failedHrefMessage = results.map(href => { return href.statusCode + ' ' + href.href }).join('\n')
        expect(results).to.have.length(0, `failedHrefMessage:\n${failedHrefMessage}\n\n`)
      })
    })
  }
})
