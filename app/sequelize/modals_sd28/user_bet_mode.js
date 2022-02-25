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
        name: {
            type: DataTypes.STRING(40),
            comment: '模式名称'
        },
        vals: {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: '投注号码'
        },
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '数量' 
        },
        sum: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            comment: '合计金豆'
        },
        ls: {
            type: DataTypes.TINYINT(4),
            defaultValue: 0,
            comment: '是否流水 0不是 1是'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        }
    }
};