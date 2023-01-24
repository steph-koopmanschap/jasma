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
        static async generate() {

            let hashtag = "";
            let hashtagAlreadyExists = true;
            //Keep generating hashtags until a hashtag is made that does not exist in the database yet.
            //Because hashtags are UNIQUE values.
            while (hashtagAlreadyExists === true)
            {
                //create random hashtag
                hashtag = faker.random.word().toLowerCase();
                //Check if the hashtag exists in the database
                const res = await sequelize.query(`SELECT hashtag FROM hashtags WHERE hashtag = ?`, { replacements: [hashtag] });
                //Hashtag does not exist
                if (res[0].length === 0) {
                    hashtagAlreadyExists = false;
                    //break;
                }
            }

            return {
                hashtag: hashtag
            };
        }
    }

    Hashtag.init(columns, options);
};
