// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERS, AGENTCHARGE, Op } = require('../../sequelize/sd28');
// 
const list = async(d) => 
{
    const { id, page, _user_id, status, time_start, time_end } = d;
    //
    const { offset,limit } = await xpage(page);
    let where = { agent_id: id };
    if(_user_id) where['user_id'] = _user_id;
    if(status) where['status'] = status;
    if(time_start)
    {
        where['time'] = {
            [Op.gte]: time_start,
            [Op.lte]: time_end,
        };
    };
    // 
    const count = await AGENTCHARGE.count({ where });
    const rows = await AGENTCHARGE.findAll({
        attributes: ['id','user_id','user_nick','money','up_rate','agent_cut_dou','time','status'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    for(let i in rows)
    {
        const _v = rows[i];
        list.push([
            dayjs(_v.time).format('YY-MM-DD HH:mm:ss'),
            _v.user_id,
            _v.user_nick,
            _v.money,
            _v.up_rate,
            _v.agent_cut_dou,
            _v.status==1 ? await dayjs().diff(_v.time, 'second') > 300 ? 2 : _v.status : _v.status,
            _v.id
        ])
    };
    return {
        AgentChargeList: [
            [page||1, count],
            list
        ]
    };
}
// 
const id_check = async(d) => 
{
    const { id, _user_id } = d;
    // 
    if (!/^[0-9]{6,12}$/.test(_user_id)) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['账号格式错误!']};
    if(id==_user_id) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['不能给自己充值!']};
    const _user = await USERS.findOne({attributes: ['level', 'nick', 'role', 'cs', 'status'], where:{id: _user_id}});
    if(!_user) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['该账号无法充值']};
    if(_user.role==2) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['该账号无法充值']};
    if(_user.status!=1) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['该账号无法充值']};
    if(_user.cs==2) return { AgentdlczUserCheckLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}, AgentdlczUserInfo:['该账号无法充值'] };
    return {
        AgentdlczUserCheckLoading: '',
        AgentdlczStatus: {_user_id: { s: 'success' }},
        AgentdlczUserInfo:[_user.nick, 'vip '+_user.level]
    }
}
// 代理充值
const go = async(d) => 
{
    let { uuidkey, id, _user_id, money } = d;
    // 
    // 
    const _user = await USERS.findOne({ attributes: ['cs','role','status'], where:{id: _user_id} });
    if(!_user || _user.cs=='2' || _user.role==2 || _user.status!=1 )
    {
        return { M:{c:'该账号无法充值'} };
    }
    //
    if(!/^[0-9]{6,12}$/.test(_user_id)) return { M:{c:'用户ID格式错误，请更正！'}, AgentdlczLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}};
    if(!/^\d{1,7}$/.test(money)) return { M:{c:'充值金额格式错误，请更正！'}, AgentdlczLoading: '',AgentdlczStatus: {money: { s: 'error' }}};
    if(!money) return { M:{c:'请输入充值金额！'}, AgentdlczLoading: '',AgentdlczStatus: {money: { s: 'error' }}};
    money = parseInt(money); 
    if(money<=0) return { M:{c:'充值金额最低 1 元，请更正！'}, AgentdlczLoading: '',AgentdlczStatus: {money: { s: 'error' }}};
    if(id==_user_id) return { M:{c:'不能给自己的账号充值！'} ,AgentdlczLoading: '',AgentdlczStatus: {_user_id: { s: 'error' }}};
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'charge', 'go' ],
        data:{ uuidkey, id, _user_id, money }
    });
}
// 充值撤回
const back = async(d) => 
{
    let { uuidkey, id, _id } = d;
    // 
    if(!_id || _id<=0) return { M:{c:'撤回失败，请稍后再试！'} };
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'charge', 'back' ],
        data:{ uuidkey, id, _id }
    });
}
// 
module.exports = {
    list,
    id_check,
    go,
    back
};