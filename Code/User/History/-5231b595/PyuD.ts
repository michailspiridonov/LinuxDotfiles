import { getInputByLabelText } from "../selector_helper";

/**
 * Filter customers by name
 * @param name customer name
 */
export function filterCustomersByName(name: string) {
    //clear the filter
    cy.get(`button[data-action="grid-filter-reset"]`).click();
    //open filter
    cy.get(`button[data-action="grid-filter-expand"]`).click();
    //enter name in search field
    getInputByLabelText('Name').type(name);
    //apply filter
    cy.get(`button[data-action="grid-filter-apply"]`).click();
}