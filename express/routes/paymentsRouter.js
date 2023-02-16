const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { paypalCreateOrder,
        paypalTransactionComplete } = require("../controllers/payments.js");

const paymentsRouter = express.Router();

paymentsRouter.post('/paypalCreateOrder', isAuth, paypalCreateOrder);
paymentsRouter.post("/paypalTransactionComplete", isAuth, paypalTransactionComplete);

module.exports = { paymentsRouter };
