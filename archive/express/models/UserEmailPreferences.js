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
        comment_on_post_notif: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        new_follower_notif: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    };

    const options = { sequelize, tableName: "users_email_preferences" };
    class UserEmailPreferences extends Model {}
    UserEmailPreferences.init(columns, options);
};
