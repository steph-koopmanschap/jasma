require("dotenv").config();
const paypal = require('@paypal/checkout-server-sdk');
const { v4: uuidv4 } = require("uuid");

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

const paypalClient = new paypal.core.PayPalHttpClient(environment);

async function paypalCreateOrder(req, res) {
    const { cartData } = req.body;
    const { user_id, username } = req.session;

    const invoice_number = uuidv4();

    //Example of cartData
    //cartData.currency = 'USD',
    //cartData.price = '100.00'

    try {

        //return_url: "https://example.com/success",
        //cancel_url: "https://example.com/cancel",

        /*
            payment_instruction: {
                    platform_fees: [
                    {
                        amount: {
                        currency_code: "USD",
                        value: "5.00"
                        }
                    }
                    ]
                },

            merchant_info: {
                email: "merchant@example.com",
                first_name: "John",
                last_name: "Doe",
                business_name: "Example Inc."
            }
        */

        let request = new paypal.orders.OrdersCreateRequest();

        //used to specify that the response should return the full representation of the requested resource, 
        //rather than a simple reference or identifier.
        request.prefer("return=representation");

        //Create the body for the request to paypal
        request.requestBody({
            intent: "CAPTURE",
            application_context: {
                shipping_preference: "NO_SHIPPING",
            purchase_units: [
                {
                    amount: {
                        "currency_code": cartData.currency,
                        "value": cartData.price,
                        breakdown: {
                            item_total: {
                                currency_code: artData.currency,
                                value: cartData.price
                            },
                            // shipping: {
                            //     currency_code: cartData.currency,
                            //     value: "0.00"
                            // },
                            tax_total: {
                                currency_code: cartData.currency,
                                value: "0.00"
                            }
                        }
                    },
                    description: 'Purchase of credits.',
                    invoice_number: invoice_number,
                    payment_options: {
                        allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                    },
                    item_category: 'DIGITAL_GOODS',
                    soft_descriptor: 'JASMA', //Company name displayed on bank statements or credit card statements.
                    items: [
                        {
                            name: 'Credit purchase',
                            unit_amount: {
                                currency_code: cartData.currency,
                                value: cartData.price
                        },
                        quantity: '1',
                        description: 'Purchase of credits.'
                        }
                    ],
                    billing_address: {
                        address_line_1: '', // '123 Main St',
                        address_line_2: '', //'Suite 100',
                        admin_area_2: '', //'San Jose',
                        admin_area_1: '', //'CA',
                        postal_code: '', //'95131',
                        country_code: '', //'US'
                    }
                },
            ]
            },
        });
        // Get response with the order id
        const response = await paypalClient.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        const orderID = response.result.id;
        console.log("orderID", orderID);
        let capture = captureOrder(orderID); 
    
        return res.json({ success: true, orderID: orderID });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

/*
This JavaScript function uses the NodeJS NPM @paypal/checkout-server-sdk package to complete a PayPal transaction by capturing the payment for a given order ID.

The function takes in the order ID from the request body, as well as the user ID and username from the session. It then creates a new request to capture the payment for the given order ID using the OrdersCaptureRequest method provided by the PayPal SDK. The requestBody method is called on the request object to specify any additional data that needs to be sent with the request.

Once the request has been set up, the execute method is called on the client object to send the request to PayPal for processing. The response is then captured and logged to the console for debugging purposes, and the result field of the response is extracted and sent back as a JSON response to the client.

If there is an error during the execution of the request, the catch block is triggered and the error is logged to the console. A 500 error is also sent back to the client to indicate that there was an issue with the server.
*/
async function paypalTransactionComplete(req, res) {
    const { orderID } = req.body;
    const { user_id, username } = req.session;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await paypalClient.execute(request);
        console.log(`Response: ${JSON.stringify(capture)}`);
        console.log(`Capture: ${JSON.stringify(capture.result)}`);
        const result = capture.result;
        console.log('result: ', result);
        // Check if the capture response is successful and the status is "COMPLETED"
        if (capture.statusCode === 201 && result.status === 'COMPLETED') {
            return res.json({ success: true, message: 'Transaction completed successfully!' });
        } else {
            return res.status(500).json({ success: false, message: 'Transaction was not completed successfully!' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    paypalCreateOrder,
    paypalTransactionComplete
};
