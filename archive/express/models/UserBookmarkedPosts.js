
module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: false,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "users",
                key: "user_id"
            }
        },
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "posts",
                key: "post_id"
            }
        }
    };

    const options = {
        sequelize,
        tableName: "user_bookmarked_posts",
        timestamps: false,
    };

    class UserBookmarkedPosts extends Model {

    }

    UserBookmarkedPosts.init(columns, options);
};

