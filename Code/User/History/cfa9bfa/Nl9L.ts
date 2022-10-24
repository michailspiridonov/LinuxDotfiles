import { getRandomPassword, getRandomString } from "../../../support/utils";
import { Address } from "./Address";

export class User {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	company: string;
	address: Address;
	phone: string;
	shippingAddress: Address;

	constructor(firstName: string, lastName: string, email: string, password: string, company: string, address: Address, phone: string, shippingAddress: Address) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.company = company;
		this.address = address;
		this.phone = phone;
		this.shippingAddress = shippingAddress;
	}

	/**
     * get random user
     * @returns {User} random user
     */
	static getRandomUser(): User {
		return new User(
			getRandomString("firsName"),
			getRandomString("lastName"),
			getRandomString("email") + "@gmail.com",
			getRandomPassword(),
			getRandomString("company"),
			Address.getRandomAddress(),
			getRandomString("phone"),
			Address.getRandomAddress()
		);
	}

	/**
     * get random user with set email
     * @param email email of the user
     * @returns {User} user with the given email
     */
	static getRandomUserWithEmail(email: string): User {
		return new User(
			getRandomString("firstName"),
			getRandomString("lastName"),
			email,
			getRandomPassword(),
			getRandomString("company"),
			Address.getRandomAddress(),
			getRandomString("phone"),
			Address.getRandomAddress()
		);
	}

    
}

