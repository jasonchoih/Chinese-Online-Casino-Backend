// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { AGENT, AGENTCASH } = require('../../sequelize/sd28');
// 提现列表
const list = async(d) => 
{
    const { id, type, mode, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { agent_id: id };
    if(type) where['type'] = type;
    if(mode) where['mode'] = mode;
    // 
    const count = await AGENTCASH.count({ where });
    const rows = await AGENTCASH.findAll({
        attributes: ['money','status','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.money,
            v.status
        ])
    });
    return {
        AgentdDltxList: [
            [page, count],
            list
        ]
    };
}
//
const go = async(d) => 
{
    let { uuidkey, id, money } = d;
    // 
    if(!/^[0-9]{1,12}$/.test(money)) return { M:{c:'提现金额格式错误，请检查！'}};
    money = parseInt(money);
    if(money<100) return { M:{c:'提现金额最低 100 元，请更正！'}};
    // 
    const _agent = await AGENT.findOne({where:{agent_id:id}});
    if(_agent)
    {
        const _agent_dou_ph = parseInt(_agent.dou/1000) - parseInt(_agent.ph);
        if(money > _agent_dou_ph) return { M:{c:'代理提现不能大于当前铺货金额 '+_agent_dou_ph+' 元'}};
    }
    // 
    const dou = parseInt(money*1000);
    //
    await SubDo({
        platform: 'agent',
        path:[ 'dltx', 'go' ],
        data:{ uuidkey, id, money, dou  }
    });
}
// 
module.exports = {
    list,
    go
};