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
        mode: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '模式 1活动返利 2月工资'
        },
        type: {
            type: DataTypes.TINYINT(4),
            allowNull: false,
            comment: '类型 1首充返利 2亏损返利 3投注返利 4推广返利'
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
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};