//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        form_agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '转出代理ID'
        },
        form_agent_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '转出代理昵称'
        },
        to_agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '接收代理ID'
        },
        to_agent_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '接收代理昵称'
        },
        money: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: 0,
            comment: '转移金额'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '转移金豆'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '状态 1发起转移 2接受转移 3确定转移 4客服取消'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        }
    }
};