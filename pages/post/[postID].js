import { useRouter } from 'next/router'
import Post from '../../components/Post';

//Shows a specific single post on a page
export default function PostPage() {
    const router = useRouter()
    const { postID } = router.query

    return (
    <div>
        <h1 className="">Noting</h1>
        <h2>Nothing here yet...</h2>
        <h3>postID:</h3>
        <h3>{postID}</h3>
        <Post/>
    </div>
    );
}
