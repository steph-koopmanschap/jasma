import { paypalCreateOrder, paypalTransactionComplete, stripeCreateCheckoutSession } from "@/entities/payments";
import { handleError } from "@/shared/utils";

const handleCreateOrder = async (cartData) => {
    try {
        const res = await paypalCreateOrder(cartData);
    } catch (error) {
        return handleError(error);
    }
};
const handleTransactionCheck = async (orderID) => {
    try {
        const res = await paypalTransactionComplete(orderID);
    } catch (error) {
        return handleError(error);
    }
};
const handleStripeCheckoutSession = async (cartData) => {
    try {
        const res = await stripeCreateCheckoutSession(cartData);
    } catch (error) {
        return handleError(error);
    }
};

export { handleCreateOrder, handleStripeCheckoutSession, handleTransactionCheck };
