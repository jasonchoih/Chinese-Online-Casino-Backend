//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        port: {
            type: DataTypes.STRING(10),
            comment: '线程号'
        },
        origin: {
            type: DataTypes.STRING(80),
            comment: '来源域名'
        },
        agent: {
            type: DataTypes.STRING(),
            comment: '浏览器'
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