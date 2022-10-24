export class FilterHandlers {
    static getFilterInputByLabelText = (label) => {
        return cy
            .contains('label.admin__form-field-label', label)
            .invoke('attr', 'for')
            .then((id) => {
                cy.get('#' + id)
            });
    }
}