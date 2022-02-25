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
        type: {
          type: DataTypes.TINYINT(4),
          allowNull: false,
          comment: '类型 1存 2取'
        },
        num: {
          type: DataTypes.DECIMAL(15, 0),
          allowNull: false,
          comment: '金豆数量'
        },
        dou: {
          type: DataTypes.DECIMAL(15, 0),
          allowNull: false,
          comment: '金豆余额'
        },
        bank: {
          type: DataTypes.DECIMAL(15, 0),
          allowNull: false,
          comment: '银行余额'
        },
        time: {
          type: DataTypes.DATE,
          comment: '时间'
        },
    }
};