module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        hashtag: {
            type: DataTypes.STRING(50),
            primaryKey: false,
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
            //Retrieve a list of PostIDs from the database
            const resPosts = await sequelize.query(`SELECT post_id FROM posts`);
            //Retrieve a list of Hashtags from the database
            const resHashtags = await sequelize.query(`SELECT hashtag FROM hashtags`);

            const numberOfPosts = resPosts[0].length;
            const numberOfHashtags = resHashtags[0].length;

            //Pick a random post from the database
            const randomPostIndex = (Math.floor(Math.random() * (numberOfPosts - 2 + 1)) + 2) - 1;
            const postID = resPosts[0][randomPostIndex].post_id;
            //Pick a random hashtag from the database
            const randomHashtagIndex = (Math.floor(Math.random() * (numberOfHashtags - 2 + 1)) + 2) - 1;
            const hashtag = resHashtags[0][randomHashtagIndex].hashtag;

            //Check if the hashtag a

            return {
                hashtag: hashtag,
                post_id: postID
            };
        }
    }

    PostHashtag.init(columns, options);
};
