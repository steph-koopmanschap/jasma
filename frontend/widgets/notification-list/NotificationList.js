import { NotificationShell, getNotifications } from "@/entities/notification";
import UserWidgets from "../user/index";
import { useQuery } from "react-query";

export const NotificationList = () => {
    const { isSuccess, isLoading, isError, data, error, refetch } = useQuery(
        [`notifications`],
        async () => {
            return await getNotifications();
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
            //onSuccess: (result) => {} //Load the response data into state upon succesful fetch
        }
    );

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    if (data.success === false) {
        return <h1>{data.message}</h1>;
    }

    if (data) {
        console.log(data);
    }

    const readNotification = async (e) => {
        const notification_id = e.target.key;
        const timestamp = e.target.id;
        const res = await readNotification(notification_id, timestamp);
    };

    return (
        <div>
            {data.notifications.map((notification) => (
                <NotificationShell
                    {...notification}
                    key={notification.notification_id}
                    onClick={readNotification}
                    profilePic={<UserWidgets.ProfilePic userID={notification.from} />}
                />
            ))}
        </div>
    );
};
