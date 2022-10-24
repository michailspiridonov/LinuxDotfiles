import {
  TAG,
  CommonHandler,
  GeneralHandler,
  GeneralLocators,
  CONFIG_CONST,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  ElasticsearchApiHandler
} from 'cypress/index'

describe('Search Suggestion', () => {
  beforeEach(() => {
    cy.visit(CONFIG_CONST.HOMEPAGE_URL)
    CommonHandler.waitForFullLoad()
  })

  it.only('7334 - Products', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    ElasticsearchApiHandler.getNameOfOneAvailableProduct().then(productName => {
      GeneralHandler.typeToFulltextBar(productName)
      cy.getLocScroll(GeneralLocators.fulltext.suggested_item).should('be.visible').contains(String(productName), { matchCase: false })
    })
  })

  it('2200 - Categories', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    const elasticBuilder = (new CategoryESRequestBuilder())
      .setSize(5)
      .setIsActive(true)
      .setProductCount({ gte: 100 })
      .addTerm({ key: 'level', must: true, value: 2 })
      .addSource('name')
    ElasticsearchApiHandler.getCategoryData(elasticBuilder).then(names => {
      return String(Cypress._.sample(names).name)
    }).then(categoryName => {
      GeneralHandler.typeToFulltextBar(String(categoryName))
      cy.getLocScroll(GeneralLocators.fulltext.search_bar_category).should('be.visible').contains(String(categoryName), { matchCase: false })
    })
  })

  it('2199 - Brands', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
    const elasticBuilder = (new BrandESRequestBuilder())
      .setSize(5)
      .addSource('title')
    ElasticsearchApiHandler.getBrandData(elasticBuilder).then(titles => {
      return String(Cypress._.sample(titles).title)
    }).then(brandTitle => {
      GeneralHandler.typeToFulltextBar(String(brandTitle))
      cy.getLocScroll(GeneralLocators.fulltext.suggested_item).should('be.visible').contains(String(brandTitle), { matchCase: false })
    })
  })

  if (['cz', 'ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) {
    it('7338 - Pharmacy', { tags: [TAG.PROD_FRIENDLY, TAG.P1] }, () => {
      GeneralHandler.typeToFulltextBar(CONFIG_CONST.DATA.fulltext_pharmacy)
      cy.getLocScroll(GeneralLocators.fulltext.suggested_item).should('be.visible').contains(CONFIG_CONST.DATA.fulltext_pharmacy, { matchCase: false })
    })
  }
})
