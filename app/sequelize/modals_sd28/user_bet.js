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
        category: {
            type: DataTypes.STRING(10),
            comment: '游戏分类'
        },
        type: {
            type: DataTypes.STRING(10),
            comment: '游戏类型'
        },
        peroids: {
            type: DataTypes.STRING(15),
            comment: '期数'
        },
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '投注数量'
        },
        dou: {
            type: DataTypes.DECIMAL(15, 0),
            allowNull: false,
            comment: '合计金豆'
        },
        win_dou: {
            type: DataTypes.DECIMAL(15, 0),
            defaultValue: 0,
            comment: '中奖金豆'
        },
        wins: {
            type: DataTypes.STRING(50),
            defaultValue: '',
            comment: '中奖号码'
        },
        vals: {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: '投注号码'
        },
        ls: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '是否流水 1是 2否'
        },
        mode: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '模式 1手动 2自动'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '类型 1投注中 2已开奖'
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '最后投注时间'
        }
    }
};