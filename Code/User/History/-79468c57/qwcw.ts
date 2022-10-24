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
            getRandomString('firstName'),
            getRandomString('lastName'),
            getRandomString('email') + '@gmail.com',
            getRandomPassword(),
            getRandomString('company'),
            Address.getRandomAddress(),
            getRandomString('phone'),
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
            getRandomString('firstName'),
            getRandomString('lastName'),
            email,
            getRandomPassword(),
            getRandomString('company'),
            Address.getRandomAddress(),
            getRandomString('phone'),
            Address.getRandomAddress()
        );
    }

    
}


/**
 * get random string with prefix 
 * @param prefix prefix for the string
 * @returns {string} random string
 */
export function getRandomString(prefix: string): string {
    return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getRandomPassword(): string {
    //characters to use
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialCharacters = '!@#$%^&*()_+-=[]{}|;\':",./<>?`~';
    let password = '';
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