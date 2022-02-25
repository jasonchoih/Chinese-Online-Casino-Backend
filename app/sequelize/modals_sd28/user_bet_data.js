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
        category: {
            type: DataTypes.STRING(10),
            comment: '游戏分类'
        },
        type: {
            type: DataTypes.STRING(10),
            comment: '游戏类型'
        },
        bet: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '投注金豆'
        },
        win_dou: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '投注中奖/金豆'
        },
        win: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '赢得金豆'
        },
        pn: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '投注了多少期'
        },
        wn: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '赢了多少期'
        },
        time: {
            type: DataTypes.DATEONLY,
            comment: '时间'
        },
    }
};