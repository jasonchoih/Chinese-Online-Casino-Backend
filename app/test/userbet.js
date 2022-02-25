// 
const dayjs = require("dayjs");
const { SubDo, get_1, get_1_List, lrange_1_Async, get_2 } = require('../plugin/redis');
const { 
    isInGame, 
    getNewLottery, 
    getGameList, 
    getBetList,
    getGz,
    getBetmodeList,
    getBetmodeListBet,
    _bet_is_in_peroids, 
    getGameBetData,
    objNumSum,
    isLs
} = require('../service/game');
const { xpage } = require('../plugin/tool');
const { math_abs, valsChange } = require('../service/tool');
const { USERS, USERBET, USERBETMODE, USERBETAUTO } = require('../sequelize/sd28');
//

const test = async() => 
{

    const _user = await USERS.findOne({attributes:['role','betmax','status'],where:{id:888800}});
    let _user_bet_maxs = '';
    if(_user.betmax) _user_bet_maxs = parseInt(_user.betmax)*1000;
    if(_user_bet_maxs) console.log(_user_bet_maxs);
}
test();
