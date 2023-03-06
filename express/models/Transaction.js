module.exports = (sequelize, DataTypes, Model) => {
    const columns = {
        transaction_id: {
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
        transaction_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status_reason: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        transaction_type: {
            type: DataTypes.STRING(11),
            allowNull: false,
            validate: {
                isIn: [["credit_in", "credit_out", "advert", "asset"]]
            }
        },
        price: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    };

    const options = {
        sequelize,
        tableName: "transactions",
        timestamps: true,
        createdAt: "transaction_date",
        updatedAt: "last_updated"
    };

    class Transaction extends Model {

    }

    Transaction.init(columns, options);
};
