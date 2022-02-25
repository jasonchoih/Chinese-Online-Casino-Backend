//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_role: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '用户类型 1会员 2代理'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID'
        },
        man: {
            type: DataTypes.DECIMAL(8, 0),
            defaultValue: '0',
            comment: '推广人数'
        },
        bet: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '有效投注'
        },
        time: {
            type: DataTypes.DATE,
            comment: '最后领取时间'
        },
    }
};