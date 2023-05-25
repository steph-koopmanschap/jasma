import Link from "next/link";
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import { formatDistance } from "date-fns";
import ProfilePic from './ProfilePic.js';

export default function NotificationList() {

    const { isSuccess, isLoading, isError, data, error, refetch } = useQuery([`notifications`], 
    async () => {return await api.getNotifications()},
    {   
        enabled: true,
        refetchOnWindowFocus: false,
        //onSuccess: (result) => {} //Load the response data into state upon succesful fetch
    }
    );

    if (isLoading) {
        return (<h1>Loading...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    if (data) {
        console.log(data);
    }

    const readNotification = async (e) => {
        const notification_id = e.target.key;
        const timestamp = e.target.id;
        const res = await api.readNotification(notification_id, timestamp);
    } 

    return ( 
    <div>
        {data.notifications.map((notification) => (
            <div className="mb-2 hover:bg-slate-400" id={notification.timestamp} key={notification.notification_id} onClick={readNotification}>
                <ProfilePic 
                    userID={notification.from} 
                    width={32}
                    height={32}
                />
                {notification.event_type === "new_comment" ? 
                    <Link
                        href={`/post/${notification.event_reference}`}
                    >
                        {notification.message}
                    </Link>
                :
                    <p>{notification.message}</p>
                }
                <p> 
                    {formatDistance(new Date(notification.timestamp), new Date())} a go.
                </p>
            </div>
        ))}
    </div>
    );
}
