
export default function NotificationList() {

    const { isSuccess, isLoading, isError, data, error, refetch } = useQuery([`notifications`], 
    async () => {return await api.getNotifications()},
    {   
        enabled: true,
        refetchOnWindowFocus: false,
        //onSuccess: (result) => {} //Load the response data into state upon succesful fetch
    }
    );

    const readNotification = async (notif_id) => {
        const res = await api.readNotification();
    } 

    return ( 
    <div>
        <h1>Hi</h1>
    </div>
    );
}