import { getRandomString } from "./user";

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
            getRandomString('street'),
            getRandomString('city'),
            getRandomString('state'),
            Address.getRandomZIP(),
            Address.getRandomCountry()
        );
    }
    static getRandomCountry(): string {
        let countries = ['Czechia', 'Slovakia', 'Vietnam']
        //return random country
        return countries[Math.floor(Math.random() * countries.length)];
    }

    static getRandomZIP(): string {
        let zip = '';
        for (let i = 0; i < 5; i++) {
            zip += Math.floor(Math.random() * 10);
        }
        return zip;
    }
}