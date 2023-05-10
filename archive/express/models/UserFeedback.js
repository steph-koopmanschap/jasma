module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        feedback_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        rating: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        review: {
            type: DataTypes.STRING(750),
            allowNull: false
        }
    };

    const options = { 
        sequelize, 
        tableName: "userfeedback",
        timestamps: true,
        createdAt: "feedback_date",
        updatedAt: false
    };
    
    class UserFeedback extends Model {

    }
    UserFeedback.init(columns, options);
};
