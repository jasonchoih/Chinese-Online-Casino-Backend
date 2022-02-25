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
            comment: '代理ID'
        },
        agent_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '代理昵称'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID'
        },
        user_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '用户昵称'
        },
        money: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '充值金额'
        },
        up_rate: {
            type: DataTypes.DECIMAL(6, 3),
            defaultValue: '0.985',
            comment: '收卡折扣'
        },
        agent_cut_dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '代理实际扣除金豆'
        },
        agent_charge: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '代理利润'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '状态 1充值成功 2已完成 3代理撤回'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};