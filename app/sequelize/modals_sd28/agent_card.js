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
        user_name: {
            type: DataTypes.STRING(30),
            allowNull: '',
            comment: '真实姓名'
        },
        user_card_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            comment: '卡密ID'
        },
        km: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '卡密'
        },
        money: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '卡密金额'
        },
        down_rate: {
            type: DataTypes.DECIMAL(12, 3),
            defaultValue: '0.985',
            comment: '收卡折扣'
        },
        agent_add: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '代理得到金豆'
        },
        agent_rate: {
            type: DataTypes.DECIMAL(12, 0),
            defaultValue: '0',
            comment: '代理利润'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};