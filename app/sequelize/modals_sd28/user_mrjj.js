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
        vip: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: 'vip级别'
        },
        num: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '金豆数量'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '金豆余额'
        },
        time: {
            type: DataTypes.DATEONLY,
            comment: '时间'
        },
    }
};