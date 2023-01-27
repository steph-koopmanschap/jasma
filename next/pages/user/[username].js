import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import UserBox from '../../components/UserBox';
import UserPostList from '../../components/UserPostList';
import { useState, useEffect } from 'react';


//The (public?) profile page of a user
export default function ProfilePage(props) {
    const router = useRouter();
    const { username } = router.query;
    const userID = "";

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        // setIsLoggedIn(await api.checkAuth());
    }

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

            <UserBox />

            <div className='flex flex-col items-center justify-center'>
                        <ProfilePic 
                            userid={data?.user_id} 
                            width="100" 
                            height="100" 
                        />
                        <h1 className='font-bold'>{username}</h1>
            </div>

            <main className="flex flex-col">
                {isLoggedIn ? <CreatePost /> : null}
                {data?.success ? <UserPostList userID={data?.user_id} /> : <p>Could not retrieve posts.</p>}
            </main>

        </div>
    );
}
