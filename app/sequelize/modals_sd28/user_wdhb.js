//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID'
        },
        hongbao_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            comment: '红包ID'
        },
        hbm: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '红包码'
        },
        num: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '红包金豆'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '金豆余额'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};