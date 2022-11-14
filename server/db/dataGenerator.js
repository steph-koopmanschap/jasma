const { faker } = require("@faker-js/faker");
const crypto = require("crypto");

function objectify(methods) {
    const methodNames = Object.getOwnPropertyNames(methods);
    return Object.fromEntries(methodNames.map((methodName) => [methodName, methods[methodName]()]));
}

function userGen() {
    const methods = {
        user_id() {
            return crypto.randomUUID();
        },

        user_name() {
            return faker.internet.userName();
        },

        email() {
            return faker.internet.email();
        },

        recovery_email() {
            return faker.internet.email();
        },

        user_password() {
            return faker.internet.password();
        },

        phone() {
            return faker.phone.number();
        },

        recovery_phone() {
            return faker.phone.number();
        }
    };

    return objectify(methods);
}

function userInfoGen(user_id) {
    const methods = {
        profile_pic() {
            return faker.image.avatar();
        },

        given_name() {
            return faker.name.firstName();
        },

        last_name() {
            return faker.name.lastName();
        },

        bio() {
            return faker.lorem.paragraph();
        },

        date_of_birth() {
            return faker.date.birthdate();
        },

        country() {
            return faker.address.country();
        },

        city() {
            return faker.address.city();
        },

        website() {
            return faker.internet.url();
        }
    };
    return { user_id, ...objectify(methods) };
}

function userMetaDataGen(user_id, user_role) {
    const methods = {
        last_login_date() {
            return new Date().toISOString();
        },
        account_creation_date() {
            return new Date().toISOString();
        },
        isVerfied_email() {
            if (user_role === "admin" || user_role === "mod") {
                return true;
            }

            if (user_role === "normal") {
                return Math.random() < 0.5;
            }

            return false;
        },
        last_ip4() {
            return faker.internet.ipv4();
        }
    };

    return { user_id, user_role, ...objectify(methods) };
}

module.exports = { userGen, userInfoGen, userMetaDataGen };
