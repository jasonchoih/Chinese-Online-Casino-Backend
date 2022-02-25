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
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '客服ID'
        },
        num: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '数量'
        },
        agent_dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '代理金豆余额'
        },
        admin_dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '客服金豆余额'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};