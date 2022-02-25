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
        admin_id: {
            type: DataTypes.INTEGER,
            defaultValue: '0',
            comment: '客服ID'
        },
        admin_nick: {
            type: DataTypes.STRING(20),
            defaultValue: '',
            comment: '客服昵称'
        },
        money: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '提现金额'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '提现金豆'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '状态 1代理发起提现 2客服确认转账 21客服取消提现'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
        shtime: {
            type: DataTypes.DATE,
            comment: '审核时间'
        },
    }
};