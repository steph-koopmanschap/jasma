const { faker } = require("@faker-js/faker");
const crypto = require("crypto");

function createTableData(tableName, methods) {
    const columnNames = [];
    const columnValues = [];
    const entry = {};
    for (const columnName in methods) {
        const columnValue = methods[columnName]();
        columnNames.push(columnName);
        columnValues.push(columnValue);
        entry[columnName] = columnValue;
    }

    return { tableName, entry, columnNames, columnValues };
}

function userGen() {
    const methods = {
        user_id() {
            return crypto.randomUUID();
        },

        username() {
            return faker.internet.userName();
        },

        email() {
            return faker.internet.email();
        },

        recovery_email() {
            return faker.internet.email();
        },

        user_password() {
            // return faker.internet.password();
            return "a";
        },

        phone() {
            return faker.phone.number("###-###-####");
        },

        recovery_phone() {
            return faker.phone.number("###-###-####");
        }
    };

    return createTableData("users", methods);
}

function userInfoGen(userId) {
    const methods = {
        user_id() {
            return userId;
        },

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
    return createTableData("users_info", methods);
}

function userMetaDataGen(userId, userRole) {
    const methods = {
        user_id() {
            return userId;
        },

        user_role() {
            return userRole;
        },

        last_login_date() {
            return new Date().toISOString();
        },

        account_creation_date() {
            return new Date().toISOString();
        },

        isVerified_email() {
            if (userRole === "admin" || userRole === "mod") {
                return true;
            }

            if (userRole === "normal") {
                return Math.random() < 0.5;
            }

            return false;
        },

        last_ipv4() {
            return faker.internet.ipv4();
        }
    };

    return createTableData("users_metadata", methods);
}

function userPreferencesGen(userId) {
    const methods = {
        user_id() {
            return userId;
        },

        email_notifications() {
            return Math.random() < 0.2;
        }
    };

    return createTableData("users_preferences", methods);
}

module.exports = { userGen, userInfoGen, userMetaDataGen, userPreferencesGen };