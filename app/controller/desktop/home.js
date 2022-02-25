// 
const dayjs = require('dayjs');
const { HomeTopData } = require('../../service/home');
const { getNewLottery } = require('../../service/game');
// 
const { redis_sd28_auto_get, get_2 } = require('../../plugin/redis');
const { TITLE, CONTENT, USERS } = require('../../sequelize/sd28');
// numberToMoney
const { numberToMoney } = require('../../service/tool');
// 
const index = async(d) => {
    let Lottery = {};
    Lottery['Lotteryjnd28'] = await getNewLottery('jnd', '28');
    let HomeRank = (await redis_sd28_auto_get('rank_today')).slice(0,10);
    return {
        HomeTopData: await HomeTopData(),
        ...Lottery,
        HomeRank
    }
};
const news = async(d) => 
{
    const rows = await TITLE.findAll({
        attributes: ['id','title','time'],
        order: [['id','DESC']]
    });
    let NewList = [];
    const rowslen = rows.length;
    rows.map((v,k)=>{
        NewList.push([
            rowslen-k,
            v.title,
            dayjs(v.time).format('YYYY-MM-DD HH:mm:ss'),
            v.id
        ])
    });
    return {
        NewList,
    };
}
const news_get = async(d) => 
{
    const { _id } = d;
    // 
    const _title = await TITLE.findOne({where:{id:_id}});
    const _content = await CONTENT.findOne({where:{title_id:_id}});
    if(_content)
    {
        return { NewContent: [
            _title.title,
            dayjs(_title.time).format('YYYY-MM-DD HH:mm:ss'),
            _content.content.toString().replace(/\n/g, '<br>')
         ]}
    }
    return { NewContent: '' }
}
// 时间判断
const timeCheck = async(d) => 
{
    const { start_time, end_time } = d;
    // 
    const _start = dayjs(start_time).diff(dayjs(),'second');
    if(_start>0) return '<b>未开始</b>';
    //
    const _end = dayjs(end_time).diff(dayjs(),'second');
    if(_end<=0) return '<b>已结束</b>';
    //
    return '进行中';
}
const activy_table = async(d,odd,pix)=>
{
    let _r = '';
    for(let i in d)
    {
        let _di = d[i];
        _r+='<tr><td>'+_di['ls']+(odd||'')+'</td><td>'+_di['odd']+(pix||'')+'</td></tr>';
    }
    return _r;
}
const activy = async(d) => 
{
    const { id } = d;
    // 
    const _arr = ['HdflScfl','HdflYgz','HdflTzfl','HdflKsfl','HdflXxfl'];
    let _hdfl = {};
    for(let i in _arr)
    {
        const _n = _arr[i];
        _hdfl[_n] = await get_2(_n);
    }
    //
    let Activys = [];
    // 
    Activys[0] = 
        '<h3>首充返利</h3>'+
        '<p style="margin-bottom:10px">以每天第一笔充值为准，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利比例</th></tr>'+
        await activy_table(_hdfl['HdflScfl']['data'],' 倍',' %')+
        '</table></div>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflScfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflScfl']['start_time']+' 至 '+_hdfl['HdflScfl']['end_time']+'</p>'+
        '<p style="margin-bottom:25px;border-bottom:1px dashed #ddd;padding-bottom:25px">活动状态：'+await timeCheck(_hdfl['HdflScfl'])+'</p>'+
        '<h3>月工资</h3>'+
        '<p style="margin-bottom:10px">合计当月有效流水，隔月领取，当月未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利金豆</th></tr>'+
        await activy_table(_hdfl['HdflYgz']['data'],'',' 豆')+
        '</table></div>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflYgz']['start_time']+' 至 '+_hdfl['HdflYgz']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflYgz'])+'</p>'
    ;
    Activys[1] = 
        '<h3>投注返利</h3>'+
        '<p style="margin-bottom:10px">合计当天游戏投注金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<p>有效流水：<b>'+_hdfl['HdflTzfl']['ls']+'</b> 倍</p>'+
        '<p>返利比例：<b>'+_hdfl['HdflTzfl']['odd']+'</b> %</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflTzfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflTzfl']['start_time']+' 至 '+_hdfl['HdflTzfl']['end_time']+'</p>'+
        '<p style="margin-bottom:25px;border-bottom:1px dashed #ddd;padding-bottom:25px">活动状态：'+await timeCheck(_hdfl['HdflTzfl'])+'</p>'+
        '<h3>亏损返利</h3>'+
        '<p style="margin-bottom:10px">合计当天游戏投注亏损金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利比例</th></tr>'+
        await activy_table(_hdfl['HdflKsfl']['data'],' 倍',' %')+
        '</table></div>'+
        '<p>亏损金豆：<b>'+await numberToMoney(_hdfl['HdflKsfl']['dou'])+'</b> 豆起</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflKsfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflKsfl']['start_time']+' 至 '+_hdfl['HdflKsfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflKsfl'])+'</p>'
    ;
    Activys[2] = 
        '<h3>推广返利</h3>'+
        '<p style="margin-bottom:10px">合计邀请好友的游戏投注金豆，领取后清零，规则如下：</p>'+
        '<p>下线投注：<b>'+await numberToMoney(_hdfl['HdflXxfl']['dou'])+'</b> 豆起</p>'+
        '<p>返利比例：<b>'+_hdfl['HdflXxfl']['odd']+'</b> %</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflXxfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflXxfl']['start_time']+' 至 '+_hdfl['HdflXxfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflXxfl'])+'</p>'
    ;
    Activys[3] = 
        '<h3>美女空降</h3>'+
        '<p>当月超级VIP会员 总体亏损达到100万至200万可免费享受美女空降1至3次至尊服务</p>'+
        '<p>更可有机会抽取本平台 (ID11111至99999）纯数字ID一次 88888超级ID除外。</p>'+
        '<p>活动时间：2020-09-01 00:00 至 2020-09-30 00:00</p>'
    ;
    // 
    return {
        Activys
    }
}
//
const game = async(d) => 
{
    const { category, type } = d;
    // 
    const games = [
        'jnd28',
        'jnc28',
        'pksc',
        'dd28',
        'bj28',
        'elg28',
        'slfk28',
        'au28'
    ];
    if (!game || !games.find((v) => v == category + '' + type)) {
        return {
            HomeGameLoading: false
        };
    }
    // 
    let Lottery = {};
    Lottery['Lottery' + category + '' + type] = await getNewLottery(category, type);
    // 
    return {
        ...Lottery
    }
};
//
const rank = async(d) => 
{
    let RankToday = await redis_sd28_auto_get('rank_today_view');
    let RankYestoday = await redis_sd28_auto_get('rank_yestoday');
    let RankWeek = await redis_sd28_auto_get('rank_week');
    //
    return {
        RankToday,
        RankYestoday,
        RankWeek
    }
}
//
// 随机顺序
const randSort = async(arr) => 
{
    for(var i = 0,len = arr.length;i < len; i++ )
    {
        var rand = parseInt(Math.random()*len);
        var temp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
const agents = async() => 
{
    const rows = await USERS.findAll({
        attributes: ['id','nick','des','qq','wx'],
        where:{role:2,cs:1}
    });
    let Agents = [];
    let kf = [];
    for(let i in rows)
    {
        let v = rows[i];
        if(v.id=='888804')
        {
            kf = [
                v.nick,
                v.des,
                v.qq,
                v.wx
            ];
        }else{
            Agents.push([
                v.nick,
                v.des,
                v.qq,
                v.wx
            ])
        }
    }
    Agents = await randSort(Agents);
    Agents = [ kf, ...Agents ];
    return { Agents }
}

module.exports = {
    index,
    news,
    news_get,
    activy,
    game,
    rank,
    agents
};