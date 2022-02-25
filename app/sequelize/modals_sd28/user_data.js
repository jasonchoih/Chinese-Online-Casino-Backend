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
            unique: true,
            allowNull: false,
            comment: '用户ID'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: 0,
            comment: '金豆数量'
        },
        bank: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: 0,
            comment: '银行金豆'
        },
        exp: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: 0,
            comment: '经验值'
        },
        last_charge_dou: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: 0,
            comment: '最后一次充值前的金豆余额'
        }
    }
};