import { api } from "@/shared/api/axios";

const PAYMENT_API = api;
const PAYMENT_ENDPOINT = "/api/payments";

const paypalCreateOrder = async (cartData) => {
    const response = await PAYMENT_API.post(`${PAYMENT_ENDPOINT}/paypalCreateOrder`, {
        cartData: cartData
    });
    return response.data.orderID;
};

const paypalTransactionComplete = async (orderID) => {
    const response = await PAYMENT_API.post(`${PAYMENT_ENDPOINT}/paypalTransactionComplete`, {
        orderID: orderID
    });
    return response.data;
};

const stripeCreateCheckoutSession = async (cartData) => {
    const response = await PAYMENT_API.post(`${PAYMENT_ENDPOINT}/stripeCreateCheckoutSession`, {
        cartData: cartData
    });
    return response.data.orderID;
};

export { paypalCreateOrder, paypalTransactionComplete, stripeCreateCheckoutSession };
