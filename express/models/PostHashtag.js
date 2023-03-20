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

        //Get the most frequently used hashtags ordered from highest to lowest
        static async getTopHashtags(limit) {
            const resHashtags = await sequelize.query(`SELECT hashtag, COUNT(*) as count 
                                                       FROM posts_hashtags
                                                       GROUP BY hashtag 
                                                       ORDER BY count DESC
                                                       LIMIT ?`, 
                                                       { replacements: [limit] }
                                                     );
            return resHashtags[0];
        }

        //Returns a count of how many times a hashtag appears in posts.
        static async getHashtagCount(hashtag) {
            const resCount = await sequelize.query(`SELECT COUNT(*) AS count FROM posts_hashtags where hashtag = ?;`, { replacements: [hashtag] });
            return resCount[0][0].count;
        }

        static async generate() {
            //Retrieve a list of PostIDs from the database
            const resPosts = await sequelize.query(`SELECT post_id FROM posts`);
            //Retrieve a list of Hashtags from the database
            const resHashtags = await sequelize.query(`SELECT hashtag FROM hashtags`);

            const numberOfPosts = resPosts[0].length;
            const numberOfHashtags = resHashtags[0].length;

            //Pick a random post from the database
            const randomPostIndex = Math.floor(Math.random() * numberOfPosts);
            const postID = resPosts[0][randomPostIndex].post_id;
            //Pick a random hashtag from the database
            const randomHashtagIndex = Math.floor(Math.random() * numberOfHashtags);
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
