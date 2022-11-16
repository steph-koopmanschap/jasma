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
    test_content: 'Hi, this is my first test post as a test user',
    file_content: null,
    created_at: new Date.now().toISOString(),
    last_edit_at: new Date.now().toISOString()
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

async function createTestUser() {

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

