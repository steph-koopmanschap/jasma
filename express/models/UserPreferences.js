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
        email_notifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    };

    const options = { sequelize, tableName: "users_preferences" };
    class UserPreferences extends Model {}
    UserPreferences.init(columns, options);
};
