const db = require("../sequelize/sequelizeConnect");
const { DataTypes } = require("sequelize");

const UserMetadata = db.define("users_metadata", {
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
    user_role: {
        type: DataTypes.STRING(10),
        defaultValue: "normal",
        allowNull: false,
        validate: {
            isIn: [["guest", "normal", "mod", "admin"]]
        }
    },
    last_login_date: {
        type: DataTypes.DATEONLY
    },
    account_creation_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    isverified_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    last_ipv4: {
        type: DataTypes.STRING(55)
    }
});

module.exports = { UserMetadata };
