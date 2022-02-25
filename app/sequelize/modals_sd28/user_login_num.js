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
        user: {
            type: DataTypes.STRING(32),
            comment: '账号'
        },
        pass: {
            type: DataTypes.STRING(32),
            comment: '密码'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 2,
            comment: '状态 1成功 2失败'
        },
        ip: {
            type: DataTypes.STRING(30),
            comment: 'IP'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        },
    }
};