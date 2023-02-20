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
            defaultValue: `${process.env.HOSTNAME}:${process.env.PORT}/media/avatars/default-profile-pic.webp`
            //defaultValue: "/media/users/00000000-0000-0000-0000-000000000000/profile-pic.webp",
        },
        given_name: {
            type: DataTypes.STRING(35)
        },
        last_name: {
            type: DataTypes.STRING(35)
        },
        display_name: {
            type: DataTypes.STRING(70)
        },
        bio: {
            type: DataTypes.TEXT
        },
        date_of_birth: {
            type: DataTypes.DATEONLY
        },
        gender: {
            type: DataTypes.STRING(11),
            validate: {
                isIn: [["woman", "man", "trans woman", "trans man", "other"]]
            }
        },
        relationship: {
            type: DataTypes.STRING(11),
            validate: {
                isIn: [["single", "married", "partnership", "open", "poly", "other"]]
            }
        },
        language: {
            type: DataTypes.TEXT
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

        static async getById(user_id)
        {
            const res = await sequelize.query(`SELECT * FROM users_info WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }

        static async getProfilePicUrl(user_id) 
        {
            const res = await sequelize.query(`SELECT profile_pic_url FROM users_info WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }

        static generate() {

            const given_name = faker.name.firstName();
            const last_name = faker.name.lastName();


            return {
                user_id,
                profile_pic: faker.image.avatar(),
                given_name: given_name,
                last_name: last_name,
                display_name: `${given_name} ${last_name}`,
                bio: faker.lorem.paragraph(),
                date_of_birth: faker.date.birthdate(),
                gender: "other",
                relationship: "single",
                country: faker.address.country(),
                city: faker.address.city(),
                website: faker.internet.url()
            };
        }
    }

    UserInfo.init(columns, options);
};
