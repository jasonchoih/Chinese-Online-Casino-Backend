//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID'
        },
        year: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            comment: '年'
        },
        month: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            comment: '月'
        },
        day: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            comment: '日'
        },
        week: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            comment: '周'
        },
        charge: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '充值金豆'
        },
        charge_rate: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '充值利润'
        },
        exchange: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '回收金豆'
        },
        exchange_rate: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '回收利润'
        },
        rate_sum: {
            type: DataTypes.DECIMAL(18, 0),
            defaultValue: '0',
            comment: '总利润'
        }
    }
};