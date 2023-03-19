import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Link from "next/link";
import api from "../../clientAPI/api.js";
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import UserBox from '../../components/UserBox';
import UserPostList from '../../components/UserPostList';
import FollowUnfollowBtn from '../../components/FollowUnfollowBtn.js';
import Modal from '../../components/Modal.js';
import FollowersList from '../../components/FollowersList.js';
import FolloweesList from '../../components/FolloweesList.js';

//The (public?) profile page of a user
export default function ProfilePage(props) {
    const router = useRouter();
    const { username } = router.query;
    console.log("username: from profilePage)", username);
    
    const [loggedInUserID, setLoggedInUserID] = useState(null);
    const [followerModalState, setFollowerModalState] = useState(false);
    const openFollowerModal = () => {
        setFollowerModalState(true);
    }
    const closeFollowerModal = () => {
        setFollowerModalState(false);
    }

    useEffect( () => {
        setLoggedInUserID(window.localStorage.getItem('loggedInUserID'));
    }, []);

    const { status, isLoading, isError, data, error, refetch } = useQuery([`${username}`], 
    async () => {return await api.getUserID(username)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (data) {
        console.log("data from ProfilePage", data);
    }

    return (
        <div>
            <HeaderMain />

            <UserBox />

            <div className='flex flex-col items-center justify-center'>
                <ProfilePic 
                    userID={data?.success ? data.user_id : ""} 
                    width="100" 
                    height="100" 
                />
                <h1 className='font-bold'>{username}</h1>
                <Link className='hover:text-sky-500' href={`/user/${username}/bio`}>About</Link>
    
                {loggedInUserID ?
                    (data?.user_id !== loggedInUserID) ? 
                        <FollowUnfollowBtn userID_two={data?.user_id} username={username} /> 
                    : null
                : null}

                <button className='formButtonDefault m-2' onClick={openFollowerModal}>See followers</button>
                <Modal modalName="followerModal" isOpen={followerModalState} onClose={closeFollowerModal} >
                    <FollowersList userID={data ? data?.user_id : ""} />
                    <FolloweesList userID={data ? data?.user_id : ""} />
                </Modal>
            </div>

            <main className="flex flex-col">
                {(loggedInUserID && window.localStorage.getItem('loggedInUsername') === username) ? <CreatePost /> : null}
                {data?.success ? <UserPostList userID={data?.user_id} /> : <p className='text-center'>Could not retrieve posts.</p>}
            </main>

        </div>
    );
}
