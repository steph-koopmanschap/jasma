/*
    This script is for auto generating random users, posts, and comments in the database.
    This is for testing purposes only.
*/

const args = process.argv.slice(2);
const n = args[0]

//const { SqlConnection } = require("../connections/SqlConnection");
const db = require("../connections/jasmaAdmin");
const { User, Post, Comment, Hashtag, PostHashtag, UserFollowing, ReportedPost} = db.models;

async function createUsers(n) {
    for (let i = 0; i < n; i++) {
        await User.create(User.generate());
    }
};

async function generateHashtags(n) {
    for (let i = 0; i < n; i++) {
        await Hashtag.create(await Hashtag.generate());
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

async function generateFollowers(n) {
    for (let i = 0; i < n; i++) {
        await UserFollowing.create(await UserFollowing.generate());
    }
};

async function generateReportedPosts(n) {
    for (let i = 0; i < n; i++) {
        await ReportedPost.create(await ReportedPost.generate());
    }
};

async function generateDb(n) {
    console.log(`GENERATING ${n} users, ${n*2} posts, ${n*4} comments, ${n*3} followers and ${Math.floor(n * 0.5)} reported posts...`);
    await createUsers(n);
    await generateHashtags(n * 3);
    await generatePosts(n * 2);
    await generatePostHashtags(n * 2);
    await generateComments(n * 4);
    await generateReportedPosts(Math.floor(n * 0.5)) //25% of posts
    await generateFollowers(n * 3); 
    console.log(`Generation complete.`);
}

generateDb(n);
