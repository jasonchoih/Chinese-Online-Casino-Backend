//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(10),
            defaultValue: 'news',
            comment: '来源'
        },
        auth: {
            type: DataTypes.STRING(20),
            defaultValue: '',
            comment: '来源'
        },
        title: {
            type: DataTypes.STRING(80),
            comment: '标题'
        },
        time: {
            type: DataTypes.DATE,
            comment: '添加时间'
        },
    }
};