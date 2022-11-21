const db = require("../sequelize/sequelizeConnect");
const { DataTypes } = require("sequelize");

const UserPreferences = db.define("users_preferences", {
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
});

module.exports = { UserPreferences };
