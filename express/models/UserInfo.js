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
            type: DataTypes.STRING(100)
            // defaultValue: A standard anonymous avatar
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

    const options = { sequelize };

    class UserInfo extends Model {
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
