//
module.exports = (DataTypes) => {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.STRING(20),
            comment: '认证标识'
        },
        user: {
            type: DataTypes.STRING(32),
            unique: true,
            allowNull: false,
            comment: '账号'
        },
        pass: {
            type: DataTypes.STRING(32),
            allowNull: false,
            comment: '密码'
        },
        safe: {
            type: DataTypes.STRING(32),
            allowNull: false,
            comment: '密码'
        },
        role: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '用户类型 1会员 2代理'
        },
        level: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: 'VIP级别 1-7级'
        },
        parent: {
            type: DataTypes.INTEGER,
            defaultValue: '0',
            comment: '上级ID'
        },
        calling: {
            type: DataTypes.STRING(6),
            allowNull: false,
            comment: '国际电话区号'
        },
        phone: {
            type: DataTypes.STRING(11),
            allowNull: false,
            comment: '手机号码'
        },
        nick: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
            comment: '昵称'
        },
        des: {
            type: DataTypes.STRING(80),
            allowNull: '',
            comment: '个性签名'
        },
        qq: {
            type: DataTypes.STRING(20),
            allowNull: '',
            comment: 'QQ'
        },
        wx: {
            type: DataTypes.STRING(50),
            allowNull: '',
            comment: '微信号'
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: '',
            comment: '真实姓名'
        },
        km: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '卡密需要审核 1是 2否'
        },
        cs: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '是否测试账号 1否 2是'
        },
        sound: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '打开声音 1是 2否'
        },
        betmax: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.TINYINT(4),
            defaultValue: 1,
            comment: '状态 1正常 2冻结'
        }
    }
};