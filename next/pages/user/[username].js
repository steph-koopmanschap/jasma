import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import LogInOutBtn from '../../components/LogInOutBtn';
import UserPostList from '../../components/UserPostList';
import { useEffect } from 'react';


//The (public?) profile page of a user
export default function ProfilePage(props) {
    const router = useRouter();
    const { username } = router.query;
    const userID = "";

    const { status, isLoading, isError, data, error, refetch } = useQuery([`${username}`], 
    async () => {return await api.getUserID(username)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    return (
        <div>
            <HeaderMain />
            <div className="flex flex-col items-end justify-end mr-4">
                <ProfilePic 
                    userid={data?.user_id} 
                    width="100" 
                    height="100" 
                />
                <LogInOutBtn initialState={userID ? true : false} />
            </div>

            <main className="flex flex-col">
                <p>Settings</p>
                <CreatePost />

                {data?.success ? <UserPostList userID={data?.user_id} /> : <p>Could not retrieve posts.</p>}
            </main>

        </div>
    );
}
