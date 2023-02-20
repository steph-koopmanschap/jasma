module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        ad_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "ads",
                key: "ad_id"
            }
        },
        //AD TARGETING
        //For ad targeting users by age
        age_start: {
            type: DataTypes.TINYINT.UNSIGNED
        },
        //For ad targeting users by age
        age_end: {
            type: DataTypes.TINYINT.UNSIGNED
        },
        //For ad targeting users by gender
        gender: {
            type: DataTypes.STRING(11),
            validate: {
                isIn: [["woman", "man", "trans woman", "trans man", "other", "all", "none"]]
            }
        },
        //For ad targeting users by relationship
        relationship: {
            type: DataTypes.STRING(11),
            validate: {
                isIn: [["single", "married", "partnership", "open", "poly", "other", "all", "none"]]
            }
        },  
        //For ad targeting users by country
        country: {
            type: DataTypes.TEXT
        },
        //For ad targeting users by city
        city: {
            type: DataTypes.TEXT
        },
    };

    const options = {
        sequelize,
        tableName: "ad_targeting_preferences",
        timestamps: false,
        createdAt: "created_at",
        updatedAt: false
    };

    class AdTargetingPreferences extends Model {

        static generate() {
            return {
                age_start: "18",
                age_end: "120",
                gender: "all",
                relationship: "all",
                country: "",
                city: ""
            };
        }
    }

    AdTargetingPreferences.init(columns, options);
};
