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
        static async findByUserId(user_id) {
            const res = await sequelize.query(`SELECT * FROM posts WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }

        //Return the last posts sorted by date (most recent date first)
        static async getLatest(limit) {
            const res = await sequelize.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT ?`, { replacements: [limit] });
            return res[0];
        }

        static async generate() {
            //randomLimit is beteen 1 and 50 (INT)
            const randomLimit = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
            //Retrieve a list of userIDs from the database
            const res = await sequelize.query(`SELECT user_id FROM users LIMIT ?`, { replacements: [randomLimit] });

            // console.log("RES");
            // console.log(res);

            //Pick a random userID from the database
            const userID = res[0][Math.floor(Math.random() * (randomLimit - 1 + 1)) + 1].user_id;

            console.log("@@@USERID@@@");
            console.log(userID);

            return {
                user_id: userID,
                text_content: faker.lorem.paragraph(),
                file_url: ``
            };
        }
    }

    Post.init(columns, options);
};
