export class ProductListHandlers {
	/**
     * get the name of the first product in the list
     * @returns {string} the name of the first product in the list 
    */
	static getNameOfFirstProductInList = () => {
		cy.get("tr[data-repeat-index=\"0\"]").find("td").eq(3).invoke("text").then((text) => {return text.trim();});
	};
}