import {
  TAG,
  CommonHandler,
  HomepageHandler,
  HomepageLocators,
  CONFIG_CONST,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  ElasticsearchApiHandler
} from 'cypress/index'

describe('Search Suggestion', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
    cy.getLoc(HomepageLocators.mainpage_elements.search_trigger_button).click({ force: true })
  })

  it('7334 - Products', { tags: [] }, () => {
    ElasticsearchApiHandler.getNameOfOneAvailableProduct().then(productName => {
      cy.getLoc(HomepageLocators.fulltext_search).clear().fill(productName)
      cy.getLoc(HomepageLocators.search_bar_suggested_item).contains(productName)
    })
  })

  it('2200 - Categories', { tags: [] }, () => {
    const elasticBuilder = (new CategoryESRequestBuilder())
      .setSize(5)
      .setIsActive(true)
      .setProductCount({ gte: 100 })
      .addTerm({ key: 'level', must: true, value: 2 })
      .addSource('name')
    ElasticsearchApiHandler.getCategoryData(elasticBuilder).then(names => {
      return String(Cypress._.sample(names).name)
    }).then(categoryName => {
      HomepageHandler.typeToFulltextBar(String(categoryName))
      cy.getLoc(HomepageLocators.search_bar_category).should('be.visible').contains(String(categoryName), { matchCase: false })
    })
  })

  it('2199 - Brands', { tags: [] }, () => {
    const elasticBuilder = (new BrandESRequestBuilder())
      .setSize(5)
      .addSource('title')
    ElasticsearchApiHandler.getBrandData(elasticBuilder).then(titles => {
      return String(Cypress._.sample(titles).title)
    }).then(brandTitle => {
      HomepageHandler.typeToFulltextBar(String(brandTitle))
      cy.getLoc(HomepageLocators.search_bar_suggested_item).should('be.visible').contains(String(brandTitle), { matchCase: false })
    })
  })

  if (['cz', 'ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
    it('7338 - Pharmacy', { tags: [] }, () => {
      HomepageHandler.typeToFulltextBar(CONFIG_CONST.DATA.fulltext_pharmacy)
      cy.getLoc(HomepageLocators.search_bar_suggested_item).should('be.visible').contains(CONFIG_CONST.DATA.fulltext_pharmacy, { matchCase: false })
    })
  }
})
