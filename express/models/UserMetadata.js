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
    };

    const options = {
        sequelize,
        tableName: "users_metadata",
        timestamps: true,
        createdAt: "account_creation_date",
        updatedAt: false
    };

    class UserMetadata extends Model {
        static async getById(user_id) {
            const res = await sequelize.query(`SELECT * FROM users_metadata WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }
    }
    UserMetadata.init(columns, options);
};
