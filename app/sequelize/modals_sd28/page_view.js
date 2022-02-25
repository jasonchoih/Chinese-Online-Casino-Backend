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
        user_nick: {
            type: DataTypes.STRING(20),
            comment: '用户昵称'
        },
        path: {
            type: DataTypes.STRING(100),
            comment: '访问地址'
        },
        ip: {
            type: DataTypes.STRING(30),
            comment: 'IP'
        },
        time: {
            type: DataTypes.DATE,
            comment: '时间'
        }
    }
};