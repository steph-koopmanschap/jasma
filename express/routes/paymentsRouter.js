const express = require("express");
const { paymentLimiter } = require("../middleware/rateLimiters");
const isAuth = require("../middleware/isAuth.js");
const { paypalCreateOrder,
        paypalTransactionComplete } = require("../controllers/payments.js");

const paymentsRouter = express.Router();

paymentsRouter.post('/paypalCreateOrder', paymentLimiter, isAuth, paypalCreateOrder);
paymentsRouter.post("/paypalTransactionComplete", paymentLimiter, isAuth, paypalTransactionComplete);

module.exports = { paymentsRouter };
