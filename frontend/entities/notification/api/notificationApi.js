import { api } from "@/shared/api/axios";

const NOTIFY_API = api;
const NOTIFY_ENDPOINT = "/api/notifications";

const getNotifications = async () => {
    const response = await NOTIFY_API.get(`${NOTIFY_ENDPOINT}/getNotifications`);
    console.log("response.data: from getNotifications", response.data);
    return response.data;
};

const readNotification = async (notification_id, timestamp) => {
    const response = await NOTIFY_API.put(`${NOTIFY_ENDPOINT}/readNotification`, {
        notification_id: notification_id,
        timestamp: timestamp
    });
    return response.data;
};

export { readNotification, getNotifications };
