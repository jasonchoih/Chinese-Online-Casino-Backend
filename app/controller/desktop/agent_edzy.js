// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { Op, USERS, AGENT, AGENTEDZY } = require('../../sequelize/sd28');
// 
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    let where = {
        [Op.or]: [
            { form_agent_id: id },
            { to_agent_id: id }
        ]
    };
    // 
    const count = await AGENTEDZY.count({ where });
    const rows = await AGENTEDZY.findAll({
        // attributes: ['id','form_agent_id','form_agent_nick','to_agent_id','to_agent_nick','money','dou','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    for(let i in rows)
    {
        const v = rows[i];
        if(id==v.form_agent_id)
        {
            list.push([
                dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
                1,
                v.to_agent_id,
                v.to_agent_nick,
                v.money,
                v.status,
                v.id
            ]);
        }else{
            list.push([
                dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
                2,
                v.form_agent_id,
                v.form_agent_nick,
                v.money,
                v.status,
                v.id
            ]);
        }
    };
    return {
        AgentEdzyList: [
            [page||1, count],
            list
        ],
        ...await getAgent(id),
        AgentEdzySelectLoading: 1
    };
}
// 
const getAgent = async(id) => 
{
    const rows = await USERS.findAll({
        attributes: ['id','nick'],
        where:{role:2,status:1,cs:1}
    });
    let AgentEdzySelectList = {};
    let kf = {};
    for(let i in rows)
    {
        let v = rows[i];
        if(v.id!=id)
        {
            if(v.id=='888804')
            {
                kf[v.id] = v.nick;
            }else{
                AgentEdzySelectList[v.id] = v.nick;
            }
        }
    }
    AgentEdzySelectList = { ...kf, ...AgentEdzySelectList };
    //
    return { AgentEdzySelectList };
}
// 
const id_check = async(d) => 
{
    const { id, _user_id } = d;
    // 
    if (!/^[0-9]{6,12}$/.test(_user_id)) return { AgentedzyUserCheckLoading: '',AgentedzyStatus: {_user_id: { s: 'error' }}};
    if(id==_user_id) return { AgentedzyUserCheckLoading: '',AgentedzyStatus: {_user_id: { s: 'error' }}};
    const _agent = await AGENT.findOne({attributes:['id'], where:{agent_id: _user_id}});
    if(!_agent) return { AgentedzyUserCheckLoading:'',AgentedzyStatus:{_user_id: { s: 'error' }}};
    return {
        AgentedzyUserCheckLoading: '',
        AgentedzyStatus: {_user_id: { s: 'success' }}
    }
}
// 额度转移
const go = async(d) => 
{
    let { uuidkey, id, _user_id, money } = d;
    //
    if(!/^[0-9]{6,12}$/.test(_user_id)) return { M:{c:'用户ID格式错误，请更正！'}, AgentedzyStatus: {_user_id: { s: 'error' }}};
    if(!/^\d{1,12}$/.test(money)) return { M:{c:'转移金额格式错误，请更正！'}, AgentedzyStatus: {money: { s: 'error' }}};
    if(!money) return { M:{c:'请输入转移金额！'}, AgentedzyStatus: {money: { s: 'error' }}};
    money = parseInt(money); 
    if(money<=0) return { M:{c:'转移金额最低 1 元，请更正！'}, AgentedzyStatus: {money: { s: 'error' }}};
    if(id==_user_id) return { M:{c:'不能给自己的账号转移！'} ,AgentedzyStatus: {_user_id: { s: 'error' }}};
    // 
    const _agent = await AGENT.findOne({where:{agent_id:id}});
    if(_agent)
    {
        const _agent_dou_ph = parseInt(_agent.dou/1000) - parseInt(_agent.ph);
        if(money > _agent_dou_ph) return { M:{c:'额度转移不能大于当前铺货金额 '+_agent_dou_ph+' 元'}};
    }
    // 
    const _agent_to = await AGENT.findOne({where:{agent_id:_user_id}});
    if(!_agent_to) return { M:{c:'转移ID不存在，请更正！'},AgentedzyUserCheckLoading:'',AgentedzyStatus: {_user_id: { s: 'error' }}};
    const _users_to = await USERS.findOne({where:{id:_user_id}});
    if(!_users_to || _users_to.status!==1) return { M:{c:'不能给该ID进行额度转移，请更正！'},AgentedzyUserCheckLoading:'',AgentedzyStatus: {_user_id: { s: 'error' }}};
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'edzy', 'one' ],
        data:{ uuidkey, id, _user_id, _user_nick: _users_to.nick, _user_id_uuid:_user_id+'-'+_users_to.uuid,  money }
    });
}
// 额度转移-确认接收
const two = async(d) => 
{
    let { uuidkey, id, _id } = d;
    //
    if(!/^[0-9]{1,12}$/.test(_id)) return { M:{c:'数据错误，请稍后再试！'}};
    const edzy = await AGENTEDZY.findOne({where:{id:_id,to_agent_id:id,status:1}});
    if(!edzy) return { M:{c:'该转移不存在或已客服取消，请检查！'},AgentEdzyReload:dayjs().valueOf()};
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'edzy', 'two' ],
        data:{ uuidkey, id, _id, form_agent_id:edzy.form_agent_id, form_agent_nick:edzy.form_agent_nick }
    });
}
// 额度转移-确认转出
const thr = async(d) => 
{
    let { uuidkey, id, _id } = d;
    //
    if(!/^[0-9]{1,12}$/.test(_id)) return { M:{c:'数据错误，请稍后再试！'}};
    const edzy = await AGENTEDZY.findOne({where:{id:_id,form_agent_id:id,status:2}});
    if(!edzy) return { M:{c:'该转移不存在或已客服取消，请检查！'},AgentEdzyReload:dayjs().valueOf()};
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'edzy', 'thr' ],
        data:{ uuidkey, id, _id, to_agent_id:edzy.to_agent_id  }
    });
}
// 
module.exports = {
    list,
    id_check,
    go,
    two,
    thr
};