import React, { useState } from 'react';

export default function CreateComment() {
    const [commentData, setCommentData] = useState({
        comment_text: ""
    });

    const createComment = (e) => {
        //prevent page from refreshing
        e.preventDefault();

        console.log(commentData);
    }

    return (
        <div className="">
            <p>Write Comment...</p>
        </div>
    ); 
}
