//
const dayjs = require('dayjs'); 
// 
const { enSign, deSign, UUID } = require('../../plugin/cryptos');
const { USERS, USERDATA, USERBETAUTO } = require('../../sequelize/sd28');
const { LsCheck } = require('../../service/liushui');
// 
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
    if(!_user.name) return { ShopLoading: '', M: { c: '请先填写完整个人收款信息，再进行卡密兑换！',bt:'点击前往会员中心修改', bcn:1, b:1, boo:{u:'user/home'} }};
    // 
    money = parseInt(money);
    if(!money || money<=0) return { M:{ c:'请输入正确金额！' }, ShopLoading:'' };
    if(money<100) return { M: { c: '最小金额为100元，请更改' }, ShopLoading: '' };
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
// 
module.exports = {
    check
};