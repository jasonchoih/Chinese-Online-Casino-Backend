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
          comment: '类型 1存豆 2取豆 3投注 4中奖'
        },
        mode: {
          type: DataTypes.TINYINT(4),
          allowNull: false,
          comment: '模式 1扣除 2增加'
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
        des: {
          type: DataTypes.STRING(50),
          comment: '说明'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};