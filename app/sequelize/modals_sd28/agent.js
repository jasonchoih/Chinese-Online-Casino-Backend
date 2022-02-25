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
            unique: true,
            allowNull: false,
            comment: '用户ID'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '金豆余额'
        },
        up_max: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '10000',
            comment: '最高上分'
        },
        up_rate: {
            type: DataTypes.DECIMAL(6, 3),
            defaultValue: '0.985',
            comment: '上分折扣'
        },
        down_rate: {
            type: DataTypes.DECIMAL(6, 3),
            defaultValue: '0.985',
            comment: '下分折扣'
        },
        ph: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: '0',
            comment: '铺货金额'
        },
    }
};