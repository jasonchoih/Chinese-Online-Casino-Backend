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
        cls: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '充值后的流水'
        },
        win_dou: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '中奖金豆'
        },
        win: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: 0,
            comment: '投注盈亏'
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
        day_first_charge: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '今日首充'
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
        rank: {
            type: DataTypes.TINYINT(4),
            defaultValue: '0',
            comment: '排行榜排名'
        },
        phb: {
            type: DataTypes.TINYINT(4),
            defaultValue: '0',
            comment: '排行榜领取 1未领 2已领'
        },
        scfl: {
            type: DataTypes.TINYINT(4),
            defaultValue: '1',
            comment: '首充返利 1未领 2已领'
        },
        tzfl: {
            type: DataTypes.TINYINT(4),
            defaultValue: '1',
            comment: '投注返利 1未领 2已领'
        },
        ksfl: {
            type: DataTypes.TINYINT(4),
            defaultValue: '1',
            comment: '亏损返利 1未领 2已领'
        },
        xxfl: {
            type: DataTypes.TINYINT(4),
            defaultValue: '1',
            comment: '推广返利 1未领 2已领'
        },
        ygz: {
            type: DataTypes.TINYINT(4),
            defaultValue: '1',
            comment: '月度返利 1未领 2已领'
        },
        time: {
            type: DataTypes.DATEONLY,
            comment: '时间'
        },
    }
};