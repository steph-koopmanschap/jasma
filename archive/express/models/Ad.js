module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        ad_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            }
        },
        //Ad name is only used as a front-end text reference for the user
        //because the UUID of ad_id is difficult to read
        ad_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        text_content: {
            type: DataTypes.STRING(1000),
        },
        //The image or video of the ad
        ad_file_url: {
            type: DataTypes.STRING(100),
        },
        //If the ad links to a website or page
        ad_url: {
            type: DataTypes.STRING(100)
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    };

    const options = {
        sequelize,
        tableName: "ads",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    };

    class Ad extends Model {

        static generate() {
            return {
                user_id: "",
                ad_file_url: "",
                ad_url: "",
                expires_at: ""
            };
        }
    }

    Ad.init(columns, options);
};
