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
        user_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '用户收款名字'
        },
        km: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '卡密'
        },
        rate: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            comment: '用户兑换手续费'
        },
        money: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '卡密金额'
        },
        admin_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '审核员ID'
        },
        agent_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '回收人ID'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '类型 1未审核 2已审核 3已回收'
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '时间'
        }
    }
};