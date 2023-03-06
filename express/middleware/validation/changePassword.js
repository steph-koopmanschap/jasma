const { checkSchema } = require("express-validator");

module.exports = checkSchema({
    newPassword: {
        exists: {
            errorMessage: "Password must be provided"
        },
        isLength: {
            options: { min: 5 },
            errorMessage: "Password must be at least 5 characters"
        }
    }
});
