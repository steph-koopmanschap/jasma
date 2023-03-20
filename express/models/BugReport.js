module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        bug_report_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        report_description: {
            type: DataTypes.STRING(5000),
            allowNull: false
        }
    };

    const options = {
        sequelize,
        tableName: "bug_reports",
        timestamps: true,
        createdAt: "bug_report_time",
        updatedAt: false
    };

    class BugReport extends Model {

        static async getReports(limit = 0) {
            let resReports
            if(limit > 0) {
                resReports = await sequelize.query(`SELECT * FROM bug_reports ORDER BY bug_report_time ASC LIMIT ?`, { replacements: [limit] });
            }
            else {
                resReports = await sequelize.query(`SELECT * FROM bug_reports ORDER BY bug_report_time ASC`);
            }
            return resReports[0];
        }
    }

    BugReport.init(columns, options);
};
