// const { getNewLottery } = require('../service/game');
// const { USERS } = require('../sequelize/sd28');
// // 
// const index = async(d) => 
// {
//     // const { id } = d;
//     // // 
//     // const games = {
//     //     'jnd': 28,
//     //     'dd' : 28,
//     //     'pk' : 10
//     // };
//     // // 
//     // let Lottery = {};
//     // let Auth = {};
//     // for ( let i in games )
//     // {
//     //     Lottery['Lottery'+i+''+games[i]] = await getNewLottery(i, games[i])
//     // }
//     // // 
//     // let _user; 
//     // if (d) _user = await USERS.findOne({ attributes: ['user'], where: { id } });
//     // if (!_user) console.log({
//     //     ...Lottery
//     // })
//     // // 
//     // Auth['user'] = _user.user;
//     // // 
//     // console.log({
//     //     ...Lottery,
//     //     Auth
//     // })
//     // const _user = await USERS.findOne({ attributes: ['user'], where: { id :d} });
//     // console.log(_user);
// };
// 
// index(888000); 
// module.exports = {
//     index
// };
// ====================================================================================
// const dayjs = require('dayjs');
// const { get_2 } = require('../plugin/redis');
// const { numberToMoney } = require('../service/tool');
// // 
// // 时间判断
// const timeCheck = async(d) => 
// {
//     const { start_time, end_time } = d;
//     // 
//     const _start = dayjs(start_time).diff(dayjs(),'second');
//     if(_start>0) return '<b>未开始</b>';
//     //
//     const _end = dayjs(end_time).diff(dayjs(),'second');
//     if(_end<=0) return '<b>已结束</b>';
//     //
//     return '进行中';
// }
// const activy_table = async(d,odd,pix)=>
// {
//     let _r = '';
//     for(let i in d)
//     {
//         let _di = d[i];
//         _r+='<tr><td>'+_di['ls']+(odd||'')+'</td><td>'+_di['odd']+(pix||'')+'</td></tr>';
//     }
//     return _r;
// }
// // 
// const activy = async(d) => 
// {
//     const _arr = ['HdflScfl','HdflYgz','HdflTzfl','HdflKsfl','HdflXxfl'];
//     let _hdfl = {};
//     for(let i in _arr)
//     {
//         const _n = _arr[i];
//         _hdfl[_n] = await get_2(_n);
//     }
//     //
//     let Activys = [];
//     // 
//     Activys[0] = 
//         '<h3>首充返利</h3>'+
//         '<p style="margin-bottom:10px">以每天第一笔充值为准，隔天领取，当天未领取则失效，规则如下：</p>'+
//         '<div class="boe br5 table mb10"><table class="hover">'+
//         '<tr><th>有效流水</th><th>返利比例</th></tr>'+
//         await activy_table(_hdfl['HdflScfl']['data'],' 倍',' %')+
//         '</table></div>'+
//         '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflScfl']['max'])+'</b> 豆</p>'+
//         '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflScfl']['start_time']+' 至 '+_hdfl['HdflScfl']['end_time']+'</p>'+
//         '<p style="margin-bottom:25px;border-bottom:1px dashed #ddd;padding-bottom:25px">活动状态：'+await timeCheck(_hdfl['HdflScfl'])+'</p>'
//     ;
//     Activys[1] = 
//         '<h3>月工资</h3>'+
//         '<p style="margin-bottom:10px">合计当月有效流水，隔月领取，当月未领取则失效，规则如下：</p>'+
//         '<div class="boe br5 table mb10"><table class="hover">'+
//         '<tr><th>有效流水</th><th>返利金豆</th></tr>'+
//         await activy_table(_hdfl['HdflYgz']['data'],'',' 豆')+
//         '</table></div>'+
//         '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflYgz']['start_time']+' 至 '+_hdfl['HdflYgz']['end_time']+'</p>'+
//         '<p>活动状态：'+await timeCheck(_hdfl['HdflYgz'])+'</p>'
//     ;
//     Activys[2] = 
//         '<h3>投注返利</h3>'+
//         '<p style="margin-bottom:10px">合计当天游戏投注金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
//         '<p>有效流水：<b>'+_hdfl['HdflTzfl']['ls']+'</b> 倍</p>'+
//         '<p>返利比例：<b>'+_hdfl['HdflTzfl']['odd']+'</b> %</p>'+
//         '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflTzfl']['max'])+'</b> 豆</p>'+
//         '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflTzfl']['start_time']+' 至 '+_hdfl['HdflTzfl']['end_time']+'</p>'+
//         '<p style="margin-bottom:25px;border-bottom:1px dashed #ddd;padding-bottom:25px">活动状态：'+await timeCheck(_hdfl['HdflTzfl'])+'</p>'
//     ;
//     Activys[3] = 
//         '<h3>亏损返利</h3>'+
//         '<p style="margin-bottom:10px">合计当天游戏投注亏损金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
//         '<div class="boe br5 table mb10"><table class="hover">'+
//         '<tr><th>有效流水</th><th>返利比例</th></tr>'+
//         await activy_table(_hdfl['HdflKsfl']['data'],' 倍',' %')+
//         '</table></div>'+
//         '<p>亏损金豆：<b>'+await numberToMoney(_hdfl['HdflKsfl']['dou'])+'</b> 豆起</p>'+
//         '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflKsfl']['max'])+'</b> 豆</p>'+
//         '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflKsfl']['start_time']+' 至 '+_hdfl['HdflKsfl']['end_time']+'</p>'+
//         '<p>活动状态：'+await timeCheck(_hdfl['HdflKsfl'])+'</p>'
//     ;
//     Activys[4] = 
//         '<h3>推广返利</h3>'+
//         '<p style="margin-bottom:10px">合计邀请好友的游戏投注金豆，领取后清零，规则如下：</p>'+
//         '<p>下线投注：<b>'+await numberToMoney(_hdfl['HdflXxfl']['dou'])+'</b> 豆起</p>'+
//         '<p>返利比例：<b>'+_hdfl['HdflXxfl']['odd']+'</b> %</p>'+
//         '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflXxfl']['max'])+'</b> 豆</p>'+
//         '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflXxfl']['start_time']+' 至 '+_hdfl['HdflXxfl']['end_time']+'</p>'+
//         '<p>活动状态：'+await timeCheck(_hdfl['HdflXxfl'])+'</p>'
//     ;
//     Activys[5] = 
//         '<h3>美女空降</h3>'+
//         '<p>当月超级VIP会员 总体亏损达到100万至200万可免费享受美女空降1至3次至尊服务</p>'+
//         '<p>更可有机会抽取本平台 (ID11111至99999）纯数字ID一次 88888超级ID除外。</p>'+
//         '<p>活动时间：2020-09-01 00:00 至 2020-09-30 00:00</p>'
//     ;
//     // 
//     return {
//         Activys
//     }
// }
// // 

