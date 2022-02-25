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
        vip: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: 'vip级别'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        }
    }
};