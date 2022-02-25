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
        bet: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '投注金豆'
        },
        ls: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '今日流水'
        },
        win_dou: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '中奖金豆'
        },
        win: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '赢得金豆'
        },
        charge_num: {
            type: DataTypes.DECIMAL(8, 0),
            defaultValue: 0,
            comment: '充值笔数'
        },
        charge: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '充值金额/元'
        },
        exchange_num: {
            type: DataTypes.DECIMAL(8, 0),
            defaultValue: 0,
            comment: '兑换笔数'
        },
        exchange: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '兑换金额/元'
        },
        exchange_rate: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '兑换手续费'
        },
        time: {
            type: DataTypes.DATE,
            comment: '最后更新时间'
        }
    }
};