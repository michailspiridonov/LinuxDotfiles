export class AdminProductListHandlers {
	/**
     * get the name of the first product in the list
     * @returns {string} the name of the first product in the list 
    */
	static getNameOfFirstProductInList(variable_name: string){
		cy.log("**getting name of first product in list**");
		cy.get("tr[data-repeat-index=\"0\"]").find("td").eq(3).invoke("text").then((text) => {
			localStorage.setItem(variable_name, text.trim());
		});
	}
}