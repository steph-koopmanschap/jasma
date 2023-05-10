module.exports = (sequelize, DataTypes, Model) => {
    //Only the combination of hashtag and user_id should be considered a UNIQUE value.
    //Multiple of the same hashtags and multiple of the same user_id can exist in the table.
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: "hashtags",
                key: "hashtag"
            }
        },
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "user_id"
            }
        }
    };

    const options = { sequelize, tableName: "users_hashtags_preferences" };
    class UserHashtagPreferences extends Model {
        
        static async getSubscribedHashtags(user_id) {
            const resHashtags = await sequelize.query(`SELECT hashtag FROM users_hashtags_preferences WHERE user_id = ?`, { replacements: [user_id] });

            return resHashtags[0];
        }

        static async generate() {
            
        }
    }
    UserHashtagPreferences.init(columns, {
        ...options,
        primaryKey: ["hashtag", "user_id"] // define composite primary key
    });
};
