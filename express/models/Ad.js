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
        ad_file_url: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
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

    class Ad extends Model {}
    Ad.init(columns, options);
};
