module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: true
        }
    };

    const options = { sequelize, tableName: "hashtags" };

    class Hashtag extends Model {}

    Hashtag.init(columns, options);
};
