import { getFilterInputByLabelText } from "../selector_helper";

/**
 * Filter customers by name
 * @param name customer name
 */
export function filterCustomersByName(name: string) {
    //clear the filter if it is already set
    cy.get(`button`).each($btn => {
        if ($btn.text() === `Clear all`) {
            cy.wrap($btn).click({ force: true });
            return false;
        }
    })
    cy.WaitForMagentoToLoad();
    //open filter
    cy.get(`button[data-action="grid-filter-expand"]`).first().should(`be.visible`).click({force: true});
    //enter name in search field
    getFilterInputByLabelText('Name').type(name);
    //apply filter
    cy.get(`button[data-action="grid-filter-apply"]`).click();
}