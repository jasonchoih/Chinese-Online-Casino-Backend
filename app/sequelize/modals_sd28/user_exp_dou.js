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
        exp: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '扣除经验'
        },
        num: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '兑换金豆'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '金豆余额'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};