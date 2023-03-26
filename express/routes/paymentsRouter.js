const express = require("express");
const { paymentLimiter } = require("../middleware/rateLimiters");
const isAuth = require("../middleware/isAuth.js");
const { paypalCreateOrder, paypalTransactionComplete } = require("../controllers/paypal.js");
const { stripeCreateCheckoutSession } = require("../controllers/stripe.js");

const paymentsRouter = express.Router();

paymentsRouter.post('/paypalCreateOrder', paymentLimiter, isAuth, paypalCreateOrder);
paymentsRouter.post("/paypalTransactionComplete", paymentLimiter, isAuth, paypalTransactionComplete);
paymentsRouter.post("/stripeCreateCheckoutSession", paymentLimiter, isAuth, stripeCreateCheckoutSession);

module.exports = { paymentsRouter };
