import { useRouter } from 'next/router'
import CreatePost from '../../components/CreatePost';

//The (public?) profile page of a user
export default function ProfilePage() {
    const router = useRouter()
    const { username } = router.query

    return (
        <div>
            <h1 className="">Noting</h1>
            <h2>Nothing here yet...</h2>
            <h3>username:</h3>
            <h3>{username}</h3>
            <CreatePost/>
        </div>
    );
}
