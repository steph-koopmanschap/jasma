import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import Comment from "./Comment";

export default function CommentList(props) {
    const { postID } = props;
    const [comments, setComments] = useState([]);

    const { status, isLoading, isError, data, error, refetch } = useQuery([`comments_${postID}`], 
    async () => {return await api.getComments(postID, 25)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    // useEffect(() => {
        
    // }, [])

    if (isLoading) {
        return (<h1>Retrieving comments...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return ( 
        <div>
            <p className="text-black">Comments: {data.commentCount}</p>
            {data.comments.map((comment) => (
                <Comment
                    key={comment.comment_id}
                    commentData={comment}
                />
            ))}
        </div>
    );
}
