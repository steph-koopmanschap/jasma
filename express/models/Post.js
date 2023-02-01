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
            return res[0];
        }

        //Return the last posts sorted by date (most recent date first)
        static async getLatest(limit) {
            const res = await sequelize.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT ?`, { replacements: [limit] });
            return res[0];
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
            if (posts.length < 25) {
                additionalPosts = await Post.getLatest(25 - posts.length);
            }

            return posts;
        }

        static async generate() {
            //Retrieve a list of UserIDs from the database
            const res = await sequelize.query(`SELECT user_id, username FROM users`);

            const numberOfUsers = res[0].length;

            //Pick a random userID from the database
            const randomUser = (Math.floor(Math.random() * (numberOfUsers - 3 + 1)) + 3) - 1;

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
