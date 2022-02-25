//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '添加人ID'
        },
        admin_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '添加人昵称'
        },
        hbm: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '红包码'
        },
        money: {
            type: DataTypes.DECIMAL(9, 0),
            allowNull: false,
            comment: '金额'
        },
        dou: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            comment: '金豆数量'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '类型 1未领取 2已领取 3已过期'
        },
        op_admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '操作人ID'
        },
        op_admin_nick: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '操作人昵称'
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '时间'
        }
    }
};