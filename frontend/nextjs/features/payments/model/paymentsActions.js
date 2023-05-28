import { paypalCreateOrder, paypalTransactionComplete, stripeCreateCheckoutSession } from "@/entities/payments";

const handleCreateOrder = async (cartData) => {
    try {
        const res = await paypalCreateOrder(cartData);
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};
const handleTransactionCheck = async (orderID) => {
    try {
        const res = await paypalTransactionComplete(orderID);
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};
const handleStripeCheckoutSession = async (cartData) => {
    try {
        const res = await stripeCreateCheckoutSession(cartData);
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export { handleCreateOrder, handleStripeCheckoutSession, handleTransactionCheck };
