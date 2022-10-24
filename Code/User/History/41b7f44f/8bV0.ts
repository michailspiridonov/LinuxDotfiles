/**
 * get random string with prefix 
 * @param prefix prefix for the string
 * @returns {string} random string
 */
export function getRandomString(prefix: string): string {
	return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * get random password
 * @returns {string} random password
 */
export function getRandomPassword(): string {
	//characters to use
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const specialCharacters = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
	let password = Cypress._.sampleSize(characters, 10).join("");
	//generate special characters part of the password
	password += Cypress._.sampleSize(specialCharacters, 2).join("");
	//return the password
	return password;
}

export function extractTextFromHTML(html: string): string {
	html = html.split("</style>")[1];
	const span = document.createElement("span");
	span.innerHTML = html;
	return span.textContent || span.innerText;
}