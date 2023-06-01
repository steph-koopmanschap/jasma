/* Possible refactor in the future: each form as a separate feature */

import { handleCreateOrder, handleStripeCheckoutSession } from "@/features/payments";

export const Payment = () => {
    const [paymentInput, setPaymentInput] = useState(0.0);

    const handleChange = (e) => {
        setPaymentInput(parseFloat(e.target.value));
    };

    const sendPaymentPaypal = async (e) => {
        e.preventDefault();

        console.log("paymentInput", paymentInput);

        const cartData = {
            currency: "USD",
            price: paymentInput
        };

        console.log("cartData", cartData);

        const res = await handleCreateOrder(cartData);
        if (res.error) return console.error(res.message);
        console.log("res", res);
    };

    const sendPaymentStripe = async (e) => {
        e.preventDefault();

        console.log("paymentInput", paymentInput);

        const cartData = {
            currency: "USD",
            price: paymentInput
        };

        console.log("cartData", cartData);

        const res = await handleStripeCheckoutSession(cartData);
        if (res.error) return console.error(res.message);
        console.log("res", res);
    };

    return (
        <>
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
        </>
    );
};
