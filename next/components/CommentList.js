import React, { useState, useEffect } from 'react';
import Comment from "./Comment";

export default function CommentList() {
    const [comments, setComments] = useState([]);

    //Load comments here?
    useEffect(() => {
        
    }, [])

    return ( 
        <div>
            {/* {comments.map((comment) => (
                <Comment
                    commentData={comment.commentData}
                />
            ))} */}
        </div>
    );
}
