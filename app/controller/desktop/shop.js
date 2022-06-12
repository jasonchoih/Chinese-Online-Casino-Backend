//
const dayjs = require('dayjs'); 
// 
const { enSign, deSign, UUID } = require('../../plugin/cryptos');
const { AlismsSend } = require('../../plugin/verify');
const { ItsmsSend } = require('../../plugin/verify_it');
const { phoneHide } = require('../../plugin/tool');
const { USERS, USERDATA, USERBETAUTO, AGENTCHARGE } = require('../../sequelize/sd28');
const { get_2, SubDo } = require('../../plugin/redis');
const { LsCheck } = require('../../service/liushui');
//
const get_shop_need_time = async() => 
{
    let _need_time = 0; // 秒
    const _shop_need_time = await get_2('settingother');
    if(_shop_need_time&&_shop_need_time.shop_need_time)
    {
        _need_time = parseInt(_shop_need_time.shop_need_time)*60;
    }
    return [ _need_time, _shop_need_time.shop_need_time ];
}
// 检查兑换手续费
const check = async(d) => 
{
    let { id, money, ip } = d;
    // 是否有自动投注
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            ShopLoading:'',
            M:{
                c: '已存在自动投注，无法进行卡密兑换，请先暂停自动投注！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            }
        }
    }
    // 
    if(!money) return { M:{ c:'请输入兑换金额！' }, ShopLoading:'' };
    // 
    const _user = await USERS.findOne({ attributes: ['role', 'status', 'cs', 'nick', 'name'], where: { id } });
    // 
    if (!_user) return { M: { c: '获取用户信息错误，请稍后再试！' }, ShopLoading: '' };
    if (_user.role == 2) return { M: { c: '该账号不能进行卡密兑换，请检查！' }, ShopLoading: '' };
    if (_user.cs == 2) return { M: { c: '该账号为测试账号，不能进行卡密兑换，请更换！' }, ShopLoading: '' };
    if (_user.status > 1) return { M: { c: '该账号已暂时被冻结，如有疑问请联系客服！' }, ShopLoading: '' };
    if(!_user.name) return { ShopLoading: '', M: { c: '请先填写完整个人收款信息，再进行卡密兑换！',bt:'点击前往会员中心修改', bcn:1, b:1, boo:{u:'user/wdzl'} }};
    // 金额检查
    money = parseInt(money);
    if(!money || money<=0) return { M:{ c:'请输入正确金额！' }, ShopLoading:'' };
    if(money<100) return { M: { c: '最小金额为100元，请更改' }, ShopLoading: '' };
    // 时间检查
    let _last_charge_second = 0;
    const _last_charge = await AGENTCHARGE.findOne({attributes:['time'],where:{user_id:id,status:1},order:[['id','DESC']]});
    if(_last_charge&&_last_charge.time)
    {
        _last_charge_second = parseInt(await dayjs().diff(dayjs(_last_charge.time), 'second'));
    }
    const _need_time = await get_shop_need_time();
    if(_last_charge_second>0 && _last_charge_second<_need_time[0])
    {
        return { M: { c: '提现时间间隔，不能低于最后一次充值时间的 '+_need_time[1]+' 分钟内' }, ShopLoading: '' };
    }
    // 
    const dou = parseInt(money*1000);
    let [ ls, tip, odd, charge_dou, _user_data_last_charge_dou ] = await LsCheck({user_id:id});
    // 
    // console.log(ls, tip, odd, charge_dou, _user_data_last_charge_dou);
    //
    const rate = parseInt(odd*100);
    const douodd = parseInt(dou*odd);
    const dousum = parseInt(dou+douodd);
    // dayjs().unix() 秒
    const code = await enSign(dayjs().unix()+'|'+money+'|'+id+'|'+ip+'|'+await UUID()+'|'+dousum);
    const { bank } = await USERDATA.findOne({attributes:['bank'],where:{user_id:id}});
    // 
    if(bank&&parseInt(bank)<dousum)
    {
        tip = '银行金豆不足';
    }
    // 
    return {
        ShopLoading:'',
        ShopTip:{ 
            tip, money, ls, rate, dou, douodd, dousum, code, charge_dou,
            bank: bank||0, 
            last: _user_data_last_charge_dou||0
        }
    }
}
// 获取KEY
const code = async(d) => 
{
    let { id, code, ip } = d;
    // 
    if (!code) return { M: { c: '参数不完整，请重试！' } };
    // 
    const _code = (await deSign(code)).split('|');
    if(_code.length<5 || !_code[0] || !_code[1] || _code[2]!=id || _code[3]!=ip) return { M: { c: '参数错误或网络变动，请重试！' },ShopTip:'' };
    if(parseInt(dayjs().unix()-_code[0])>600) return { M: { c: '兑换超时，请重试！' },ShopTip:'' };
    // 
    const { bank } = await USERDATA.findOne({attributes:['bank'],where:{user_id:id}});
    if(!bank) return { M: { c: '获取信息失败，请稍后重试！' } };
    if(parseInt(bank) < parseInt(_code[5])) return { M: { c: '银行金豆不足，请先到会员中心进行存豆，再进行兑换，或更改兑换金额！' } }; 
    // 
    let { calling, phone } = await USERS.findOne({ attributes: ['calling','phone'], where: { id } });
    // 
    // let pode = await AlismsSend('shopbuy', calling, phone, ip);
    let pode = await ItsmsSend('shopbuy', calling, phone, ip);
    if (pode < 0) return { M: { c: '短信发送失败或单日发送过多，请稍后再试或联系客服获取！' },ShopTip:'' };
    if (pode < 60) return { M: { c: '短信发送过快，请 ' + pode + ' 秒后再试！' },ShopTip:'' };
    // 
    return {
        ShopTip:'',
        ShopBuy:{
            phone: calling+' '+await phoneHide(phone),
            code: await enSign(id+'|'+ip+'|'+_code[1]+'|'+pode+'|'+dayjs().unix()+'|'+await UUID())
        }
    }
};
// 兑换
const exchange = async(d) => 
{
    const { id, uuidkey, pode, code, ip } = d;
    if (!pode || !code) return { M: { c: '参数不完整，请重试！' },ShopBuy:'' };
    //
    const _pode = (await deSign(pode)).split('|');
    if(_pode.length<5 || _pode[0]!=id || _pode[1]!=ip) return { M: { c: '参数错误或网络变动，请重试！' },ShopBuy:'' };
    
    if(parseInt(dayjs().unix()-parseInt(_pode[4]))>600) return { M: { c: '兑换超时，请重试！' },ShopBuy:'' };
    // 
    if (!/^\d{6}$/.test(code)) return { PhoneCodeStatus: { code: { s: 'error', h: '验证码错误，请更正！' } }, PhoneCodeLoading: '' }
    try {
        if (_pode[3] != code) return { PhoneCodeStatus: { code: { s: 'error', h: '验证码错误，请更正！' } }, PhoneCodeLoading: '' }
    } catch (error) {

    }
    // 
    await SubDo({ 
        path:[ 'shop', 'dui' ],
        data:{ uuidkey, id, money: parseInt(_pode[2]) }
    });
}
// 
module.exports = {
    check,
    code,
    exchange
};