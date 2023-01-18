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

        static async generate() {
            //randomLimit is beteen 3 and 50 (INT)
            const randomLimit = Math.floor(Math.random() * (50 - 3 + 1)) + 3;
            //Retrieve a list of userIDs from the database
            const res = await sequelize.query(`SELECT user_id, username FROM users LIMIT ?`, { replacements: [randomLimit] });

            //Pick a random userID from the database
            const randomUser = (Math.floor(Math.random() * (randomLimit - 1 + 1)) + 1) - 1;

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
