import { api } from "@/shared/api/axios";

const NOTIFY_API = api;

const getNotifications = async () => {
    const response = await NOTIFY_API.get(`/api/notifications/getNotifications`);
    console.log("response.data: from getNotifications", response.data);
    return response.data;
};

const readNotification = async (notification_id, timestamp) => {
    const response = await NOTIFY_API.put(`/api/notifications/readNotification`, {
        notification_id: notification_id,
        timestamp: timestamp
    });
    return response.data;
};

export { readNotification, getNotifications };
