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
            const res = await sequelize.query(`SELECT * FROM users_following WHERE user_id = ?`, { replacements: [user_id] });
            const count = await sequelize.query(`SELECT COUNT(*) FROM users_following WHERE user_id = ?`, { replacements: [user_id] });
            
            return {
                following: res[0],
                followingCount: count[0][0]
            }
        }

        static async getFollowers(user_id)
        {
            return user_id;
        }

        //Check if userID 1 is following userID two
        static async isFollowing(userID_one, userID_two) {
            if (userID_two === undefined || userID_two === 'undefined' || userID_two === false) {
                return false;
            }
            const res = await sequelize.query(`SELECT * FROM users_following WHERE user_id = ? AND follow_id = ?`, { replacements: [userID_one, userID_two] });
            console.log(res);
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
                const randomUserOne = (Math.floor(Math.random() * (numberOfUsers - 3 + 1)) + 3) - 1;
                const randomUserTwo = (Math.floor(Math.random() * (numberOfUsers - 3 + 1)) + 3) - 1;
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
