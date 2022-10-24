/**
 * get random string with prefix 
 * @param prefix prefix for the string
 * @returns {string} random string
 */
export function getRandomString(prefix: string): string {
	return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getRandomPassword(): string {
	//characters to use
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const specialCharacters = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
	let password = "";
	//generate letter part of the password
	for (let i = 0; i < 10; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	//generate special characters part of the password
	for (let i = 0; i < 2; i++) {
		password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
	}
	//return the password
	return password;
}