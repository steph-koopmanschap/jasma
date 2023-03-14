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
            console.log("resReport: ", resReport);
            console.log("resReport[0][0]: ", resReport[0][0]);
            return resReport[0][0];
        }
    }

    ReportedPost.init(columns, options);
};
