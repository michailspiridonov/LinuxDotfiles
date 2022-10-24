import { getRandomString } from "../../../support/utils";

export class Address {
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;

	constructor(street: string, city: string, state: string, zip: string, country: string) {
		this.street = street;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.country = country;
	}

	/**
     * get random address
     * @returns {Address} random address
     */
	static getRandomAddress(): Address {
		return new Address(
			getRandomString("street"),
			getRandomString("city"),
			getRandomString("state"),
			Address.getRandomZIP(),
			Address.getRandomCountry()
		);
	}
	/**
	 * Selects a random country from predefined array of countries
	 * @returns {string} random country
	 */
	static getRandomCountry(): string {
		const countries = ["Czechia", "Slovakia", "Vietnam"];
		//return random country
		return Cypress._.sample(countries);
	}

	/**
	 * Generates random zip code of length 5
	 * @returns {string} random zip
	 */
	static getRandomZIP(): string {
		let zip = "";
		for (let i = 0; i < 5; i++) {
			zip += Math.floor(Math.random() * 10);
		}
		return zip;
	}
}