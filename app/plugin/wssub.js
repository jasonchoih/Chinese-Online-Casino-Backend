// 
const { isInGame, getNewLottery } = require('../service/game');
const dayjs = require("dayjs");
// const { timeShow, gamePeroidsTime } = require('../service/gameTool');
// 
// w: {
//     game: 'btc28',
//     category: 'btc',
//     type: 28,
//     path: 'game/jg',
//     __tk: '07eaa5825a8a2b4d4519fef878f182a24f90693fe18304ea193ea11ac31e0715dfabe53d4af42a5f68ece2dd8acf1f99561dc1f41b285ca8f1849fc683bb16bb',
//     id: 666666,
//     uuid: '1IZq9s539U3cPzsQh'
// } 
// m: {
//     controller: 'game_open',
//     category: 'btc',
//     peroids: 1682902,
//     number: '7,9,18,20,26,26,29,31,35,37,49,52,54,55,61,65,66,68,73,75',
//     time: '2021-04-15 04:35:00',
//     des: 'f57c1df64a917666ad3a7944613a6a4e1ecfc2479273929a165f9954b952a331'
// }  
// 最新开奖号码
const categoryx = {
    q214: 'q214',
    q28: 'q28',
    jnd: 'jnd',
    pk: 'jnd',
    dd: 'ddbj',
    bj: 'ddbj',
    elg: 'elg',
    slfk: 'slfk',
    au: 'au',
    btc: 'btc',
    kr: 'kr',
}
const game_lottery_open_category_check = async(category, _w_category) => 
{
    if(category=='jnd')
    {
        if(['jnd','pk'].find(v=>v==_w_category)) return true;
    }
    if(category=='ddbj')
    {
        if(['dd','bj'].find(v=>v==_w_category)) return true;
    }
    if(category==_w_category) return true;
    // 
    return false;
}
const game_lottery_open = async(w, m) => 
{
    // console.log(w,m);
    // console.log(w.category, w.type); // 用户访问
    // console.log(m.category); // 传送过来
    // console.log('------------------------------------------------------------------------------------------------');
    // 
    if(!w || !m || !w.game) return false;
    if(!isInGame(w.category, w.type)) return false;
    // 
    let _category = w.category;
    let _type = w.type;
    // 
    if(['q214','q28'].find(v=>v==w.category))
    {
        _category = w.type;
        _type = 28;
    }
    if(!await game_lottery_open_category_check(m.category, _category)) return;
    //
    let Lottery = {};
    Lottery['Lottery'+w.category+''+w.type] = await getNewLottery(w.category, w.type);
    Lottery['MP3'] = 'lottery_open';
    // 
    return Lottery;
}
// 最新一期,不带号码
const game_lottery_new = async(w, m) => 
{
    if(!w || !m || !w.game) return false;
    if(!isInGame(w.category, w.type)) return false;
    if(categoryx[w.category]!=m.category) return false;
    // 
    let Lottery = {};
    Lottery['Lottery'+w.category+''+w.type+'_add'] = [
        m.peroids,
        dayjs(m.time).format('MM-DD HH:mm:ss'),
        2
    ];
    Lottery['Lottery'+w.category+''+w.type] = await getNewLottery(w.category, w.type);
    return { ...Lottery };
}
// 页面投注更新
const game_lottery_bet_update = async(w,m) => 
{
    const { category, type, peroids, p } = m;
    let Lottery = {};
    // 
    Lottery['Lottery'+category+''+type+'_bet_update'] = [
        peroids,
        p
    ];
    return { ...Lottery };
}
// 页面机器人投注更新
const game_automan_bet_update = async(w,m) => 
{
    const { game } = w||{};
    const { data } = m||{};
    // 
    if(!game || !data || !data[game]) return;
    let Lottery = {};
    Lottery['Lottery'+game+'_bet_update'] = data[game];
    return { ...Lottery };
}
// 群投注显示
const game_qun_bet_show = async(w,m) => 
{
    if(w.game!=m.category+''+m.type) return;
    let Lottery = {};
    Lottery['GameQun'+w.game] = m.data;
    return { ...Lottery };
}
// 群机器人投注显示
const game_qun_auto_bet_show = async(w,m) => 
{
    if(w.game!=m.game) return;
    let Lottery = {};
    Lottery['GameQun'+w.game] = m.data;
    return { ...Lottery };
}
// 排行榜更新
const rank = async(w, d) => 
{
    const { path } =w;
    if(path!=='home/rank') return;
    return {
        ...d.data
    }
}
//
module.exports = {
    //
    game_lottery_new,
    game_lottery_open,
    game_lottery_bet_update,
    // 
    game_qun_bet_show,
    game_qun_auto_bet_show,
    game_automan_bet_update,
    // 
    // 
    rank,
}