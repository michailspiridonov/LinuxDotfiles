class Address {
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
            getRandomString('zip'),
            getRandomString('country')
        );
    }
}

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

    //get random user
    static getRandomUser(): User {
        return new User(
            getRandomString('firstName'),
            getRandomString('lastName'),
            getRandomString('email'),
            getRandomString('password'),
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
function getRandomString(prefix: string): string {
    return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}