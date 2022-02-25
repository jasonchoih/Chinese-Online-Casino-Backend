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
        rank: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '昨日排名'
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
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '类型 1已上榜 2已领取 3已过期'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};