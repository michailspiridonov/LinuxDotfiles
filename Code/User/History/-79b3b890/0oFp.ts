import { Filter } from "../../locators/admin/Filter";

export class FilterHandlers {
    static getFilterInputByLabelText = (label: string) => {
        return cy
            .contains('label.admin__form-field-label', label)
            .invoke('attr', 'for')
            .then((id) => {
                cy.get('#' + id)
            });
    }

    static filterByLabelText = (label: string, value: string) => {
        //clear the filter if it is already set
        cy.log(`**clearing filter**`);
        cy.get(`button`).each($btn => {
            if ($btn.text() === `Clear all`) {
                cy.wrap($btn).click({ force: true });
                return false;
            }
        })
        cy.WaitForMagentoToLoad();
        //open filter
        cy.log(`**opening filter**`);
        cy.get(Filter.open_filter_button).first().click({ force: true });
        FilterHandlers.getFilterInputByLabelText(label).type(value);
        //apply filter
        cy.log(`**applying filter**`);
        cy.get(Filter.apply_filter_button).click();
    }
}