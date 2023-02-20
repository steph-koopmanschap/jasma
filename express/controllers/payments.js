require("dotenv").config();
const paypal = require('@paypal/checkout-server-sdk');

const clientSecret = process.env.PAYPAL_SECRET;
let clientId = '';
let environment = null;

if (process.env.NODE_ENV === 'production') {
    clientId = process.env.PAYPAL_CLIENT_ID_PRODUCTION;
    environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
}
else if (process.env.NODE_ENV === 'development') {
    clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
    environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new paypal.core.PayPalHttpClient(environment);

async function paypalCreateOrder(req, res) {
    const { cartData } = req.body;
    const { user_id, username } = req.session;

    try {
        let request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: "CAPTURE",
            application_context: {
            shipping_preference: "NO_SHIPPING",
            purchase_units: [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "100.00"
                    }
                }
                ]
            },
        });
        // Get response with the order id
        const response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        const orderID = response.result.id;
    
        return res.json({ success: true, orderID: orderID });
    }
    catch (err) {
        // console.error(err);
        console.log(err);
        return res.status(500).send(500);
    }
}

async function paypalTransactionComplete(req, res) {
    const { orderID } = req.body;
    const { user_id, username } = req.session;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        console.log(`Response: ${JSON.stringify(capture)}`);
        console.log(`Capture: ${JSON.stringify(capture.result)}`);
        const result = capture.result;
        res.json({ result: result });
        // return capture.result;
    } catch (err) {
        // console.error(err);
        console.log(err);
        return res.status(500).send(500);
    }
}

module.exports = {
    paypalCreateOrder,
    paypalTransactionComplete
};
