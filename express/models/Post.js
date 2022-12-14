module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            }
        },
        text_content: {
            type: DataTypes.STRING(40000)
        },
        file_url: {
            type: DataTypes.STRING(100)
        }
    };

    const options = {
        sequelize,
        tableName: "posts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "last_edited_at"
    };

    class Post extends Model {
        static async findByUserId(user_id) {
            const res = await sequelize.query(`SELECT * FROM posts WHERE user_id = ?`, { replacements: [user_id] });
            return res[0][0];
        }
    }

    Post.init(columns, options);
};
