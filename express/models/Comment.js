const { faker } = require("@faker-js/faker");

module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        comment_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "posts",
                key: "post_id"
            }
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onDelete: "CASCADE",
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
        comment_text: {
            type: DataTypes.STRING(10000)
        },
        file_url: {
            type: DataTypes.STRING(100)
        }
    };

    const options = {
        sequelize,
        tableName: "comments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    };

    class Comment extends Model {
        static async getComments(post_id, limit) {
            const res = await sequelize.query(`SELECT * FROM comments WHERE post_id = ? LIMIT ?`, {
                replacements: [post_id, limit]
            });
            return res[0];
        }

        static async generate() {
            //Retrieve a list of PostIDs from the database
            const resPosts = await sequelize.query(`SELECT post_id FROM posts`);
            //Retrieve a list of Users from the database
            const resUsers = await sequelize.query(`SELECT user_id, username FROM users`);

            const numberOfPosts = resPosts[0].length;
            const numberOfUsers = resUsers[0].length;

            //Pick a random post from the database
            const randomPostIndex = (Math.floor(Math.random() * (numberOfPosts - 2 + 1)) + 2) - 1;
            const postID = resPosts[0][randomPostIndex].post_id;
             //Pick a random user from the database (comment owner)
            const randomUserIndex = (Math.floor(Math.random() * (numberOfUsers - 2 + 1)) + 2) - 1;
            const userID = resUsers[0][randomUserIndex].user_id;
            const username = resUsers[0][randomUserIndex].username;

            return {
                post_id: postID,
                user_id: userID,
                username: username,
                comment_text: faker.lorem.paragraph(),
                file_url: ``
            };
        }
    }

    Comment.init(columns, options);

    Comment.afterUpdate(async (comment) => {
        comment.updated_at = DataTypes.NOW;
    });
};
