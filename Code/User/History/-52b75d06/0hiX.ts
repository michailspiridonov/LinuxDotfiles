import { TAG, CommonHandler, HomepageHandler, GeneralLocators, ElasticsearchApiHandler, CONFIG_CONST, WAIT_CONST } from 'cypress/index'

describe('Search results', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it('2196 - Search results', { tags: [TAG.PROD_FRIENDLY, TAG.DEVCLOUD, TAG.P1] }, () => {
    ElasticsearchApiHandler.getNameOfOneAvailableProduct().then(productName => {
      cy.log('**available product found:** ' + JSON.stringify(productName))
      cy.wait(WAIT_CONST.WAIT_FOR_CHANGE_PAGE_STATE)
      cy.getLocScroll(GeneralLocators.fulltext.trigger_button).click({ force: true })
      cy.wait(WAIT_CONST.WAIT_FOR_CHANGE_PAGE_STATE)
      HomepageHandler.typeToFulltextBar(productName)
      HomepageHandler.checkProductSearchResult(productName)
    })
  })
})
