import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import api from "../../../clientAPI/api.js";

//The (public?) bio page of a user
export default function BioPage(props) {
    const router = useRouter();
    const { username } = router.query;

    //Get userID from query cache.
    const queryClient = useQueryClient();
    const res = queryClient.getQueryData(`${username}`);
    const userID = res?.user_id;

    const { status, isLoading, isError, data: dataUserInfo, error, refetch } = useQuery([`${username}`], 
    async () => {return await api.getUserInfo(userID)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (data) {
        console.log("data: ", data);
    }

    useEffect(() => {
        refetch();
    }, []);
    
    return (
        <div>
            <h1>NOTHING HERE YET.</h1>
            <p>{username}</p>
            <p>UserID: {userID}</p>

            {data?.success ? 
                (<div>
                    <p>Name: {data.userInfo.given_name}</p>
                    <p>Last name: {data.userInfo.last_name}</p>
                    <p>Bio: {data.userInfo.bio}</p>
                    <p>Website: {data.userInfo.website}</p>
                    <p>Date of Birth: {data.userInfo.date_of_birth}</p>
                    <p>Country: {data.userInfo.country}</p>
                    <p>City: {data.userInfo.city}</p>
                    <p>E-mail: {data.userInfo.email}</p>
                    <p>Phone: {data.userInfo.phone}</p>
                </div>) 
            : 
                (<div>
                    <p>Name: </p>
                    <p>Last name: </p>
                    <p>Bio: </p>
                    <p>Website: </p>
                    <p>Date of Birth: </p>
                    <p>Country: </p>
                    <p>City: </p>
                    <p>E-mail: </p>
                    <p>Phone: </p>
                </div>)}
        </div>
    );
}
