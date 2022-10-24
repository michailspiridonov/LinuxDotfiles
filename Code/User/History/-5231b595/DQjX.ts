import { getInputByLabelText } from "../selector_helper";

/**
 * Filter customers by name
 * @param name customer name
 */
export function filterCustomersByName(name: string) {
    //clear the filter if it is already set
    cy.get(`button`).then($btn => {
        console.log($btn[0]);
        $btn.forEach(button => {
            if (button.text() === `Clear all`) {
                cy.wrap($btn).click();
            }
        })
    })
    // cy.get(`button[data-action="grid-filter-reset"]`).first().should(`be.visible`).click();
    // cy.WaitForMagentoToLoad();
    // //open filter
    // cy.get(`button[data-action="grid-filter-expand"]`).first().should(`be.visible`).click();
    // //enter name in search field
    // getInputByLabelText('Name').type(name);
    // //apply filter
    // cy.get(`button[data-action="grid-filter-apply"]`).click();
}