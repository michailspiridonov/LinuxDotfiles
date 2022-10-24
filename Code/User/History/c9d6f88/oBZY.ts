import { TAG, CONFIG_CONST, CommonHandler, PharmaciesLocators } from 'cypress/index_'

if (!['it', 'pl', 'ed', 'ap'].includes(CONFIG_CONST.COUNTRY)) {
  describe('Pharmacies', () => {
    beforeEach(() => {
      cy.visit(CONFIG_CONST.DATA.url.pharmacies)
      CommonHandler.waitForFullLoad()
      cy.getLocScroll(PharmaciesLocators.map.area)
      // cy.getLocScroll(PharmaciesLocators.map.pharmarmacy_icon) - disabled until Content team resolve locator issue with Google map
    })

    it('5908 - Pharmacy search', { tags: [TAG.PROD_FRIENDLY, TAG.P2, TAG.DEVCLOUD, TAG.DESKTOP] }, () => {
      cy.getLocScroll(PharmaciesLocators.search.input).type(CONFIG_CONST.DATA.pharmacy_address + '{downArrow}{enter}', { delay: 200, scrollBehavior: 'center' })
      CommonHandler.waitForFullLoad()
      cy.getLocScroll(PharmaciesLocators.search.results.list)
        .findLoc(PharmaciesLocators.search.results.item_title)
        .first()
        .click({ scrollBehavior: 'center' })
      cy.getLoc(PharmaciesLocators.detail.address).should('contain.text', CONFIG_CONST.DATA.pharmacy_address)
    })
  })
} else {
  it.skip('SKIPPED')
}
