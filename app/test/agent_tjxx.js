// 
const dayjs = require("dayjs");
const { QueryTypes, sequelize, AGENTDAYDATA, AGENTSUM } = require('../../sequelize/sd28');
// 
const sums = async({id,time}) => 
{
    const type = '%Y-%m';
    const lists = await sequelize.query('SELECT '+
    'DATE_FORMAT(time,?) as times,'+
    'sum(charge) as charges,'+
    'sum(charge_rate) as charge_rates,'+
    'sum(exchange) as exchanges,'+
    'sum(exchange_rate) as exchange_rates,'+
    'sum(rate_sum) as rate_sums'+
    " FROM agent_day_data where agent_id=? and time like '"+time+"%' GROUP BY times ORDER BY times DESC", 
    {
        replacements: [type,id],
        type: QueryTypes.SELECT,
        plain: true,
    });
    // 
    if(lists)
    {
        return [
            time+'',
            lists.charges,
            parseInt(parseInt(lists.charge_rates)/1000),
            lists.exchanges,
            parseInt(parseInt(lists.exchange_rates)/1000),
            parseInt(parseInt(lists.rate_sums)/1000),
        ];
    }
    return [time+'',0,0,0,0,0];
}
// 
const getDays = async(fix) => 
{
    const days = dayjs().daysInMonth();
    let _r = [];
    for(let i=1;i<=days;i++)
    {
        let _ii = i<10 ? '0'+i : i;
        _r.unshift(fix+''+_ii)
    }
    _r.push('sum');
    return _r;
}
const getMonths = async(fix) => 
{
    let _r = [];
    for(let i=1;i<13;i++)
    {
        let _ii = i<10 ? '0'+i : i;
        _r.unshift(fix+''+_ii)
    }
    _r.push('sum');
    return _r;
}
const getDatas = async({type,id,time,list}) => 
{
    const lists = await sequelize.query('SELECT '+
    'DATE_FORMAT(time,?) as times,'+
    'sum(charge) as charges,'+
    'sum(charge_rate) as charge_rates,'+
    'sum(exchange) as exchanges,'+
    'sum(exchange_rate) as exchange_rates,'+
    'sum(rate_sum) as rate_sums'+
    " FROM agent_day_data where agent_id=? and time like '"+time+"%' GROUP BY times ORDER BY times DESC", 
    {
        replacements: [type,id],
        type: QueryTypes.SELECT,
        plain: false,
    });
    let _r = {};
    let AgentTjxxListSum = [0,0,0,0,0];
    for(let i in lists)
    {
        const _li = lists[i];
        _r[_li.times] = 
        [
            _li.charges,
            parseInt(parseInt(_li.charge_rates)/1000),
            _li.exchanges,
            parseInt(parseInt(_li.exchange_rates)/1000),
            parseInt(parseInt(_li.rate_sums)/1000)
        ];
        AgentTjxxListSum[0]+= _li.charges;
        AgentTjxxListSum[1]+= _li.charge_rates;
        AgentTjxxListSum[2]+= _li.exchanges;
        AgentTjxxListSum[3]+= _li.exchange_rates;
        AgentTjxxListSum[4]+= _li.rate_sums;
    }
    // 
    _r['sum'] = AgentTjxxListSum;
    let AgentTjxxList = [];
    for(let i in list)
    {
        const _li = list[i];
        const _dd = _r[_li] ? _r[_li] : [];
        AgentTjxxList.push([
            _li,
            ..._dd
        ]);
    }
    // 
    return {AgentTjxxList};
}
// 
const now = async(d) => 
{
    const { id } = d;
    //
    const type = '%Y-%m-%d';
    const time = dayjs().format('YYYY-MM-')+'';
    const list = await getDays(dayjs().format('YYYY-MM-'));
    //
    return {
        AgentTjxxLoading:'',
        ...await getDatas({id,type,time,list}),
        AgentTjxx:[
            (await sums({id, time:dayjs().subtract(4, 'month').format('YYYY-MM')})),
            (await sums({id, time:dayjs().subtract(3, 'month').format('YYYY-MM')})),
            (await sums({id, time:dayjs().subtract(2, 'month').format('YYYY-MM')})),
            (await sums({id, time:dayjs().format('YYYY-MM')})),
        ]
    }
}
// 
const year = async(d) => 
{
    const { id,year } = d;
    //
    const type = '%Y-%m';
    const time = year+'-';
    const list = await getMonths(year+'-');
    //
    return {
        AgentTjxxLoading:'',
        ...await getDatas({id,type,time,list})
    }
}
// 
const month = async(d) => 
{
    const { id,month } = d;
    //
    const type = '%Y-%m-%d';
    const time = month+'-';
    const list = await getDays(month+'-');
    //
    return {
        AgentTjxxLoading:'',
        ...await getDatas({id,type,time,list})
    }
}
// 
module.exports = {
    now,
    year,
    month
};