import { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from "../clientAPI/api.js";

export default function PaypalBtn(props) {
    const { cartData } = props;

    const [orderID, setOrderID] = useState('');


    const createOrder = async () => {
        const res = api.paypalCreateOrder(cartData);
        setOrderID(res);
        return res;
    };

    const onApprove = async () => {
        const res = api.paypalCreateOrder(cartData);
        return res;
    };

    return (
        <div>
            <PayPalButtons
                style={{
                    color: "blue",
                    shape: "pill",
                    label: "pay",
                    tagline: false,
                    layout: "horizontal",
                }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    );
}
