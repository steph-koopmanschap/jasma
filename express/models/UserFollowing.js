module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "user_id"
            }
        },
        //user_id follows follow_id. follow_id is followed by user_id
        follow_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "user_id"
            }
        }
    };

    const options = { sequelize, tableName: "users_following" };

    class UserFollowing extends Model {
        static async getFollowing(user_id)
        {
            const res = await sequelize.query(`SELECT follow_id AS user_id FROM users_following WHERE user_id = ?`, { replacements: [user_id] });
            const count = await sequelize.query(`SELECT COUNT(*) FROM users_following WHERE user_id = ?`, { replacements: [user_id] });
            //Retrieve the username of each userID and add it to the data
            for (let i = 0; i < res[0].length; i++)
            { 
                const user = await sequelize.query(`SELECT username FROM users WHERE user_id = ?`, { replacements: [res[0][i].user_id] });
                res[0][i].username = user[0][0].username;
            }
            
            return {
                following: res[0],
                followingCount: count[0][0].count
            }
        }

        static async getFollowers(follow_id)
        {
            const res = await sequelize.query(`SELECT user_id FROM users_following WHERE follow_id = ?`, { replacements: [follow_id] });
            const count = await sequelize.query(`SELECT COUNT(*) FROM users_following WHERE follow_id = ?`, { replacements: [follow_id] });
            //Retrieve the username of each userID and add it to the data
            for (let i = 0; i < res[0].length; i++)
            { 
                const user = await sequelize.query(`SELECT username FROM users WHERE user_id = ?`, { replacements: [res[0][i].user_id] });
                res[0][i].username = user[0][0].username;
            }

            return {
                followers: res[0],
                followersCount: count[0][0].count
            }
        }

        //Check if userID 1 is following userID two
        static async isFollowing(userID_one, userID_two) {
            if (userID_two === undefined || userID_two === 'undefined' || userID_two === false) {
                return false;
            }
            const res = await sequelize.query(`SELECT * FROM users_following WHERE user_id = ? AND follow_id = ?`, { replacements: [userID_one, userID_two] });
            //Alternative: Using COUNT(*) instead of selecting all columns. Suggested by ChatGPT
            //const res = await sequelize.query(`SELECT COUNT(*) as count FROM users_following WHERE user_id = ? AND follow_id = ?`, { replacements: [userID_one, userID_two] });
            //return Boolean(res[0][0].count);
            
            if (res[0].length === 0) {
                return false;
            }
            return true;
        }

        static async generate(n) {
            //Retrieve a list of UserIDs from the database
            const res = await sequelize.query(`SELECT user_id FROM users`);
            const numberOfUsers = res[0].length;

            let userID_one = "";
            let userID_two = "";
            while(userID_one === userID_two)
            {
                //Pick two random user IDs from the database
                const randomUserOne = Math.floor(Math.random() * numberOfUsers);
                const randomUserTwo = Math.floor(Math.random() * numberOfUsers);
                userID_one = res[0][randomUserOne].user_id;
                userID_two = res[0][randomUserTwo].user_id;
            }

            return {
                user_id: userID_one,
                follow_id: userID_two
            };
        }
    }

    UserFollowing.init(columns, options);
};
