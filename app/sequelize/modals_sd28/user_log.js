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
        des: {
            type: DataTypes.STRING(),
            comment: '内容'
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