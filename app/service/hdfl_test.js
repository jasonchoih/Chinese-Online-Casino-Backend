// 
const dayjs = require("dayjs");
const { get_2 } = require('../plugin/redis');
const { numberToMoney } = require('./tool');
const { QueryTypes, sequelize, USERTGFL, USERDAYDATA, USERS } = require('../sequelize/sd28');
// 
const names = {
    'HdflScfl': '昨日首充',
    'HdflTzfl': '昨日投注',
    'HdflKsfl': '昨日亏损',
    'HdflXxfl': '下线推广'
}
// 空数据
const reData = async(name, status) => 
{
    return [names[name],0,0,0,status];
}
// 时间判断
const timeCheck = async(d) => 
{
    const { name, start_time, end_time } = d;
    // 未开始
    const _start = dayjs(start_time).diff(dayjs(),'second');
    if(_start>0) return await reData(name, '未开始');
    // 已结束
    const _end = dayjs(end_time).diff(dayjs(),'second');
    if(_end<=0) return await reData(name, '已结束');
    //
    return '';
}
// 最高返利
const reMax = async(_r, max) => 
{
    if(_r > max) return max;
    return _r;
}
// 阶梯赔率
const oddCheck = async(data, ls) => 
{
    let _d = [ ...data, { ls, odd:'-' } ]; // 组合
    _d.sort( (a, b) => { return parseFloat(a.ls) - parseFloat(b.ls) }); // 排序
    const _i = _d.findIndex(v=>v.odd=='-'); // 取位
    const _ii = _i-1; // 位置
    if(_ii==-1) return { ls:data[0]['ls'],odd:'0' };
    return _d[_ii];
}
// 下线昨日投注
const getXxflData = async ({ parent, yestoday }) =>
{
    const _parents = await USERS.findAll({attributes: ['id'],where:{ parent }});
    if(_parents)
    {
        let _user_ids = [];
        for(let i in _parents)
        {
            const _pi = _parents[i];
            _user_ids.push(_pi.id);
        }
        if(_user_ids.length>0)
        {
            const _bets = await sequelize.query('SELECT '+
            'sum(ls) as bets '+
            " FROM user_day_data where user_id in ("+_user_ids+") and time=?", 
            {
                replacements: [yestoday],
                type: QueryTypes.SELECT,
                plain: true,
            });
            if(_bets && _bets.bets) return parseInt(_bets.bets);
        }
        return 0;
    }
    return 0;
}
// 
let optS = {};
// 首充返利
optS['HdflScfl'] = async(d) => 
{
    const _check = await timeCheck(d);
    if(_check) return _check;
    let { name, _ls, data, max, _day_first_charge } = d;
    // 
    if(!_day_first_charge || _day_first_charge=='0')
    {
        return await reData(name, 0);
    }
    max = parseInt(max); // 最高返利
    const userchargemoney = parseInt(_day_first_charge);
    const userchargedou = parseInt( userchargemoney *  1000 );
    _ls = parseInt(_ls); 
    const _charge_ls_odd = parseFloat(_ls / userchargedou);
    const { ls, odd } = await oddCheck(data, _charge_ls_odd);
    // 
    if(odd=='0')
    {
        return [
            names[name],
            userchargemoney,
            odd,
            0,
            '流水不足 '+ls+' 倍'
        ]
    }
    //
    return [
        names[name],
        userchargemoney,
        odd,
        await reMax(parseInt(userchargedou * parseFloat(odd/100)), max),
        1
    ]
}
// 投注返利
optS['HdflTzfl'] = async(d) => 
{
    const _check = await timeCheck(d);
    if(_check) return _check;
    let { name, _bet, _ls, ls, max, odd } = d;
    // 
    if(_bet<=0)
    {
        return await reData(name, 0);
    }
    // 
    max = parseInt(max); // 最高返利
    odd = parseFloat(odd); // 返利倍数
    ls = parseFloat(ls); // 流水倍数
    // 
    // const _bet_ls_odd = parseFloat(_ls / _bet);
    if(_bet <= 0)
    {
        return [
            names[name],
            _bet,
            odd,
            0,
            '无有效流水'
        ]
    }
    return [
        names[name],
        _bet,
        odd,
        await reMax(parseInt(_bet * parseFloat(odd/100)), max),
        1
    ]
}
// 亏损返利
optS['HdflKsfl'] = async(d) => 
{
    const _check = await timeCheck(d);
    if(_check) return _check;
    let { name, _win, dou, _ls, data, max } = d;
    // 
    if(_win>=0)
    {
        return await reData(name, 0);
    }
    dou = parseInt(dou); // 最低亏损多少豆起
    max = parseInt(max); // 最高返利
    // 
    const __win = -(_win);
    //
    const _win_ls_odd = parseFloat(_ls / __win);
    const { ls, odd } = await oddCheck(data, _win_ls_odd);
    // 
    if(__win < dou)
    {
        return [
            names[name],
            __win,
            odd,
            0,
            '亏损 '+await numberToMoney(dou)+' 豆起'
        ]
    };
    // 
    if(odd=='0')
    {
        return [
            names[name],
            __win,
            odd,
            0,
            '流水不足 '+ls+' 倍'
        ]
    }
    return [
        names[name],
        __win,
        odd,
        await reMax(parseInt(__win * parseFloat(odd/100)), max),
        1
    ]
}
// 下线返利
optS['HdflXxfl'] = async(d) => 
{
    const _check = await timeCheck(d);
    if(_check) return _check;
    let { name, dou, odd, max, user_id, yestoday } = d;
    // 
    const usertgfl = await getXxflData({
        parent: user_id,
        yestoday
    });
    //
    if(!usertgfl || usertgfl=='0' || usertgfl<=0)
    {
        return await reData(name, 0);
    }
    if(usertgfl<=parseInt(dou))
    {
        return [
            names[name],
            usertgfl,
            odd,
            0,
            '低于 '+dou+' 豆'
        ]
    }
    //
    const parentbetdou = parseInt(usertgfl);
    max = parseInt(max); // 最高返利
    odd = parseFloat(odd); // 返利倍数
    return [
        names[name],
        parentbetdou,
        odd,
        await reMax(parseInt(parentbetdou * parseFloat(odd/100)), max),
        1
    ]
}
// 获取活动返利
const getHdfl = async({ user_id }) => 
{
    const yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    // 
    // 昨日流水 / 昨日投注 / 昨日盈亏 / 昨日首充
    const userdaydata = await USERDAYDATA.findOne({
        attributes: ['ls','bet','win','day_first_charge','scfl','tzfl','ksfl','xxfl'],
        where:{
            user_id,
            time: yestoday
        }
    });
    _ud = { _ls: 0, _bet: 0, _win: 0, _day_first_charge: 0  };
    if(userdaydata)
    {
        _ud = {
            _ls: parseInt(userdaydata.ls),
            _bet: parseInt(userdaydata.bet),
            _win: parseInt(userdaydata.win),
            _day_first_charge: parseInt(userdaydata.day_first_charge),
        };
    }
    // 
    const _arri = ['scfl','tzfl','ksfl','xxfl'];
    const _arr = ['HdflScfl','HdflTzfl','HdflKsfl','HdflXxfl'];
    let UserHdfl = [];
    for(let i in _arr)
    {
        const _ni = _arri[i];
        const _n = _arr[i];
        //
        // console.log(userdaydata[_ni], _ni);
        //
        if(userdaydata&&userdaydata[_ni]&&userdaydata[_ni]==2)
        {
            UserHdfl.push(await reData(_n, '已领取'));
        }else{
            UserHdfl.push(await optS[_n]({
                name: _n,
                ...await get_2(_n),
                ..._ud,
                user_id,
                yestoday
            }))
        }
    }
    // 
    let sum = 0;
    for(let i in UserHdfl)
    {
        sum+=UserHdfl[i][3];
    }
    // 
    return {
        UserHdfl,
        UserHdflHave: !!sum,
    };
}
// 
const getYgzMonthData = async(user_id, prev_month) => 
{
    const _user_day_data = await sequelize.query('SELECT '+
    'sum(ls) as lss'+
    " FROM user_day_data where user_id=? and time like '"+prev_month+"%' ", 
    {
        replacements: [user_id],
        type: QueryTypes.SELECT,
        plain: true,
    });
    // 
    if(_user_day_data && _user_day_data.lss) return _user_day_data.lss;
    return 0;
}
const ygzOddCheck = async(data, lss) => 
{
    const _d = await oddCheck(data, lss);
    if(!_d || !_d.odd || _d.odd=='0') return '-';
    return _d.odd;
}
const getYgz = async({ user_id }) => 
{
    // 
    const _gz = await get_2('HdflYgz');
    const start_time = _gz.start_time;
    const end_time = _gz.end_time;
    // 未开始
    const _start = dayjs(start_time).diff(dayjs(),'second');
    if(_start>0)
    {
        return {
            UserYgzHave: false,
            HdflYgz:[
                [
                    '-',
                    0,
                    0,
                    '活动未开始'
                ]
            ]
        }
    }
    // 已结束
    const _end = dayjs(end_time).diff(dayjs(),'second');
    if(_end<=0)
    {
        return {
            UserYgzHave: false,
            HdflYgz:[
                [
                    '-',
                    0,
                    0,
                    '活动已结束'
                ]
            ]
        }
    }
    // 
    const this_month = dayjs().startOf('month').format('YYYY-MM-DD'); // 本月，第一天
    const this_month_last = dayjs().endOf('month').format('YYYY-MM-DD'); // 月底
    const now_month = dayjs().format('YYYY-MM');
    const prev_month = dayjs(this_month).subtract(1, 'month').format('YYYY-MM'); // 上月
    const need_day = dayjs(this_month_last).diff(dayjs(), 'day')+1; // 本月距离领取天数
    // 
    const prev_lss = await getYgzMonthData(user_id, prev_month);
    const now_lss = await getYgzMonthData(user_id, now_month);
    // 检查 上月 是否已领取，记录在本月份第一天
    const userdaydata = await USERDAYDATA.findOne({attributes:['ygz'],where:{user_id,time: this_month}});
    // 
    const ygz = userdaydata&&userdaydata.ygz || 1;
    return {
        UserYgzHave: ygz,
        HdflYgz:[
            [
                now_month,
                now_lss,
                await ygzOddCheck(_gz.data, now_lss),
                need_day+' 天后领取'
            ],
            [
                prev_month,
                prev_lss,
                await ygzOddCheck(_gz.data, prev_lss),
                !prev_lss ? '-' : ygz
            ]
        ]
    }
}
//
module.exports = {
    getHdfl,
    getYgz
};