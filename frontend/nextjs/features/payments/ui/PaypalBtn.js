import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { handleCreateOrder } from "../model/paymentsActions";
import { useToast } from "@/shared/model";

export function PaypalBtn({ cartData }) {
    const [orderID, setOrderID] = useState("");

    const { notifyToast } = useToast();

    const createOrder = async () => {
        const res = await handleCreateOrder(cartData);
        if (res.error) return notifyToast(res.message);
        setOrderID(res);
        return res;
    };

    const onApprove = async () => {
        const res = await handleCreateOrder(cartData);
        if (res.error) return notifyToast(res.message);
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
                    layout: "horizontal"
                }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    );
}
