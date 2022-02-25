//
const { sequelizeSql } = require('../../config/config');
//
const { Sequelize, DataTypes } = require("sequelize");
// 
const sequelize = new Sequelize(sequelizeSql.database, sequelizeSql.username, sequelizeSql.password, {
    host: sequelizeSql.host,
    dialect: 'mysql2',
    // operatorsAliases: false, // 消除warning ：https://github.com/sequelize/sequelize/issues/8417
    // 选择一种日志记录参数
    // logging: console.log,                  // 默认值,显示日志函数调用的第一个参数
    // logging: (...msg) => console.log(msg), // 显示所有日志函数调用参数
    // logging: null,                        // 禁用日志记录
    // logging: msg => logger.debug(msg),     // 使用自定义记录器(例如Winston 或 Bunyan),显示第一个参数
    // logging: logger.debug.bind(logger)     // 使用自定义记录器的另一种方法,显示所有消息
    // dialectOptions: {
    //     useUTC: false, //for reading from database
    //     // timezone: 'Etc/GMT+8', //for writing to database
    //     // charset: "utf8mb4",
    //     // collate: "utf8mb4_unicode_ci",
    //     // supportBigNumbers: true,
    //     // bigNumberStrings: true
    // },
    timezone: '+08:00', //for writing to database
    //需在此处配置，否则中文无法插入
    define: {
        underscored: true,
        timestamps: false,
        freezeTableName: true
    }
});
const { 
    INTEGER,
    BIGINT,
    TINYINT,
    STRING,
    DECIMAL,
    DATE,
    JSON
} = DataTypes;
// 用户
const Users = sequelize.define('users', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    uuid: {
        type: STRING(8),
        allowNull: true,
        comment: 'UUID'
    },
    parent_id: {
        type: INTEGER,
        comment: '上级ID'
    },
    role: { 
        type: TINYINT(4), 
        allowNull: false,
        defaultValue: 1,
        comment: '角色 1会员 2商家'
    },
    level: { 
        type: TINYINT(4), 
        allowNull: false,
        defaultValue: 1,
        comment: '等级 vip'
    },
    user: {
        type: STRING(60),
        allowNull: false,
        unique: true,
        comment: '账号'
    },
    pass: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    },
    phone: {
        type: STRING(11),
        allowNull: false,
        comment: '手机号码'
    },
    nick: {
        type: STRING(60),
        allowNull: false,
        comment: '昵称'
    },
    bank: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '银行余额'
    },
    dou: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '金豆余额'
    },
    exp: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '经验'
    },
    msg: {
        type: INTEGER(3),
        allowNull: false,
        defaultValue: 0,
        comment: '未读信息'
    },
    status: {
        type: TINYINT(4),
        allowNull: false
    },
    km: {
        type: TINYINT(4),
        defaultValue: 1,
        allowNull: false
    },
    cs: {
        type: TINYINT(4),
        defaultValue: 1,
        allowNull: false
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    },
    version: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '版本'
    }
});
// 投注记录
const UserBet = sequelize.define('user_bet', {
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    parent_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '上级ID'
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    category: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏系列'
    },
    peroids: {
        type: STRING(30),
        allowNull: false,
        comment: '期号'
    },
    type: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏类型'
    },
    bet: {
        type: STRING(50),
        allowNull: false,
        comment: '投注号码'
    },
    odd: {
        type: DECIMAL(6, 2),
        allowNull: false,
        comment: '投注赔率'
    },
    dou: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '投注金豆'
    },
    old: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '之前金豆'
    },
    sum: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '金豆余额'
    },
    win: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '赢取金豆'
    },
    ls: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 2,
        comment: '有效流水 1是 2否'
    },
    status: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 1,
        comment: '状态 1投注中未兑奖 21中奖 22未中奖 3已开奖但金额错误'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 开奖记录
