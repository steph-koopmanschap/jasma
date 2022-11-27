module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        comment_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: "posts",
                key: "post_id"
            }
        },
        comment_text: {
            type: DataTypes.STRING(10000)
        },
        file_url: {
            type: DataTypes.STRING(100)
        }
    };

    const options = {
        sequelize,
        tableName: "comments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    };

    class Comment extends Model {
        static async getComments(post_id, limit) {
            const res = await db.query(`SELECT * FROM comments WHERE post_id = ? LIMIT = ?`, {
                replacements: [post_id, limit]
            });
            return res[0][0];
        }
    }

    Comment.init(columns, options);

    Comment.afterUpdate(async (comment) => {
        comment.updated_at = DataTypes.NOW;
    });
};
