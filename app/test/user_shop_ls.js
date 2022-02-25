const dayjs = require('dayjs'); 
const { USERDATA, USERDAYDATA, AGENTCHARGE, USERBET } = require('../sequelize/sd28');
// 
const test = async(user_id) =>
{
    let _bet = await USERBET.sum('dou',
    {
        where: {
            user_id,
            status:1
          }
    });
    console.log(_bet);
};
test(891741);