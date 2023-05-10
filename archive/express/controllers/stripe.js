require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//Stripe always uses the price in cents.
//1 dollar is 100 cents 
//For example 200 dollars is 20000 cents 

async function stripeCreateCheckoutSession(req, res) {
    const { user_id, username } = req.session;
    const { cartData } = req.body;

    const invoice_number = uuidv4();

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: 
                    {
                        currency: 'usd',
                        product_data: 
                        {
                            name: "Credit purchase"
                        },
                        unit_amount: cartData.price * 100
                        
                    },
                    quantity: 1
                },
                
            ],
            mode: 'payment',
            success_url: `${NEXTJS_ORIGIN}/payment/success`,
            cancel_url: `${NEXTJS_ORIGIN}/payment/failure`
        });

        return res.json({ success: true, url: session.url });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    stripeCreateCheckoutSession
}
