import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import api from "../../clientAPI/api.js";
import Post from '../../components/Post';

//Shows a specific single post on a page
export default function PostPage() {
    const router = useRouter();
    const { postID } = router.query;

    const { status, isLoading, isError, data, error, refetch } = useQuery([`post_${postID}`], 
    async () => { 
        return await api.getSinglePost(postID);
    },
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (isLoading) {
        return (<h1>Retrieving post...</h1>);
    }

    if (!data || data?.success === false) {
        return (<h1>Post not found.</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    return (
        <div>
            <Post postData={data.posts[0]} />
        </div>
    );
}
