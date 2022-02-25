//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(20),
            comment: '类型'
        },
        phone: {
            type: DataTypes.STRING(11),
            comment: '手机号码'
        },
        code: {
            type: DataTypes.STRING(8),
            comment: '密码'
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '发送状态 1成功 2失败'
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