const UserBetOpenLog = sequelize.define('user_bet_open_log', {
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    bet_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    status: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 1,
        comment: '状态 1投注中未兑奖 21中奖 22未中奖 3已开奖但金额错误'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 用户金豆明细
const UserDouLog = sequelize.define('user_dou_log', {
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    mode: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 0,
        comment: '模式 0默认 1充值 2投注 3兑换卡密 4活动赠送'
    },
    type: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 0,
        comment: '类型 0默认 1减 2加'
    },
    dou: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '金豆数量'
    },
    old: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '之前金豆'
    },
    sum: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '金豆余额'
    },
    des: {
        type: STRING,
        allowNull: true,
        comment: '日志内容'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 用户日志
const UserLog = sequelize.define('user_log', {
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
    },
    table_name: {
        type: STRING(60),
        comment: '来自表格名称'
    },
    table_id: {
        type: INTEGER,
        comment: '来自表格ID'
    },
    des: {
        type: STRING,
        comment: '日志内容'
    },
    ip: {
        type: STRING(30),
        comment: 'IP地址'
    },
    country: {
        type: STRING(20),
        comment: '国家'
    },
    area: {
        type: STRING(60),
        comment: '地区'
    },
    agent: {
        type: STRING,
        comment: '浏览器信息'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 游戏开奖号码
const GameLotteryNumber = sequelize.define('game_lottery_number', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    game: {
        type: STRING(30),
        comment: '游戏'
    },
    peroids: {
        type: STRING(60),
        comment: '期号'
    },
    number: {
        type: STRING,
        comment: '开奖号码'
    },
    time_open: {
        type: DATE,
        comment: '开奖时间'
    },
    time_in: {
        type: DATE,
        comment: '入库时间'
    }
});
// 游戏赔率
const GameOdd = sequelize.define('game_odd', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    game: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏'
    },
    number: {
        type: STRING(20),
        allowNull: false,
        comment: '号码'
    },
    show_min: {
        type: DECIMAL(6,2),
        allowNull: false,
        comment: '展示赔率-最小'
    },
    show_max: {
        type: DECIMAL(6,2),
        allowNull: false,
        comment: '展示赔率-最大'
    },
    open_min: {
        type: DECIMAL(6,2),
        allowNull: false,
        comment: '开奖赔率-最小'
    },
    open_max: {
        type: DECIMAL(6,2),
        allowNull: false,
        comment: '展示赔率-最大'
    },
    bet_max: {
        type: DECIMAL(8),
        allowNull: false,
        comment: '投注额-最大'
    }
});
// 排行榜
const Ranks = sequelize.define('ranks', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    category: {
        type: STRING(10),
        allowNull: false,
        comment: '游戏系列'
    },
    type: {
        type: STRING(10),
        allowNull: false,
        comment: '游戏类型'
    },
    wink: {
        type: DECIMAL(15, 0),
        allowNull: false,
        defaultValue: 0,
        comment: '赢亏'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 用户排行榜记录
const UserRank = sequelize.define('user_rank', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    rank: {
        type: INTEGER,
        allowNull: false,
        comment: '排名'
    },
    lx: {
      type: INTEGER,
      allowNull: false,
      comment: '连续上榜天数'
    },
    dou: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '获得金豆'
    },
    dousum: {
      type: DECIMAL(15, 0),
      allowNull: false,
      comment: '金豆余额'
    },
    status: {
      type: TINYINT,
      allowNull: false,
      comment: '状态 1未领取 2已领取'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '时间'
    }
});
// 自动投注
const UserBetAuto = sequelize.define('user_bet_auto', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
    },
    category: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏系列'
    },
    type: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏类型'
    },
    peroids_start: {
        type: BIGINT,
        allowNull: false,
        comment: '开始期数'
    },
    peroids_end: {
        type: BIGINT,
        allowNull: false,
        comment: '结束期数'
    },
    start: {
        type: INTEGER,
        allowNull: false,
        comment: '当前第几期'
    },
    end: {
        type: INTEGER,
        allowNull: false,
        comment: '期数总数'
    },
    min: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '金豆下限'
    },
    max: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '金豆上限'
    },
    mode: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 1,
        comment: '类型 1输赢变换 2对号模式'
    },
    dou: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '投注额'
    },
    win: {
        type: DECIMAL(15, 0),
        allowNull: false,
        comment: '赢豆合计'
    },
    bets: { 
        type: JSON,
        allowNull: false,
        comment: '投注内容'
    },
    betkey: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '投注位置'
    },
    status: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 1,
        comment: '状态 1启动中 2已停止'
    },
    des: {
        type: STRING,
        allowNull: false,
        comment: '描述'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '添加时间'
    }
});
// 投注模式
const UserBetMode = sequelize.define('user_bet_mode', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: { 
        type: INTEGER,
        allowNull: false,
    },
    category: {
        type: STRING(30),
        allowNull: false,
        comment: '游戏'
    },
    type: {
        type: STRING(30),
        allowNull: false,
        comment: '分类'
    },
    name: {
        type: STRING(60),
        allowNull: false,
        comment: '模式名称'
    },
    vals: {
        type: JSON,
        allowNull: false,
        comment: '投注模式'
    },
    top: {
        type: TINYINT(4),
        allowNull: false,
        defaultValue: 1,
        comment: '置顶 1否 2是'
    },
    time: {
        type: DATE,
        allowNull: false,
        comment: '添加时间'
    }
});

module.exports = {
    Sequelize,
    sequelize,
    GameLotteryNumber,
    UserRank,
    Users,
    UserBet,
    UserBetOpenLog,
    UserDouLog,
    UserLog,
    GameOdd,
    Ranks,
    UserBetAuto,
    UserBetMode
};