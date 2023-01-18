const { faker } = require("@faker-js/faker");

module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: true
        }
    };

    const options = { sequelize, tableName: "hashtags" };

    class Hashtag extends Model {
        static generate() {

            return {
                hashtag: faker.random.word()
            };
        }
    }

    Hashtag.init(columns, options);
};
