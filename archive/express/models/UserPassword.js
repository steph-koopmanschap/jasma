const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        user_email: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            validate: {
                isEmail: true
            },
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "email"
            }
        },
        user_password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    };
    const options = { sequelize, tableName: "users_passwords" };

    class UserPassword extends Model {
        static async compare(email, password) {
            const { user_password } = await this.findByEmail(email);
            const isCorrectPassword = await bcrypt.compare(password, user_password);
            return isCorrectPassword;
        }

        static async findByEmail(email) {
            const res = await sequelize.query(`SELECT * FROM users_passwords WHERE user_email = ?`, {
                replacements: [email]
            });
            return res[0][0];
        }

        static async hashPassword(password) {
            let hashedPassword = "";
            try {
                hashedPassword = await bcrypt.hash(password, 10);
                //return hashedPassword;
            } catch (e) {
                throw new Error(e.message);
            }

            return hashedPassword;
        }
    }

    UserPassword.init(columns, options);

    UserPassword.beforeCreate(async (entry) => {
        const hashedPassword = await UserPassword.hashPassword(entry.user_password);
        entry.user_password = hashedPassword;
    });
};
