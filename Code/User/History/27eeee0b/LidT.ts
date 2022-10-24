import {
  TAG,
  CONFIG_CONST,
  CommonHandler,
  requestResult
} from 'cypress/index_'

describe('Homepage', () => {
  it('2097 - Banners - Navigation', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P1] }, () => {
    const results: requestResult[] = []
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    cy.getLocScroll('.commercial a').each(bannerLink => {
      const questionHref = bannerLink.attr('href')
      cy.request({ url: questionHref, failOnStatusCode: false }).then(response => {
        results.push({ href: questionHref, statusCode: response.status, isOK: response.isOkStatusCode })
      })
    }).then(() => {
      const passedResults = results.filter(res => res.isOK)
      const failedResults = results.filter(res => !res.isOK)
      const passedHrefMessage = passedResults.map(href => { return href.statusCode + ' ' + href.href }).join('\n')
      const failedHrefMessage = failedResults.map(href => { return href.statusCode + ' ' + href.href }).join('\n')
      expect(failedResults).to.have.length(0, `passedHrefs:\n${passedHrefMessage}\n\nfailedHrefMessage:\n${failedHrefMessage}\n\n`)
    })
  })
})
