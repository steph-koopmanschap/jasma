module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "posts",
                key: "post_id"
            }
        },
        report_reason: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        reported_x_times: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    };

    const options = {
        sequelize,
        tableName: "reported_posts",
        timestamps: true,
        createdAt: "report_time",
        updatedAt: false
    };
    
    class ReportedPost extends Model {

        static async getReports(limit = 0) {
            let resReports = null;
            if (limit > 0) {
                resReports = await sequelize.query(`SELECT * FROM reported_posts ORDER BY report_time ASC LIMIT ?`, { replacements: [limit] });
            }
            else {
                resReports = await sequelize.query(`SELECT * FROM reported_posts ORDER BY report_time ASC`);
            }
            return resReports[0];
        }

        static async getById(post_id) {
            const resReport = await sequelize.query(`SELECT * FROM reported_posts WHERE post_id = ?  `, { replacements: [post_id] });
            return resReport[0][0];
        }

        static async generate() {
            //Retrieve a list of postIDs from the database
            const resPosts = await sequelize.query(`SELECT post_id FROM posts`);
            const numberOfPosts = resPosts[0].length;

            let randomPost = Math.floor(Math.random() * numberOfPosts);
            let postID = ""

            let postID_alreadyExists = true;
            //Keep generating postIDs until a hashtag is made that does not exist in the database yet.
            //Because postIDs are UNIQUE values.
            while (postID_alreadyExists === true)
            {
                //create random postID
                randomPost = Math.floor(Math.random() * numberOfPosts);
                postID = resPosts[0][randomPost].post_id;
                //Check if the postID exists in the database
                const resReports = await sequelize.query(`SELECT post_id FROM reported_posts WHERE post_id = ?`, { replacements: [postID] });
                //PostID does not exist
                if (resReports[0].length === 0) {
                    postID_alreadyExists = false;
                    //break;
                }
            }

            // Store a list of possible report reasons
            const reportReasons = [
                "This post is inappropriate",
                "This post contains spam",
                "This post violates the terms of service",
                "This post is hateful",
                "This post is misleading",
            ];

            //Select a random report reason
            const reportReason = reportReasons[Math.floor(Math.random() * reportReasons.length)];

            //Generate report
            return {
                post_id: postID,
                report_reason: reportReason,
                reported_x_times: Math.floor(Math.random() * 100) + 1 //Random integer between 1 and 100
            };
        }
    }

    ReportedPost.init(columns, options);
};
