const { 
    get_2
} = require('../plugin/redis');
const { AGENTCHARGE } = require('../sequelize/sd28');
const dayjs = require('dayjs');
// 
const get_shop_need_time = async() => 
{
    let _need_time = 0; // 秒
    const _shop_need_time = await get_2('settingother');
    if(_shop_need_time&&_shop_need_time.shop_need_time)
    {
        _need_time = parseInt(_shop_need_time.shop_need_time)*60;
    }
    return _need_time
}
const get_user_last_charge = async(user_id) => 
{
    let _last_charge_second = 0;
    const _last_charge = await AGENTCHARGE.findOne({attributes: ['user_id','time'],where:{user_id,status:1},order: [['id','DESC']]});
    if(_last_charge&&_last_charge.time)
    {
        _last_charge_second = parseInt(await dayjs().diff(dayjs(_last_charge.time), 'second'));
    }
    // 
    const _need_time = await get_shop_need_time();
    // 
    console.log(_last_charge_second, _need_time);
    // 
    if(_last_charge_second<_need_time)
    {
        console.log('距离充值时间不足15分钟');
        return;
    }
    console.log('可以提现');
}
//
get_user_last_charge(890779);