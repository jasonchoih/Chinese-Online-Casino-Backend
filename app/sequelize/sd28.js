//
const fs = require('fs');
const path = require('path');
// 
const { sequelizeSD28 } = require('../config/config');
const { Sequelize, DataTypes, QueryTypes, Transaction, Op } = require("sequelize");
// 
// console.log(sequelizeSD28);
const sequelize = new Sequelize(sequelizeSD28.database, sequelizeSD28.username, sequelizeSD28.password, {
    host: sequelizeSD28.host,
    dialect: 'mariadb',
    logging: null, // 禁用日志记录
    // benchmark: true, // 显示语句执行时间
    // logging: (...args) => {
    //     console.log('----------------------------------------------------------------');
    //     console.log(`${args[1]}ms`);
    //     console.log(`${args[0].replace('Executed (default): ','')}`);
    //     //
    //     if (args[2] && args[2].bind) {
    //         console.log(args[2].bind);
    //     }
    // },
    timezone: '+08:00', //for writing to database
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

let _path = './modals_sd28';
let exp = {};
const files = fs.readdirSync(path.join(__dirname, _path));
for (let i in files) {
    const fileName = files[i].replace(/\.js/i, '');
    const parameter = require(_path + '/' + fileName)(DataTypes);
    const file = fileName.replace(/\_/g, '').toUpperCase();
    exp[file] = sequelize.define(fileName, parameter);
}
console.log(exp);
module.exports = {...exp, Sequelize, sequelize, QueryTypes, Transaction, Op };