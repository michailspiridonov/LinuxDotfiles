import { Filter } from "../../locators/admin/AdminFilter";

export class FilterHandlers {
	/**
     * find filter input/select by its label text
     * @param label label text
     * @returns {Cypress.Chainable} the filter input/select element
     */
	static getFilterInputByLabelText = (label: string) => {
		return cy
			.contains("label.admin__form-field-label", label)
			.invoke("attr", "for")
			.then((id) => {
				cy.get("#" + id);
			});
	};
	/**
     * filter by any parameter
     * @param label parameter to filter by
     * @param value searched value 
     */
	static filterTextByLabelText = (label: string, value: string) => {
		//clear the filter if it is already set
		cy.log("**clearing filter**");
		cy.get("button").each($btn => {
			if ($btn.text() === "Clear all") {
				cy.wrap($btn).click({ force: true });
				return false;
			}
		});
		cy.WaitForMagentoToLoad();
		//open filter
		cy.log("**opening filter**");
		cy.get(Filter.open_filter_button).first().click({ force: true });
		FilterHandlers.getFilterInputByLabelText(label).type(value);
		//apply filter
		cy.log("**applying filter**");
		cy.get(Filter.apply_filter_button).click();
	};
	

}