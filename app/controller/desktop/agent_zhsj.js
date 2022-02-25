// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERS, AGENTVIP } = require('../../sequelize/sd28');
// 
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    let where = { agent_id: id };
    // 
    const count = await AGENTVIP.count({ where });
    const rows = await AGENTVIP.findAll({
        attributes: ['id','user_id','user_nick','vip','time'],
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
            _v.vip
        ])
    };
    return {
        AgentZhsjList: [
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
    if (!/^[0-9]{6,12}$/.test(_user_id)) return { AgentzhsjUserCheckLoading: '',AgentzhsjStatus: {_user_id: { s: 'error' }}};
    if(id==_user_id) return { AgentzhsjUserCheckLoading: '',AgentzhsjStatus: {_user_id: { s: 'error' }}};
    const _user = await USERS.findOne({attributes: ['nick', 'role', 'status'], where:{id: _user_id}});
    if(!_user) return { AgentzhsjUserCheckLoading: '',AgentzhsjStatus: {_user_id: { s: 'error' }}};
    if(_user.role==2) return { AgentzhsjUserCheckLoading: '',AgentzhsjStatus: {_user_id: { s: 'error' }}};
    if(_user.status>1) return { AgentzhsjUserCheckLoading: '',AgentzhsjStatus: {_user_id: { s: 'error' }}};
    return {
        AgentzhsjUserCheckLoading: '',
        AgentzhsjStatus: {_user_id: { s: 'success' }}
    }
}
// 账号升级
const go = async(d) => 
{
    let { uuidkey, id, _user_id, vip } = d;
    //
    if(!/^[0-9]{6,12}$/.test(_user_id)) return { M:{c:'用户ID格式错误，请更正！'}, AGENTVIPStatus: {_user_id: { s: 'error' }}};
    if(!/^[1-7]$/.test(vip)) return { M:{c:'级别错误，请更正！'} };
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'zhsj', 'go' ],
        data:{ uuidkey, id, _user_id, vip }
    });
}
// 
module.exports = {
    list,
    id_check,
    go
};