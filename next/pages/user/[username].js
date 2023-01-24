import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import LogInOutBtn from '../../components/LogInOutBtn';
import UserPostList from '../../components/UserPostList';

//The (public?) profile page of a user
export default function ProfilePage() {
    const router = useRouter();
    const { username } = router.query;

    const queryClient = useQueryClient();

    const userCredentials = queryClient.getQueryData("userCredentials");
    const userID = userCredentials?.user.user_id;

    return (
        <div>
            <HeaderMain />
            <div className="flex flex-col items-end justify-end mr-4">
                <ProfilePic 
                    userid={userID} 
                    width="100" 
                    height="100" 
                />
                <LogInOutBtn initialState={userID ? true : false} />
            </div>

            <main className="flex flex-col">
                <h1 className="">Noting</h1>
                <h2>Nothing here yet...</h2>
                <p>Settings</p>
                <h3>username:</h3>
                <h3>{username}</h3>
                <CreatePost />

                <UserPostList userID={"922f5d99-1ec7-418d-a2e0-005f4ab8ed4d"} />
            </main>

        </div>
    );
}
