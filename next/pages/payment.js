import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useRequireAuth from '../hooks/useRequireAuth';
import api from "../clientAPI/api.js";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";

export default function PaymentPage() {
    const router = useRouter();
    
    const [paymentInput, setPaymentInput] = useState(0.00);

    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth('/dashboard');

    const handleChange = (e) => {
        setPaymentInput(parseFloat(e.target.value));
    }

    const sendPaymentPaypal = async (e) => {
        e.preventDefault();
        
        console.log("paymentInput", paymentInput);

        const cartData = {
            currency: 'USD',
            price: paymentInput
        };

        console.log("cartData", cartData);

        const res = await api.paypalCreateOrder(cartData);
        console.log("res", res);

        if (res.ok) {
            console.log("res.ok");
        } 
        else {
            console.log("Failure");
        }
    }

    const sendPaymentStripe = async (e) => {
        e.preventDefault();
        
        console.log("paymentInput", paymentInput);

        const cartData = {
            currency: 'USD',
            price: paymentInput
        };

        console.log("cartData", cartData);

        const res = await api.stripeCreateCheckoutSession(cartData);
        console.log("res", res);

        if (res.ok) {
            console.log("res.ok");
            console.log(res.url);
            //router.replace(res.url);
            //window.location.href(res.url);
        } 
        else {
            console.log("Failure");
        }
    }

    return (
        <div className="">
            <HeaderMain />

            <main className="flex flex-col items-center justify-center w-full h-fit">
                <h1>Payment system... (in development)</h1>

                <input
                    className="my-2 p-1 mx-2"
                    id="paymentValue"
                    aria-label="Enter how much credits you want to deposit."
                    type="text"
                    name="paymentInput"
                    value={paymentInput}
                    onChange={handleChange}
                />

                <form
                    id="PaypalpaymentForm"
                    className="flex flex-col mx-auto text-center justify-center rounded"
                    action="#"
                    onSubmit={sendPaymentPaypal}
                >
                    <input
                        className="formButtonDefault py-2 px-2 m-2 outline-white border"
                        type="submit"
                        value="Pay with Paypal"
                    />
                </form>

                <form
                    id="PaypalpaymentForm"
                    className="flex flex-col mx-auto text-center justify-center rounded"
                    action="#"
                    onSubmit={sendPaymentStripe}
                >
                    <input
                        className="formButtonDefault py-2 px-2 m-2 outline-white border"
                        type="submit"
                        value="Pay with Stripe"
                    />
                </form>
            </main>

            <FooterMain />
        </div>
    );
}
