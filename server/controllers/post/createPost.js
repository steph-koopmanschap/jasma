//import crypto library for generating UUID
const crypto = require('crypto');
const pool = require("../../db/dbConnect.js");

// @TODO: STILL NEED TO ADD HASHTAGS!

//Create a new post for a user
//returns the newly created post
async function createPost(postData) {

    const postID = crypto.randomUUID();
    
    //created_at and last_edited_at will be the same for newly created posts
    let newPost = await pool.query(
        `
        INSERT INTO posts(post_id, user_id, text_content, file_content, created_at, last_edit_at)
        VALUES (
            $1::uuid,
            $2::uuid,
            $3,
            $4,
            $5,
            $6
        )
        `,
        [postID, postData.user_id, postData.text_content, postData.file_content, postData.created_at, postData.created_at]
    );

    if (!newPost) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //@ TODO:
    //1. Check if hashtag already exist in hashtags table
    //2. If hashtag already exist do not insert into hashtags table
    //3. insert not yet existing hashtags
    //4. Add all hashtags to the posts_hashtags table
    let blablabla = "??";
    const hashtagsArrayCopy = [...postData.hashtags];
    //1.???
    for (let i = 0; i < hashtagsArrayCopy.length; i++)
    {
        let checkHashtag = await pool.query(
            `
            SELECT hashtag
            FROM hashtags
            WHERE hashtag = $1
            `,
            [hashtagsArrayCopy[i]]
        );
        //2.???
        if (checkHashtag?.rows[0] === hashtagsArrayCopy[i])
        {
            //Remove hashtag. 
            //Left over hashtagsArrayCopy is all hashtags that are not in database yet
            hashtagsArrayCopy.splice(i, 1);
        }
    }
    //3.???
    for (let j = 0; j < hashtagsArrayCopy.length; j++)
    {
        let insertedHashtag = await pool.query(
            `
            INSERT INTO hashtags(hashtag)
            VALUES(
                $1
            )
            `,
            [hashtagsArrayCopy[i]]
        );
    }
    //4. ????
    for (let k = 0; k < postData.hashtags.length; k++)
    {
        let posts_hashtags = await pool.query(
            `
            INSERT INTO posts_hashtags(post_id, hashtag)
            VALUES(
                $1::uuid
                $2
            )
            `,
            [postID, postData.hashtags[i]]
        );
    }

    //add PostID to postData
    postData.post_id = postID;
     //Post created
    return postData;
    // return {
    //     post_id: postID,
    //     user_id: postData.user_id,
    //     text_content: postData.text_content,
    //     file_content: postData.file_content,
    //     created_at: postData.createdAt,
    //     last_edit_at: postData.createdAt,
    //     hashtags: postData.hashtags
    // };
}

module.exports = createPost;
