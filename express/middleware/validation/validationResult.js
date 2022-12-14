const { validationResult } = require("express-validator");

async function checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array({ onlyFirstError: true }) });
    }
    next();
}

module.exports = { checkValidation };
