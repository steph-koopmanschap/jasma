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
            //randomLimit is beteen 3 and 50 (INT)
            const randomLimit = Math.floor(Math.random() * (50 - 3 + 1)) + 3;
            //Retrieve a list of PostIDs from the database
            const resPost = await sequelize.query(`SELECT post_id FROM posts LIMIT ?`, { replacements: [randomLimit] });
            //Retrieve a list of Users from the database
            const resUser = await sequelize.query(`SELECT user_id, username FROM users LIMIT ?`, { replacements: [randomLimit] });

            //Pick a random post from the database
            const random = (Math.floor(Math.random() * (randomLimit - 1 + 1)) + 1) - 1;
            const postID = resPost[0][random].post_id;
            //Pick a random User from the database (owner of the comment)
            const userID = resUser[0][random].user_id;
            const username = resUser[0][random].username;

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
