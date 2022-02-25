// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { AGENTCARD, USERCARD, USERS, Op } = require('../../sequelize/sd28');
//
const check = async(d) => 
{
    const { id, uuidkey, list, checklist } = d;
    //
    const rows = await USERCARD.findAll({attributes:['id','user_id','user_name','km','money','status'],where:{km:checklist,status:2}});
    if(!rows || rows.length<=0) return {AgentCardLoading:'',kmlist:[],kmelist:checklist, kmsum:0, checkLoading:''};
    let kmilist = [];
    let user_id_s = [];
    let kmsum = 0;
    for(let i in rows)
    {
        const _ri = rows[i];
        kmilist.push({
            agent_id: id,
            user_id: _ri.user_id,
            user_name: _ri.user_name,
            user_card_id: _ri.id,
            km: _ri.km,
            money: _ri.money
        });
        user_id_s.push(_ri.user_id);
        kmsum+=parseInt(_ri.money);
    }
    // 
    if(kmilist.length>0)
    {
        let kmlist = [];
        let kmelist = [];
        for(let i in checklist)
        {
            let _li = checklist[i];
            let _kml = kmilist.find(v=>v.km==_li);
            if(_kml)
            {
                kmlist.push(_kml.km);
            }else{
                kmelist.push(_li);
            }
        }
        if(kmelist.length>0) return {AgentCardLoading:'',kmlist,kmelist, kmsum, checkLoading:''};
    }
    return { checkLoading:''}
    // 
};
// 
const go = async(d) => 
{
    const { id, uuidkey, list } = d;
    // 
    if(!list || list.length<=0)
    {
        return {M:{c:'请至少录入 1 张卡密！'}, AgentCardLoading:''}
    }
    // 
    if(list.length>50)
    {
        return {M:{c:'单次最多录入 50 张卡密！'}, AgentCardLoading:''}
    }
    //
    const rows = await USERCARD.findAll({attributes:['id','user_id','user_name','km','money','status'],where:{km:list,status:2}});
    if(!rows || rows.length<=0) return {M:{c:'卡密未审核，或没有符合回收条件，请检查！'},AgentCardLoading:'',kmlist:[],kmelist:list, kmsum:0};
    let kmilist = [];
    let user_id_s = [];
    let kmsum = 0;
    for(let i in rows)
    {
        const _ri = rows[i];
        kmilist.push({
            agent_id: id,
            user_id: _ri.user_id,
            user_name: _ri.user_name,
            user_card_id: _ri.id,
            km: _ri.km,
            money: _ri.money
        });
        user_id_s.push(_ri.user_id);
        kmsum+=parseInt(_ri.money);
    }
    // 
    if(kmilist.length>0)
    {
        let kmlist = [];
        let kmelist = [];
        for(let i in list)
        {
            let _li = list[i];
            let _kml = kmilist.find(v=>v.km==_li);
            if(_kml)
            {
                kmlist.push(_kml.km);
            }else{
                kmelist.push(_li);
            }
        }
        if(kmelist.length>0) return {M:{c:'部分卡密格式错误或未审核，请检查或联系客服！'},AgentCardLoading:'',kmlist,kmelist, kmsum};
    }
    let kmdou = parseInt(kmsum*1000);
    if(kmdou<=0) return {M:{c:'回收失败，请稍后再试！'},AgentCardLoading:'',kmlist:[],kmelist:[],kmsum:0};
    // 
    await SubDo({
        platform: 'agent',
        path:[ 'exchange', 'go' ],
        data:{ uuidkey, id, kmilist, kmdou, kmsum }
    });
    // 
}
const list = async(d) => 
{
    const { id, page, _user_id, time_start, time_end } = d;
    //
    const { offset,limit } = await xpage(page);
    let where = { agent_id: id };
    if(_user_id) where['user_id'] = _user_id;
    if(time_start)
    {
        where['time'] = {
            [Op.gte]: time_start,
            [Op.lte]: time_end,
        };
    };
    // 
    const count = await AGENTCARD.count({ where });
    const rows = await AGENTCARD.findAll({
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
            _v.user_name,
            _v.km,
            Math.round((parseFloat(_v.down_rate)*10)*1000)/1000,
            _v.agent_add
        ])
    };
    return {
        AgentCardList: [
            [page||1, count],
            list
        ]
    };
}
//
module.exports = {
    check,
    go,
    list
};