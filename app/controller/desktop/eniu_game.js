const dayjs = require('dayjs');
const { sequelize, QueryTypes } = require('../../sequelize/sd28');
// 
const CategoryTypes = {
    jnd:[28,11,16,36,'28gd'],
    pk:['sc','gyh',10,22,'gj','lh'],
    jnc:[28,11,16,36,'28gd'],
    bj:[28,11,16,36,'28gd'],
    dd:[28,11,16,36,'28gd'],
    elg:[28,11,16,36,'28gd'],
    slfk:[28,11,16,36,'28gd'],
    au:[28,11,16,36,'28gd'],
    kr:[28,11,16,36,'28gd'],
    btc:[28,11,16,36,'28gd'],
    q214:[
      'jnd','jnc','bj','dd','au','elg','slfk','btc','kr'
    ],
    q28:[
      'jnd','jnc','bj','dd','au','elg','slfk','btc','kr'
    ],
};
// 
const headers = [
    '游戏名称',
    '今天',
    '昨天',
    '前天',
    dayjs().add(-4, 'day').format('MM-DD'),
    dayjs().add(-5, 'day').format('MM-DD'),
    dayjs().add(-6, 'day').format('MM-DD'),
    dayjs().add(-7, 'day').format('MM-DD'),
    '总数',
];
// 
const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD');
const daybefore = dayjs().add(-2, 'day').format('YYYY-MM-DD');
const fourDaysBefore = dayjs().add(-4, 'day').format('YYYY-MM-DD');
const fiveDaysBefore = dayjs().add(-5, 'day').format('YYYY-MM-DD');
const sixDaysBefore = dayjs().add(-6, 'day').format('YYYY-MM-DD');
const sevenDaysBefore = dayjs().add(-7, 'day').format('YYYY-MM-DD');
// 
const getSingleGameData = async(d) =>
{ 
    const { id ,time, category, type } = d;
    // 
    const _userbetdata = await sequelize.query(`
        SELECT  SUM(win) AS win
        FROM    user_bet_data
        WHERE   user_id = ${id}
        AND     time = '${time}'
        AND     category = '${category}'
        AND     type = '${type}'
        GROUP BY time, category, type
        ORDER BY time`,
    {
        type: QueryTypes.SELECT,
        plain: false,
    });
    // 
    let list;
    list = (_userbetdata[0]&&_userbetdata[0].win) || 0;
    return list;
};
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
        GROUP BY time, category, type
        ORDER BY time`,
    {
        type: QueryTypes.SELECT,
        plain: false,
    });
    // 
    let list;
    list = (_userbetdata[0]&&_userbetdata[0].win) || 0;
    return list;
};
//  
const gamedata = async(d)=>
{
    const { id  } = d;
    const Games = {};
    // 
    for (let i in CategoryTypes)
    {
        for (let j=0; j< CategoryTypes[i].length; j++)
        {
            Games[i+''+ CategoryTypes[i][j]]= 
            [
                [
                    i, CategoryTypes[i][j]
                ],
                [
                    await getSingleGameData({id, time:today, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:yesterday, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:daybefore, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:fourDaysBefore, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:fiveDaysBefore, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:sixDaysBefore, category:i, type:CategoryTypes[i][j]}), 
                    await getSingleGameData({id, time:sevenDaysBefore, category:i, type:CategoryTypes[i][j]}), 
                    await getGameSumData({id, category:i, type:CategoryTypes[i][j]})
                ]
            ]
        }
    };
    // 
    return{
        Games,
        headers
    }
}
// 
module.exports ={
    gamedata
};