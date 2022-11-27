const { UserInfo } = require("./UserInfo");
const { UserMetadata } = require("./UserMetadata");
const { UserPreferences } = require("./UserPreferences");
const db = require("../sequelize/sequelizeConnect");
const { DataTypes } = require("sequelize");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

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
    user_password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    recovery_phone: {
        type: DataTypes.STRING(20)
    }
};

const options = { db, indexes: [{ fields: ["username"] }, { fields: ["email"] }] };

class User extends Model {
    static async getUserByEmail(email) {
        const res = await db.query(`SELECT * FROM users WHERE email = ?`, { replacements: [email] });
        console.log(res);
    }
}

User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.user_password, 10);
    user.user_password = hashedPassword;
});

User.afterCreate(async (user) => {
    const { user_id } = user;
    await UserInfo.create({ user_id });
    await UserMetadata.create({ user_id });
    await UserPreferences.create({ user_id });
});

User.init(columns, options);
// const User = db.define(
//     "users",
//     {
//         user_id: {
//             type: DataTypes.UUID,
//             primaryKey: true,
//             defaultValue: DataTypes.UUIDV4
//         },
//         username: {
//             type: DataTypes.STRING(25),
//             unique: true,
//             allowNull: false,
//             validate: {
//                 len: [3, 25]
//             }
//         },
//         email: {
//             type: DataTypes.STRING(50),
//             unique: true,
//             allowNull: false,
//             validate: {
//                 isEmail: true
//             }
//         },
//         recovery_email: {
//             type: DataTypes.STRING(50),
//             validate: {
//                 isEmail: true
//             }
//         },
//         user_password: {
//             type: DataTypes.STRING(60),
//             allowNull: false
//         },
//         phone: {
//             type: DataTypes.STRING(20)
//         },
//         recovery_phone: {
//             type: DataTypes.STRING(20)
//         }
//     },
//     {
//         indexes: [{ fields: ["username"] }, { fields: ["email"] }]
//     }
// );

// async function createUser(newUser) {
//     const user = await User.create(newUser);
//     return user;
// }

// async function getUserByEmail(email) {
//     const res = await db.query(`SELECT * FROM users WHERE email = ?`, { replacements: [email] });
//     return res[0][0];
// }

// async function getUserById(user_id) {
//     const res = await db.query(`SELECT * FROM users WHERE user_id = ?`, { replacements: [user_id] });
//     return res[0][0];
// }

// async function getUserByName(username) {
//     const res = await db.query(`SELECT * FROM users WHERE username = ?`, { replacements: [username] });
//     return res[0][0];
// }

// async function updateUser(updatedUser) {
//     const user = User.update(updatedUser);
//     return user;
// }

function generateUser() {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        recovery_email: faker.internet.email(),
        user_password: "a", //faker.internet.password(),
        phone: faker.phone.number("###-###-####"),
        recovery_phone: faker.phone.number("###-###-####")
    };
}

module.exports = { User };