//====================================================================================================================================================
// 
// const dayjs = require('dayjs');
// const { sequelize, QueryTypes } = require('../sequelize/sd28');
// // 
// const today = dayjs().format('YYYY-MM-DD');
// const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD');
// const daybefore = dayjs().add(-2, 'day').format('YYYY-MM-DD')
// const fourDaysBefore = dayjs().add(-4, 'day').format('YYYY-MM-DD');
// const fiveDaysBefore = dayjs().add(-5, 'day').format('YYYY-MM-DD');
// const sixDaysBefore = dayjs().add(-6, 'day').format('YYYY-MM-DD');
// const sevenDaysBefore = dayjs().add(-7, 'day').format('YYYY-MM-DD');
// // 
// const CategoryTypes = {
//     jnd:[28,11,16,36,'28gd'],
//     pk:['sc','gyh',10,22,'gj','lh'],
//     jnc:[28,11,16,36,'28gd'],
//     bj:[28,11,16,36,'28gd'],
//     dd:[28,11,16,36,'28gd'],
//     elg:[28,11,16,36,'28gd'],
//     slfk:[28,11,16,36,'28gd'],
//     au:[28,11,16,36,'28gd'],
//     kr:[28,11,16,36,'28gd'],
//     btc:[28,11,16,36,'28gd'],
//     q214:[
//       'jnd','jnc','bj','dd','au','elg','slfk','btc','kr'
//     ],
//     q28:[
//       'jnd','jnc','bj','dd','au','elg','slfk','btc','kr'
//     ],
// };
// // 

// const getGameData = async(d) =>
// { 
//     const { id ,time, category, type } = d;
//     // 
//     const _userbetdata = await sequelize.query(`
//         SELECT  SUM(win) AS win
//         FROM    user_bet_data
//         WHERE   user_id = ${id}
//         AND     time = '${time}'
//         AND     category = '${category}'
//         AND     type = '${type}'
//         GROUP BY time , category, type
//         ORDER BY time`,
//     {
//         type: QueryTypes.SELECT,
//         plain: false,
//     });
//     // 
//     let list;
//     list = (_userbetdata[0]&&_userbetdata[0].win) || 0;
//     return list;
// };
// // 
// // getGameData({id: 888800 ,time:today, category:'btc', type:'28'});
// // 
// const test = async(id)=>
// {
//     const games = {};
//     // 
//     for (let i in CategoryTypes)
//     {
//         for (let j=0; j< CategoryTypes[i].length; j++)
//         {
//             games[i+''+ CategoryTypes[i][j]]= [
//                 await getGameData({id, time: today, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: yesterday, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: daybefore, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: fourDaysBefore, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: fiveDaysBefore, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: sixDaysBefore, category: i, type:CategoryTypes[i][j]}), 
//                 await getGameData({id, time: sevenDaysBefore, category: i, type:CategoryTypes[i][j]}), 
//                 0 
//             ];
//         }
//     };
//     console.log(games);
// }
// test(888000);

// ===========================================================================================

const dayjs = require('dayjs');
const { sequelize, QueryTypes } = require('../sequelize/sd28');
// 
const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD');
const daybefore = dayjs().add(-2, 'day').format('YYYY-MM-DD')
const fourDaysBefore = dayjs().add(-4, 'day').format('YYYY-MM-DD');
const fiveDaysBefore = dayjs().add(-5, 'day').format('YYYY-MM-DD');
const sixDaysBefore = dayjs().add(-6, 'day').format('YYYY-MM-DD');
const sevenDaysBefore = dayjs().add(-7, 'day').format('YYYY-MM-DD');
// 
const getGameSumData = async(d) =>
{ 
    const { id, category, type } = d;
    // 
    const _userbetdata = await sequelize.query(`
        SELECT  SUM(win) AS win
        FROM    user_bet_data
        WHERE   user_id = ${id}
        AND     category = '${category}'
        AND     type = '${type}'
        AND     time IN (
                    '${today}',
                    '${yesterday}',
                    '${daybefore}',
                    '${fourDaysBefore}',
                    '${fiveDaysBefore}',
                    '${sixDaysBefore}',
                    '${sevenDaysBefore}'
                )
        GROUP BY time , category, type
        ORDER BY time`,
    {
        type: QueryTypes.SELECT,
        plain: false,
    });
    // 
    let list;
    list = (_userbetdata[0]&&_userbetdata[0].win) || 0;
    console.log(list);
};

getGameSumData({
    id: 888800,
    category: 'btc',
    type: '28'
})