//
const { sequelizeLottery } = require('../config/config');
const { Sequelize, DataTypes } = require("sequelize");
// 
const sequelize = new Sequelize(sequelizeLottery.database, sequelizeLottery.username, sequelizeLottery.password, {
    host: sequelizeLottery.host,
    dialect: 'mysql',
    logging: null,                        // 禁用日志记录
    // benchmark: true, // 显示语句执行时间
    // logging: (...args) => 
    // {
    //     console.log('----------------------------------------------------------------');
    //     console.log(`${args[1]}ms`);
    //     console.log(`${args[0].replace('Executed (default): ','')}`);
    //     //
    //     if(args[2] && args[2].bind)
    //     {
    //         console.log(args[2].bind);
    //     }
    // },
    // timezone: '+08:00', //for writing to database
    //
    define: {
        underscored: true,
        timestamps: false,
        freezeTableName: true
    }
});

// const tst = async() =>
// {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }
// tst();

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
const LOTTERY = sequelize.define('lottery', 
{
    id: { 
        type: INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    category: {
        type: STRING(10),
        allowNull: false,
        comment: '游戏名称 jnd jnc'
    },
    peroids: { 
        type: STRING(30),
        allowNull: false,    
        comment: '期号'
    },
    number: {
        type: STRING(60),
        allowNull: true,
        comment: '开奖号码'
    },
    des: {
        type: STRING(100),
        allowNull: true,
        comment: '号码来源'
    },
    time: {
        type: DATE,
        comment: '开奖时间'
    },
    status: {
      type: Sequelize.TINYINT(4),
      defaultValue: 1,
      comment: '状态'
    }
});

module.exports = {
    LOTTERY
};