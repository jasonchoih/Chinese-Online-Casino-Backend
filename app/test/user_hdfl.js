
const { getHdfl } = require('../service/hdfl_test');

const test = async () =>
{
    const _hfl = await getHdfl({
        user_id:892557
    });
    console.log(_hfl)
}
// test();
console.log('upload test');

// =========================================================================
// 
// const dayjs = require("dayjs");
// const { QueryTypes, sequelize, USERTGFL, USERDAYDATA, USERS } = require('../sequelize/sd28');
// // 
// const getXxflData = async ({ parent, yestoday }) =>
// {
//     const _parents = await USERS.findAll({attributes: ['id','nick'],where:{
//         parent
//     }});
//     if(_parents)
//     {
//         let _user_ids = [];
//         for(let i in _parents)
//         {
//             const _pi = _parents[i];
//             _user_ids.push(_pi.id);
//         }
//         // console.log(_user);
//         const _bets = await sequelize.query('SELECT '+
//         'sum(bet) as bets'+
//         " FROM user_day_data where user_id in("+_user_ids+") and time=?", 
//         {
//             replacements: [yestoday],
//             type: QueryTypes.SELECT,
//             plain: true,
//         });
//         if(_bets && _bets.bets) return parseInt(_bets.bets);
//         return 0;
//     }
//     return 0;
// }
// const test = async() => 
// {
//     const yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
//     const parent = 892145;
//     console.log(await getXxflData({ parent, yestoday }));
// }
// test();