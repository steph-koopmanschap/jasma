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
        transaction_type: {
            type: DataTypes.STRING(11),
            allowNull: false,
            validate: {
                isIn: [["credit_in", "credit_out", "advert", "asset"]]
            }
        },
        price: {
            type: DataTypes.DOUBLE,
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
        updatedAt: false
    };

    class Transaction extends Model {

    }

    Transaction.init(columns, options);
};
