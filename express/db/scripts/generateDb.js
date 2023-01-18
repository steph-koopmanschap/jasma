/*
    This script is for auto generating random users, posts, and comments in the database.
    This is for testing purposes only.
*/

//const { SqlConnection } = require("../connections/SqlConnection");
const db = require("../connections/jasmaAdmin");
const { User, Post, Comment, Hashtag, PostHashtag} = db.models;

async function createUsers(n) {
    for (let i = 0; i < n; i++) {
        await User.create(User.generate());
    }
};

async function generateHashtags(n) {
    for (let i = 0; i < n; i++) {
        await Hashtag.create(Hashtag.generate());
    }
};

async function generatePosts(n) {
    for (let i = 0; i < n; i++) {
        await Post.create(await Post.generate());
    }
};

async function generatePostHashtags(n) {
    for (let i = 0; i < n; i++) {
        await PostHashtag.create(await PostHashtag.generate());
    }
};

async function generateComments(n) {
    for (let i = 0; i < n; i++) {
        await Comment.create(await Comment.generate());
    }
};

createUsers(100);
generateHashtags(100);
generatePosts(100);
generatePostHashtags(100);
generateComments(100);
