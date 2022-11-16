const db = require("../db/dbConfig");
//const formatDateToStr = require("../utils/formatDateToStr.js");

/* 
    Test user data
    Which has consistent and expected data
    This test user should not exist in production DB
    Only for development and testing
*/

testUser = {
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    username: 'test',
    email: 'testuser@jasma.com',
    recovery_email: 'testuser2@jasma.com',
    user_password: 'test123',
    phone: '0123456789',
    recovery_phone: '9876543210'
};

testUserInfo = {
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    profile_pic: null,
    given_name: 'Test User',
    last_name: 'of JASMA',
    bio: 'Hi, I am a the test user of JASMA',
    date_of_birth: '1990-01-01',
    country: 'USA',
    city: 'New York',
    website: 'https://jasma.vercel.app/'
};

testUserMetadata = {
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    user_role: 'normal',
    last_login_date: '2022-11-16',
    account_creation_date: '2022-01-01',
    isVerified_email: true,
    last_ip4: '127.0.0.1'
};

testUserPreferences = {
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    email_notifications: false
};

testUserPost = {
    post_id: '3872fb15-7320-4918-a7be-1a4e6a6d80a1',
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    text_content: 'Hi, this is my first test post as a test user',
    file_content: null,
    created_at: new Date().toISOString(),
    last_edit_at: new Date().toISOString()
};

testUserPostHashtag = {
    post_id: '3872fb15-7320-4918-a7be-1a4e6a6d80a1',
    hashtag: 'test'
};

testUserPostComment = {
    comment_id: 'c831eed4-8b83-4fbc-8aec-62bb4d0593ed',
    post_id: '3872fb15-7320-4918-a7be-1a4e6a6d80a1',
    user_id: '6ecb8f02-b29d-433f-9f5e-e84fd8da66a9',
    comment_text: 'Hi, this is my first comment as a test user.',
    comment_file: null,
    created_at: new Date().toISOString()
};

//Provide a reliable consistent test user in the database
async function createTestUser() {
    //core user data
    let core = await db.query(
        `
        INSERT INTO users(user_id, username, email, recovery_email, user_password, phone, recovery_phone)
        VALUES (
            $1::uuid,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        `,
        [testUser.user_id, testUser.username, testUser.email, testUser.recovery_email, testUser.user_password, testUser.phone, testUser.recovery_phone]
    );

    let info = await db.query(
        `
        INSERT INTO users_info(user_id, profile_pic, given_name, last_name, bio, date_of_birth, country, city, website)
        VALUES (
            $1::uuid,
            $2,
            $3,
            $4,
            $5,
            $6::date,
            $7,
            $8,
            $9
        )
        `,
        [testUserInfo.user_id, testUserInfo.profile_pic, testUserInfo.given_name, testUserInfo.last_name, testUserInfo.bio, testUserInfo.date_of_birth, testUserInfo.country, testUserInfo.city, testUserInfo.website]
    );

    let metadata = await db.query(
        `
        INSERT INTO users_metadata(user_id, user_role, last_login_date, account_creation_date, isVerified_email, last_ip4)
        VALUES (
            $1::uuid,
            $2,
            $3::date,
            $4::date,
            $5,
            $6
        )
        `,
        [testUserMetadata.user_id, testUserMetadata.user_role, testUserMetadata.last_login_date, testUserMetadata.account_creation_date, testUserMetadata.isVerified_email, testUserMetadata.last_ip4]
    );

    let preferences = await db.query(
        `
        INSERT INTO users_preferences(user_id, email_notifications)
        VALUES (
            $1::uuid,
            $2
        )
        `,
        [testUserPreferences.user_id, testUserPreferences.email_notifications]
    );

    let post = await db.query(
        `
        INSERT INTO posts(post_id, user_id, text_content, file_content, created_at, last_edit_at)
        VALUES (
            $1::uuid,
            $2::uuid,
            $3
            $4,
            $5::timestamp,
            $6::timestamp
        )
        `,
        [testUserPost.post_id, testUserPost.user_id, testUserPost.text_content, testUserPost.file_content, testUserPost.created_at, testUserPost.last_edit_at]
    );

    let postHashtag = await db.query(
        `
        INSERT INTO posts_hashtags(post_id, hashtag)
        VALUES (
            $1::uuid,
            $2
        )
        `,
        [testUserPostHashtag.post_id, testUserPostHashtag.hashtag]
    );

    let hashtag = await db.query(
        `
        INSERT INTO hashtags(hashtag)
        VALUES (
            $1
        )
        `,
        [testUserPostHashtag.hashtag]
    );

    let comment = await db.query(
        `
        INSERT INTO comments(comment_id, post_id, user_id, comment_text, comment_file, created_at)
        VALUES (
            $1::uuid,
            $2::uuid,
            $3::uuid,
            $4,
            $5,
            $6::timestamp
        )
        `,
        [testUserPostComment.comment_id, testUserPostComment.post_id, testUserPostComment.user_id, testUserPostComment.comment_text, testUserPostComment.comment_file, testUserPostComment.created_at]
    );
}

module.exports = {
    createTestUser,
    testUser,
    testUserInfo,
    testUserMetadata,
    testUserPreferences,
    testUserPost,
    testUserPostHashtag,
    testUserPostComment
};

