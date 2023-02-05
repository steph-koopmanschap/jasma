const { faker } = require("@faker-js/faker");

module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING(25),
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 25]
            }
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        recovery_email: {
            type: DataTypes.STRING(50),
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        recovery_phone: {
            type: DataTypes.STRING(20)
        }
    };

    const options = {
        sequelize,
        tableName: "users",
        indexes: [{ fields: ["username"] }, { fields: ["email"] }]
    };

    class User extends Model {
        static async getByEmail(email) {
            const res = await sequelize.query(`SELECT * FROM users WHERE email = ?`, { replacements: [email] });
            return res[0][0];
        }

        static async getById(user_id) {
            console.log("user_id from User.getById", user_id);
            const res = await sequelize.query(`SELECT * FROM users WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }

        static async getByUsername(username) {
            const res = await sequelize.query(`SELECT * FROM users WHERE username = ?`, { replacements: [username] });
            return res[0][0];
        }

        static generate() {
            return {
                username: faker.internet.userName(),
                email: faker.internet.email(),
                recovery_email: faker.internet.email(),
                user_password: "a", //faker.internet.password(),
                phone: faker.phone.number("###-###-####"),
                recovery_phone: faker.phone.number("###-###-####")
            };
        }
    }

    User.init(columns, options);

    User.afterCreate(async (user) => {
        const { user_id } = user;
        const t = await sequelize.transaction();
        try {
            await sequelize.models.UserInfo.create({ user_id });
            await sequelize.models.UserMetadata.create({ 
                user_id: user_id, 
            });
            await sequelize.models.UserPreferences.create({ user_id });
        } catch (err) {
            console.log(err);
            await t.rollback();
        }
    });
};
