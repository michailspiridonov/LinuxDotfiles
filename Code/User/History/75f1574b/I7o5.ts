import { TAG, CommonHandler, CONFIG_CONST, requestResult } from 'cypress/index_'

const results: requestResult[] = []
function checkLink (url: string) {
  return new Promise((resolve, reject) => {
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
  })
}

describe('FAQ', () => {
  if (['cz', 'sk'].includes(CONFIG_CONST.COUNTRY)) {
    it('10666 - FAQ questions are found', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P2] }, () => {
      cy.visit(CONFIG_CONST.DATA.url.faq)
      CommonHandler.waitForFullLoad()
      cy.getLocScroll('a.tdi').each(tag => {
        cy.wrap(tag).click({ scrollBehavior: 'center' })
        cy.getLoc('slot').then(slot => {
          slot.find('a').each((_, questionLink) => {
            const questionHref = questionLink.getAttribute('href')
            checkLink(questionHref)
          })
        })
      }).then(() => {
        const passedResults = results.filter(res => res.response.isOkStatusCode)
        const failedResults = results.filter(res => !res.response.isOkStatusCode)
        const passedHrefMessage = passedResults.map(href => { return href.response.status + ' ' + href.href }).join('\n')
        const failedHrefMessage = failedResults.map(href => { return href.response.status + ' ' + href.href }).join('\n')
        expect(failedResults).to.have.length(0, `passedHrefs:\n${passedHrefMessage}\n\nfailedHrefMessage:\n${failedHrefMessage}\n\n`)
      })
    })
  } else {
    it.skip('Skipped')
  }
})
