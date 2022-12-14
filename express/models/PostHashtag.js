module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: "hashtags",
                key: "hashtag"
            }
        },
        post_id: {
            type: DataTypes.UUID,
            onDelete: "CASCADE",
            references: {
                model: "posts",
                key: "post_id"
            }
        }
    };

    const options = { sequelize, tableName: "posts_hashtags" };

    class PostHashtag extends Model {}

    PostHashtag.init(columns, options);
};
