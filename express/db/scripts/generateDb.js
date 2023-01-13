//const { SqlConnection } = require("../connections/SqlConnection");
const db = require("../connections/jasmaAdmin");
const { User, Post} = db.models;

async function createUsers(n) {
    for (let i = 0; i < n; i++) {
        await User.create(User.generate());
    }
};

async function generatePosts(n) {
    for (let i = 0; i < n; i++) {
        await Post.create(Post.generate());
        //await Post.generate();
    }
};

generatePosts(1);
//createUsers(100);
