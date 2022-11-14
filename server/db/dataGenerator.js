const { faker } = require("@faker-js/faker");
const crypto = require("crypto");

class Gen {
    uuid() {
        return crypto.randomUUID();
    }

    username() {
        return faker.internet.userName();
    }

    email() {
        return faker.internet.email();
    }

    password() {
        return faker.internet.password();
    }

    phone() {
        return faker.phone.number();
    }

    avatar() {
        return faker.image.avatar();
    }

    givenName() {
        return faker.name.firstName();
    }

    lastName() {
        return faker.name.lastName();
    }

    paragraph() {
        return faker.lorem.paragraph();
    }

    paragraphs() {
        return faker.lorem.paragraphs();
    }

    dob() {
        return faker.date.birthdate();
    }

    country() {
        return faker.address.country();
    }

    city() {
        return faker.address.city();
    }

    website() {
        return faker.internet.url();
    }

    isVerfiedEmail() {
        return faker.datatype.boolean();
    }

    ipv4() {
        return faker.internet.ipv4();
    }

    emailNotifications() {
        return faker.datatype.boolean();
    }

    textContent() {
        return faker.lorem.paragraph();
    }

    image() {
        return faker.image.image();
    }

    hashtag() {
        return faker.random.word();
    }

    commentText() {
        return faker.random.paragraph();
    }
}

const gen = new Gen();
module.exports = gen;
