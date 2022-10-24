import { TAG, CONFIG_CONST, CommonHandler, HomepageLocators } from 'cypress/index'

describe('Footer legal info', () => {
  it('5725 - Check Legal info in footer', { tags: [] }, () => {
    const toVisit = [CONFIG_CONST.DATA.url.homepage]
    const url = toVisit.shift()

    cy.visit(url)
    CommonHandler.waitForFullLoad()

    cy.getLoc(HomepageLocators.mainpage_elements.footer_links_item).each((footerElement) => {
      cy.wrap(footerElement).realHover().click()
    })
    cy.getLoc(HomepageLocators.mainpage_elements.footer_links).within(() => {
      cy.get('a')
        .then((links) => {
          const localUrls = links
            .toArray()
            .map((link) => link.getAttribute('href'))
            .filter((url) => !url.startsWith('http') && !url.startsWith('//'))
            .filter((url) => !toVisit.includes(url))
          cy.log(`found ${localUrls.length} new link(s) to visit`)
          toVisit.push(...localUrls)
          localUrls.forEach(link => {
            cy.request(link).then(response => {
              expect(response.status).to.be.lt(400)
            })
          })
          localUrls.forEach(link => {
            cy.visit(link)
            CommonHandler.waitForFullLoad()
          })
        })
    })
  })
})
