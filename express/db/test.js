const db = require("./connections/jasmaAdmin");
const { faker } = require("@faker-js/faker");
const { User, UserPassword, Post } = db.models;
async function run() {
    // creates user
    const user = await User.create({
        username: faker.internet.userName(),
        email: faker.internet.email()
    });
    console.log("CREATES USER", user.dataValues);

    // gets user by username
    const fetchedUser = await User.getByUsername(user.username);
    console.log("GETS USER", fetchedUser);

    // creates user password
    const password = "Ubuntu76";
    const userPassword = await UserPassword.create({ user_email: user.email, user_password: password });
    console.log("CREATES PASSWORD", userPassword.dataValues);

    // compares user password with user stored password
    const isCorrectPassword = await UserPassword.compare(user.email, password);
    console.log("COMPARES PASSWORD", isCorrectPassword);

    // creates post
    const post = await Post.create({ user_id: user.user_id, text_content: faker.lorem.paragraph() });
    console.log("CREATS A POST", post.dataValues);

    // gets post by user_id
    const fetchPost = await Post.findByUserId(user.user_id);
    console.log("GETS A POST BY USER ID", fetchPost);

    //updates post
    const updatedPost = await Post.update(
        { text_content: "I was just updated" },
        { where: { user_id: user.user_id }, returning: true, plain: true }
    );
    console.log("UPDATES A POST", updatedPost[1].dataValues);
}

run();
