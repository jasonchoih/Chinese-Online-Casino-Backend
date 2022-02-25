//
const { origins, pathWhite } = require('../config/config');
const { bufferToArray } = require('../plugin/buffer');
const { deSign, md5 } = require('../plugin/cryptos');
const dayjs = require("dayjs");
const { USERS } = require('../sequelize/sd28');
const { GotoUrl } = require('../plugin/tool');
const { redis_2_pubs } = require('../plugin/redis');
// 
const urlTimeOut = 11;
// -
const ipcheck = async(h) => 
{
    if(h['cf-connecting-ip']) return h['cf-connecting-ip'];
    return h['x-real-ip'];
}
// 升级检查
const upgradeCheck = async(request) => 
{
    const { headers } = request;
    // console.log(headers);
    // 参数不完整
    if (!headers['sec-websocket-key'] || !headers['user-agent'] || !headers['origin']) {
        return 201; // 头部参数不完整
    }
    // 不在可访问范围
    if (!origins.find((v) => v == headers['origin'])) {
        return 202; // 非法域名
    }
    // 网址验证
    try {
        const url = request.url;
        const platform = url.substr(1, 1);
        const _ip_agent_md5 = url.substr(2, 32);
        const _sign = url.substr(34);
        // 
        const _user_agent = headers['user-agent'];
        const ip = await ipcheck(headers); // -
        const _ip = ip.replace(/\./g,''); // -
        // 
        const _ip_user_agent_md5 = await md5(_ip + '' + _user_agent + '' + dayjs().format('YYMMDDHHmm'));
        if (_ip_agent_md5 !== _ip_user_agent_md5) {
            return 203; // 非法链接
        }
        // 
        const _deSign = await deSign(_sign);
        const __sign = _deSign.split('|');
        if (dayjs().valueOf() - parseInt(__sign) <= urlTimeOut) {
            return 204; // 链接超时
        }
        const ikey = _ip + '' + __sign.join('');
        //
        return {
            ikey: new Uint16Array(ikey.split('')),
            ip, // -
            userAgent: _user_agent,
            platform,
            origin: headers['origin'],
            wkey: _sign
        }
    } catch (error) {

    }
    return 205; // 检验失败
};
// 路径检查
const pathCheck = async(e, ikey) => {
    if (!e) return 1;
    //
    try {
        e = await bufferToArray(e, ikey);
        if (!e || Object.keys(e).length <= 0 || !e.path || !(/^[a-z0-9\/\_]+$/.test(e.path))) return false;
        return e;
    } catch (error) {

    }
    return 2;
};
// 用户检查
const userCheck = async(platform, ip, path, d) => 
{
    if(!d.__tk && pathWhite[platform].find(v=>v==path))
    {
        return false;
    }
    try {
        let _de = await deSign(d.__tk);
        _de = _de.split('|');
        // 
        // if(ip!=_de[2])
        // {
        //     return {
        //         AuthDel: dayjs().valueOf(),
        //         M:{c:'为了您的账号安全，请重新登录！'},
        //         ...await GotoUrl('dl')
        //     }
        // }
        // 
        const _user = await USERS.findOne({ attributes: ['id','uuid','nick','status'], where: { id: _de[0] } });
        if(!_user || !_user.id || _user.uuid!=_de[1])
        {
            return {
                AuthDel: dayjs().valueOf(),
                M:{c:'为了您的账号安全，请重新登录！'},
                ...await GotoUrl('dl')
            }
        }
        if(_user.status!=1)
        {
            return {
                AuthDel: dayjs().valueOf(),
                M:{c:'该账号已被冻结，请尝试重新登录！'},
                ...await GotoUrl('dl')
            }
        }
        return { 
            ..._user.dataValues
        };
    } catch (error) {
        
    }
    return {
        AuthDel: dayjs().valueOf(),
        M:{c:'请先登录，以继续操作！'},
        ...await GotoUrl('dl')
    }
}
// 
const qunCheck = async(d, nick) => 
{
    const { game, category, type } = d || {};
    const _categorys = ['q214','q28'];
    const _type = ['jnd','pk','bj','dd','jnc','au','elg','slfk','btc','kr'];
    if(!game || !nick || !category || !type || !_categorys.find(v=>v==category) || !_type.find(v=>v==type)) return;
    // 
    await redis_2_pubs('sd28-site-room', JSON.stringify({
        controller: 'game_qun_auto_bet_show',
        game: category+''+type,
        data: [ 3, nick ]
    }));
}
// 
module.exports = {
    upgradeCheck,
    pathCheck,
    userCheck,
    qunCheck
};