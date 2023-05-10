const { checkSchema } = require("express-validator");

module.exports = checkSchema({
    username: {
        exists: {
            errorMessage: "Username must be provided"
        },
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: "Username must be between 3 and 25 characters"
        }
    },
    email: {
        exists: {
            errorMessage: "Email must be provided"
        },
        isEmail: {
            errorMessage: "Email must be valid"
        }
    },
    password: {
        exists: {
            errorMessage: "Password must be provided"
        },
        isLength: {
            options: { min: 5 },
            errorMessage: "Password must be at least 5 characters"
        }
    }
});
