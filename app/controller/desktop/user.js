// 
const dayjs = require('dayjs');
// 
const { xPass,cPass } = require('../../plugin/cryptos');
const { 
    USERS, USERLOG, USERDATA, USERDAYDATA, AGENT,
    USERMRQD
} = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { UserTgflSum } = require('../../service/usertgfl');
const { zhekou } = require('../../service/tool');
// 会员中心 - 首页
const home = async(d) =>
{
    const { id } = d;
    const _user = await USERS.findOne({ attributes: ['id','nick','level','role'], where:{id} });
    // 
    let _data;
    let _home;
    if(_user.role==1)
    {
        _data = await USERDATA.findOne({ attributes: ['dou','bank'], where: { user_id: id } });
        const _time = dayjs().format('YYYY-MM-DD');
        const _bet_data = await USERDAYDATA.findOne({ attributes: ['bet','ls','win'], where: { user_id: id, time:_time } });
        Auth = {
            dou: _data.dou,
            bank: _data.bank, 
        };
        _home = [
            _data.dou,
            _data.bank||0,
            0,
            _bet_data&&_bet_data['bet']||0,
            _bet_data&&_bet_data['ls']||0,
            _bet_data&&_bet_data['win']||0,
        ];
    }else{
        _data = await AGENT.findOne({ attributes: ['dou','up_rate','down_rate','up_max'], where: { agent_id: id } });
        const { tgflman, tgflsum } = await UserTgflSum(id);
        // 
        Auth = {
            dou: _data.dou
        };
        _home = [
            _data.dou,
            zhekou(_data.up_rate),
            zhekou(_data.down_rate),
            _data.up_max,
            tgflman,
            tgflsum
        ];
    }
    // 
    const _user_log = await USERLOG.findOne({ attributes: ['time','ip'], where:{ user_id:id}, order:[['id','DESC']] });
    return {
        Auth,
        Userhome: [
            [
                [ _user.id, _user.nick, _user.level ],
                [ _user.role, dayjs(_user_log.time).format('YYYY-MM-DD HH:mm:ss'), _user_log.ip ]
            ],
            _home
        ]
    }
};
// 会员中心 - 首页 - 手机版
const homem = async(d) =>
{
    const { id } = d;
    const _user = await USERS.findOne({ attributes: ['id','level'], where:{id} });
    const _data = await USERDATA.findOne({ attributes: ['dou','bank'], where: { user_id: id } });
    const _time = dayjs().format('YYYY-MM-DD');
    const _bet_data = await USERDAYDATA.findOne({ attributes: ['bet','ls','win'], where: { user_id: id, time:_time } });
    Auth = {
        dou: _data.dou,
        bank: _data.bank,
        level: _user.level
    };
    return {
        Auth,
        Userhome: [
            _bet_data&&_bet_data['bet']||0,
            _bet_data&&_bet_data['ls']||0,
            _bet_data&&_bet_data['win']||0,
        ]
    }
};
// 
const dou = async(d) => 
{
    const { id } = d;
    const _user = await USERS.findOne({ attributes: ['id','nick','level','role'], where:{id} });
    // 
    let _data;
    let Auth;
    if(_user.role==1)
    {
        _data = await USERDATA.findOne({ attributes: ['dou','bank'], where: { user_id: id } });
        Auth = {
            dou: _data.dou,
            exp: _data.exp
        };
    }else{
        _data = await AGENT.findOne({ attributes: ['dou','up_rate','down_rate','up_max'], where: { agent_id: id } });
        Auth = {
            dou: _data.dou,
            up_rate: zhekou(_data.up_rate),
            down_rate: zhekou(_data.down_rate),
        };
    }
    return {
        Auth,
        UserGetDouLoading:''
    }
}
// 我的资料 - 获取
const wdzl = async(d) => 
{
    const { id } = d;
    const _user = await USERS.findOne({ attributes: ['nick','des','qq','wx','name'], where:{id} });
    return {
        Userwdzl: {
            nick: _user.nick,
            des: _user.des,
            qq: _user.qq||'',
            wx: _user.wx||'',
            name: _user.name||''
        }
    }
};
// 我的资料 - 修改
const wdzl_change = async(d) => 
{
    const { id, nick, des, qq, wx, name, sound } = d;
    // 
    const _user = await USERS.findOne({ attributes: ['nick','qq','wx','name'], where:{id} });
    // 
    let UserwdzlStatus = {};
    if (!/^[a-zA-Z0-9_\u4E00-\u9FA5]{2,16}$/.test(nick)) UserwdzlStatus['nick'] = { s: 'error', h: '格式为 a-zA-Z0-9_或中文，长度2-16' };
    if (!/^[a-zA-Z0-9_\u4E00-\u9FA5]{2,16}$/.test(des)) UserwdzlStatus['des'] = { s: 'error', h: '格式为 a-zA-Z0-9_或中文，长度2-16' };
    if (!_user.qq && !/^[0-9]{6,12}$/.test(qq)) UserwdzlStatus['parent'] = { s: 'error', h: '格式为 6-12位数字' };
    if (!_user.wx && !/^[a-zA-Z0-9\_\-]{6,30}$/.test(wx)) UserwdzlStatus['wx'] = { s: 'error', h: '格式为 a-zA-Z0-9_-长度6-30' };
    if (!_user.name && !/^[a-zA-Z\u4E00-\u9FA5]{2,30}$/.test(name)) UserwdzlStatus['name'] = { s: 'error', h: '格式为 a-zA-Z或中文，长度2-30' };
    // 
    if(nick!=_user.nick)
    {
        if(await USERS.findOne({ attributes: ['id'], where:{nick} })) UserwdzlStatus['nick'] = { s: 'error', h: '昵称已存在，请更换' };
    }
    // 
    if (Object.keys(UserwdzlStatus).length > 0) return { UserwdzlStatus, UserwdzlLoading: '' };
    // 
    let _update = {};
    _update['nick'] = nick;
    _update['des'] = des;
    if(!_user.qq) _update['qq'] = qq;
    if(!_user.wx) _update['wx'] = wx;
    if(!_user.name) _update['name'] = name;
    if(sound) _update['sound'] = sound;
    // 
    await USERS.update(_update, {
        where: { id }
    });
    //
    return {
        Auth:{ nick },
        Userwdzl:{ nick, qq, wx, name },
        UserwdzlLoading: '',
        UserwdzlStatus:{},
        M:{c:'恭喜您，修改成功！'}
    }
}
// 登录密码修改
const wdzl_dlmm_change = async(d) => 
{
    const { id, old, pass, re } = d;
    // 
    let UserdlmmStatus = {};
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(old)) UserdlmmStatus['old'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) UserdlmmStatus['pass'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(re)) UserdlmmStatus['re'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if(pass!==re) UserdlmmStatus['re'] = { s: 'error', h: '两次密码不一致' };
    // 
    const _user = await USERS.findOne({ attributes: ['pass'], where:{id} });
    if(!await cPass(old,_user.pass)) UserdlmmStatus['old'] = { s: 'error', h: '旧密码错误' };
    if (Object.keys(UserdlmmStatus).length > 0) return { UserdlmmStatus, UserdlmmLoading: '' };
    // 
    const _pass = await xPass(pass);
    await USERS.update({pass:_pass}, { where: { id } });
    return {
        M:{c:'登录密码，修改成功！'},
        UserdlmmLoading: '',
    }
}
// 安全码修改
const wdzl_aqm_change = async(d) => 
{
    const { id, old, pass, re } = d;
    // 
    let UseraqmStatus = {};
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(old)) UseraqmStatus['old'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) UseraqmStatus['pass'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(re)) UseraqmStatus['re'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if(pass!==re) UseraqmStatus['re'] = { s: 'error', h: '两次安全码不一致' };
    // 
    const _user = await USERS.findOne({ attributes: ['safe'], where:{id} });
    if(!await cPass(old,_user.safe)) UserdlmmStatus['old'] = { s: 'error', h: '旧安全码错误' };
    if (Object.keys(UseraqmStatus).length > 0) return { UseraqmStatus, UseraqmLoading: '' };
    // 
    const safe = await xPass(pass);
    await USERS.update({safe}, { where: { id } });
    return {
        M:{c:'安全码，修改成功！'},
        UseraqmLoading: '',
    }
}
//
const mrqd_go = async(d) => 
{
    let { id,uuidkey } = d;
    // 
    const _user = await USERS.findOne({ attributes: ['cs','role'], where:{id} });
    if(_user && ( _user.cs=='2' || _user.role=='2' ))
    {
        return { M:{c:'该账号类型不对，无法签到！'}, UserMrqdLoading:'' };
    }
    //
    const time = dayjs().format('YYYY-MM-DD');
    const _mrqd = await USERMRQD.findOne({where:{user_id:id,time}});
    if(_mrqd)
    {
        return {
            M:{c:'今日已签到，请明天再来！'},
            UserMrqdLoading:''
        }
    }
    //
    await SubDo({ 
        path:[ 'user', 'mrqd_go' ],
        data:{ uuidkey, id }
    });
}
//
const mrqd_list = async(d) => 
{
    let { id,page } = d;
    const { offset,limit } = await xpage(page);
    const { count,rows } = await USERMRQD.findAndCountAll({
        attributes: ['vip','num','dou','time'],
        where: { user_id: id },
        order: [ ['id','DESC'] ],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD'),
            v.vip,
            v.num,
            v.dou
        ])
    })
    return {
        UserMrqdList:[
            [page, count],
            list
        ]
    }
}
// 
const setsound = async(d) => 
{
    let { id } = d;
    // 
    const _user = await USERS.findOne({attributes:['sound'],where:{id}});
    const sound = _user&&['0','1'].find(v=>v==_user.sound) ? 2 : 1;
    await USERS.update({sound},{where:{id}});
    return {
        Auth:{sound},
        SoundLoading: ''
    }
}
//
module.exports = {
    home,
    homem,
    wdzl,
    wdzl_change,
    wdzl_dlmm_change,
    wdzl_aqm_change,
    dou,
    mrqd_go,
    mrqd_list,
    setsound
};