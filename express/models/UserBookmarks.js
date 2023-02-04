
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
        tableName: "user_bookmarks",
        timestamps: false,
    };

    class UserBookmarks extends Model {

    }

    UserBookmarks.init(columns, options);
};

