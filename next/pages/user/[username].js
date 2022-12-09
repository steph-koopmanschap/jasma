import { useRouter } from 'next/router';
import CreatePost from '../../components/CreatePost';
import HeaderMain from '../../components/HeaderMain';

//The (public?) profile page of a user
export default function ProfilePage() {
    const router = useRouter();
    const { username } = router.query;

    return (
        <div>
            <HeaderMain />
            {/* <Image 
            
            /> */}

            <main className="flex flex-col">
                <h1 className="">Noting</h1>
                <h2>Nothing here yet...</h2>
                <p>Settings</p>
                <h3>username:</h3>
                <h3>{username}</h3>
                <CreatePost/>
            </main>


        </div>
    );
}
