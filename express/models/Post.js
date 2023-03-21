const { faker } = require("@faker-js/faker");

module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            }
        },
        username: {
            type: DataTypes.STRING(25),
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "username"
            }
        },
        text_content: {
            type: DataTypes.STRING(40000)
        },
        file_url: {
            type: DataTypes.STRING(100)
        },
        post_type: {
            type: DataTypes.STRING(5),
            defaultValue: "text",
            allowNull: false,
            validate: {
                isIn: [["text", "image", "video", "audio"]]
            }
        }
    };

    const options = {
        sequelize,
        tableName: "posts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "last_edited_at"
    };

    class Post extends Model {
        static async findByUserId(user_id, limit) {
            const res = await sequelize.query(`SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`, { replacements: [user_id, limit] });
            const posts = Post.attachHashtags(res[0]);

            return posts;
        }

        static async findByPostId(post_id) {
            let post = [];
            //Alternative if (!post_id) {return []};
            if (post_id === undefined || post_id === 'undefined' || post_id === false || post_id === "") {
                return [];
            }
            const res = await sequelize.query(`SELECT * FROM posts WHERE post_id = ?`, { replacements: [post_id] });
            post.push(res[0][0]);
            post = Post.attachHashtags(post);

            return post;
        }

        static async findByPostIds(post_ids) {
            let posts = [];
            for (let i = 0; i < post_ids.length; i++) {
                const post = await Post.findByPostId(post_ids[i]);
                posts.push(post[0]);
            }  
            return posts;
        }

        static async getPostOwner(post_id) {
            try {
                //Get the user_id, username, and display_name with the post_id
                // const res = await sequelize.query(`SELECT posts.user_id, users.username, users_info.display_name
                //                                    FROM posts
                //                                    JOIN users ON posts.user_id = users.user_id
                //                                    JOIN users_info ON posts.user_id = users_info.user_id
                //                                    WHERE posts.post_id = ?;`, 
                //                                    { replacements: [post_id] });

                const res = await sequelize.query(`SELECT posts.user_id, users.username, users_info.display_name FROM posts JOIN users ON posts.user_id = users.user_id JOIN users_info ON posts.user_id = users_info.user_id WHERE posts.post_id = ?;`, { replacements: [post_id] });

                console.log("res from getPostOwner", res);
                                                    
                return {
                    user_id: res[0][0].user_id,
                    username: res[0][0].username,
                    display_name: res[0][0].display_name
                };
            }
            catch (err) {
                console.error(err);
                return {
                    user_id: "",
                    username: "",
                    display_name: ""
                };
            }
        }

        //Get all the hashtags linked to post_id
        static async getHashtags(post_id) {
            const res = await sequelize.query(`SELECT hashtag FROM posts_hashtags WHERE post_id = ? LIMIT 5`, { replacements: [post_id] });
            const hashtags = [];
            //Turn hashtags into a simple array
            for (let i = 0; i < res[0].length; i++) 
            {
                hashtags.push(res[0][i].hashtag);
            }

            return hashtags;
        }

        //Attach hashtags to each post in a list of posts
        static async attachHashtags(posts) {
            for (let i = 0; i < posts.length; i++) 
            {
                posts[i].hashtags = await Post.getHashtags(posts[i].post_id);
            }

            return posts;
        }

        //Return the last posts sorted by date (most recent date first)
        static async getLatest(limit) {
            const res = await sequelize.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT ?`, { replacements: [limit] });
            const posts = await Post.attachHashtags(res[0]);
            
            return posts;
        }

        static async getNewsFeed(user_id) {
            //1. Get the all the people that this user follows
            const resFollowing = await sequelize.query(`SELECT follow_id AS user_id FROM users_following WHERE user_id = ?`, { replacements: [user_id] });
            let posts = [];

            //1.5 If user is not following anyone. Get the global newsfeed instead.
            if (resFollowing[0].length === 0) {
                posts = await Post.getLatest(25);
                return posts;
            }

            for (let i = 0; i < resFollowing[0].length; i++)
            {
                //2. Get the latest post of each person
                const resPost = await sequelize.query(`SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`, { replacements: [resFollowing[0][i].user_id] });
                //2.5 The user has not made any posts at all. Skip. (Probably unlikely)
                if (resPost[0].length === 0) {
                    continue;
                }
                //3. Combine all posts into a list
                posts.push(resPost[0][0]);
            }

            //4. If posts from followers is not enough
            //   Either get posts from global (implemented) or get more posts from other users. (not implemented)
            let additionalPosts = [];
            if (posts.length < 25) {
                additionalPosts = await Post.getLatest(25 - posts.length);
            }
            posts = posts.concat(additionalPosts);
            posts = await Post.attachHashtags(posts);

            return posts;
        }

        static async getBookmarkedPosts(user_id) {
            const resBookmarks = await sequelize.query(`SELECT post_id FROM user_bookmarks WHERE user_id = ?`, { replacements: [user_id] });
            const bookmarks = resBookmarks[0]; 
            const posts = [];

            //No bookmarks found exit early.
            if (bookmarks.length === 0) {
                return posts;
            }

            for (let i = 0; i < bookmarks.length; i++) {
                const resPost = await sequelize.query(`SELECT * FROM posts WHERE post_id = ?`, { replacements: [bookmarks[i].post_id] });
                posts.push(resPost[0]);
            }

            posts = await Post.attachHashtags(posts);
            
            return posts;
        }

        static async generate() {
            //Retrieve a list of UserIDs from the database
            const res = await sequelize.query(`SELECT user_id, username FROM users`);

            const numberOfUsers = res[0].length;

            //Pick a random userID from the database
            const randomUser = Math.floor(Math.random() * numberOfUsers);

            const userID = res[0][randomUser].user_id;
            const username = res[0][randomUser].username;

            return {
                user_id: userID,
                username: username,
                text_content: faker.lorem.paragraph(),
                file_url: ``
            };
        }
    }

    Post.init(columns, options);
};
