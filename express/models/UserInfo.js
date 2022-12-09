const { faker } = require("@faker-js/faker");

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
        profile_pic_url: {
            type: DataTypes.STRING(300),
            defaultValue: "/media/users/00000000-0000-0000-0000-000000000000/blank-profile-pic.webp",
        },
        given_name: {
            type: DataTypes.STRING(35)
        },
        last_name: {
            type: DataTypes.STRING(35)
        },
        bio: {
            type: DataTypes.TEXT
        },
        date_of_birth: {
            type: DataTypes.DATEONLY
        },
        country: {
            type: DataTypes.TEXT
        },
        city: {
            type: DataTypes.TEXT
        },
        website: {
            type: DataTypes.TEXT
        }
    };

    const options = { sequelize, tableName: "users_info" };

    class UserInfo extends Model {
        static async getProfilePicUrl(user_id) 
        {
            const res = await sequelize.query(`SELECT profile_pic_url FROM users_info WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }

        static generate() {
            return {
                user_id,
                profile_pic: faker.image.avatar(),
                given_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                bio: faker.lorem.paragraph(),
                date_of_birth: faker.date.birthdate(),
                country: faker.address.country(),
                city: faker.address.city(),
                website: faker.internet.url()
            };
        }
    }

    UserInfo.init(columns, options);
};
