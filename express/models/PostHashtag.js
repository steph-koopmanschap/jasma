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

    class PostHashtag extends Model {
        static async generate() {
            //randomLimit is beteen 1 and 50 (INT)
            const randomLimit = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
            //Retrieve a list of PostIDs from the database
            const resPost = await sequelize.query(`SELECT post_id FROM posts LIMIT ?`, { replacements: [randomLimit] });
            //Retrieve a list of Hashtags from the database
            const resHashtag = await sequelize.query(`SELECT hashtag FROM hashtags LIMIT ?`, { replacements: [randomLimit] });

            //Pick a random post from the database
            const random = Math.floor(Math.random() * (randomLimit - 1 + 1)) + 1;
            const postID = resPost[0][random].post_id;
            //Pick a random hashtag from the database (owner of the comment)
            const hashtag = resHashtag[0][random].hashtag;

            return {
                hashtag: hashtag,
                post_id: postID
            };
        }
    }

    PostHashtag.init(columns, options);
};
