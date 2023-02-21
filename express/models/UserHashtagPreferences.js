module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: false,
            references: {
                model: "hashtags",
                key: "hashtag"
            }
        },
        user_id: {
            type: DataTypes.UUID,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "user_id"
            }
        }
    };

    const options = { sequelize, tableName: "users_hashtags_preferences" };
    class UserHashtagPreferences extends Model {}
    UserHashtagPreferences.init(columns, options);
};
