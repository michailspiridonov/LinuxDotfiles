import { TAG, CONFIG_CONST, CommonHandler, PharmaciesLocators } from 'cypress/index'

if (!['ed', 'it', 'pl'].includes(CONFIG_CONST.COUNTRY)) {
  describe('Pharmacies', () => {
    beforeEach(() => {
      // cy.visit(CONFIG_CONST.DATA.url.pharmacies)
      cy.visit(CONFIG_CONST.HOMEPAGE_URL)
      cy.get('.header__hamburger > :nth-child(2)').click()
      cy.get('a[href="/lekarne"]').click()
      cy.getLoc(PharmaciesLocators.map.area)
      cy.getLoc(PharmaciesLocators.map.pharmarmacy_icon)
    })

    it('5907 - Pharmacy can be clicked and info is shown', { tags: [TAG.REDESIGN] }, () => {
      cy.getLoc(PharmaciesLocators.map.pharmarmacy_icon)
        .last()
        .click({ force: true })

      cy.getLoc(PharmaciesLocators.info.pharmacy_info).within(() => {
        cy.getLoc(PharmaciesLocators.info.pharmacy_name).contains(/^[a-zA-Z ]*$/)
        cy.getLoc(PharmaciesLocators.info.pharmacy_opening_hours).within(() => {
          cy.contains(/(0?[0-9]|1[0-9]|2[0-3]):[0-9]+\s-\s(0?[0-9]|1[0-9]|2[0-3]):[0-9]+/)
        })
      })
    })

    it('5908 - Pharmacy search', { tags: [TAG.REDESIGN] }, () => {
      cy.getLoc(PharmaciesLocators.map.search).type(CONFIG_CONST.DATA.pharmacy_address + '{downArrow}{enter}', { delay: 200 })
      cy.getLoc(PharmaciesLocators.tile.found_pharmacies).within(() => {
        cy.contains(CONFIG_CONST.DATA.pharmacy_address).click()
      })
      CommonHandler.waitForFullLoad()
      cy.contains(CONFIG_CONST.DATA.pharmacy_address)
    })
  })
} else {
  it.skip('SKIPPED')
}
