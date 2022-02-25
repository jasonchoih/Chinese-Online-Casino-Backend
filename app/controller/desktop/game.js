// 
const dayjs = require("dayjs");
const { SubDo, get_1, get_1_List, lrange_1_Async, get_2 } = require('../../plugin/redis');
const { 
    isInGame, 
    getNewLottery, 
    getGameList, 
    getBetList,
    getGz,
    getBetmodeList,
    getBetmodeListBet,
    _bet_is_in_peroids, 
    getGameBetData,
    objNumSum,
    isLs
} = require('../../service/game');
const { xpage } = require('../../plugin/tool');
const { math_abs, valsChange } = require('../../service/tool');
const { USERS, USERBET, USERBETMODE, USERBETAUTO } = require('../../sequelize/sd28');
// 投注
const bet = async(d) => 
{
    let { uuidkey, id, category, type, vals, peroids } = d;
    if(!category || !type || !vals || !peroids) return {M:{c:'参数不完整！'}};
    vals = await valsChange(vals);
    if(Object.keys(vals).length<=0) return {M:{c:'请至少选择一注！'}}
    // 
    const sysbetmax = await get_2('sysbetmax');
    const sysbetmax_wh = sysbetmax && sysbetmax[category+'-wh'] || 1;
    const sysbetmax_xg = sysbetmax && parseInt(sysbetmax[category+'-xg']) || 50000000;
    // 临时维护
    if(sysbetmax_wh==2)
    {
        return {M:{c:'游戏维护中，请稍后再进行投注，谢谢配合！'}};
    }
    // 
    const _user = await USERS.findOne({attributes:['role','betmax','status'],where:{id}});
    let _user_bet_maxs = '';
    if(_user.betmax) _user_bet_maxs = parseInt(_user.betmax)*1000;
    //
    if(!_user || _user.status!='1')
    {
        return {M:{c:'账号状态不正确，请联系客服协助处理！'}};
    }
    if(_user.role!='1')
    {
        return {M:{c:'该账号类型不能进行投注，请更换账号！'}};
    }
    // 是否有自动投注
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            M:{
                c: '已存在自动投注，无法进行手工投注，请先暂停自动投注！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            }
        }
    }
    // 
    const gameset = await get_2('GameSet');
    const min_bet = parseInt(gameset['min-bet']);
    const max_bet = parseInt(gameset['max-bet']);
    // const max_open = parseInt(gameset['max-open']);
    // 检查金额最小
    let sum = 0;
    for(let i in vals) sum+=await math_abs(vals[i]);
    if(sum<min_bet) return {M:{c:'投注至少在 '+min_bet+'豆 以上！'}};
    if(sum>sysbetmax_xg) return {M:{c:'超过单期最大投注额 '+sysbetmax_xg+' 豆，请修改！'}};
    if(_user_bet_maxs && sum>_user_bet_maxs) return {M:{c:'很抱歉，本次投注超过您的单期最大投注额 '+_user_bet_maxs+' 豆，请修改或联系客服！'}};
    // 检查期数
    const _is_in_peroids = await _bet_is_in_peroids({category, type, peroids});
    if(_is_in_peroids) return {M:{c:_is_in_peroids}};
    // 检查金额最大
    const _userbet = await USERBET.findOne({attributes:['vals'],where:{user_id:id,category,type,peroids}}); 
    if(_userbet)
    {
        let oldsum = 0;
        let oldVals = JSON.parse(_userbet.vals);
        for(let i in oldVals) oldsum+=parseInt(oldVals[i]);
        let nowsum = sum + oldsum;
        if(nowsum>sysbetmax_xg) return {M:{c:'超过单期最大投注额 '+max_bet+' 豆，请修改！'}};
        //
        if(_user_bet_maxs && nowsum>_user_bet_maxs) return {M:{c:'很抱歉，本次投注超过您的单期最大投注额 '+_user_bet_maxs+' 豆，请修改或联系客服！'}};
    }
    // 
    await SubDo({ 
        path:[ 'game', 'bet' ],
        data:{ uuidkey, id, category, type, vals, peroids, mode:1 }
    });
}
//
const bet_last = async(d) => 
{
    const { id, category, type, peroids } = d;
    //
    let Lottery = {};
    if(['sc','28gd'].find(v=>v==type))
    {
        const _odd = await get_2('odd-'+category+'-'+type);
        let _new_odd = {};
        for(let i in _odd)
        {
            _new_odd[i] = _odd[i][1];
        }
        Lottery['gameodd'+category+''+type] = _new_odd;
    }
    // 
    const _userbet = await USERBET.findOne({attributes:['vals'],where:{user_id:id,category,type,peroids}}); 
    if(_userbet)
    {
        let GameBetValed = JSON.parse(_userbet.vals);
        return { 
            GameBetValed,
            ...Lottery
        }
    }
    if(JSON.stringify(Lottery)!='{}')
    {
        return { 
            ...Lottery
        }
    }
}
// 上期投注
const prevbet = async(d) => 
{
    const { id, category, type } = d;
    // 
    const _userbet = await USERBET.findOne({attributes:['vals'],where:{user_id:id,category,type},order:[['id','DESC']]}); 
    if(_userbet)
    {
        let GameBetVal = JSON.parse(_userbet.vals);
        return { 
            GameBetVal,
            GamePrevBetLoading:''
        }
    }
    return {
        M:{
            c:'暂无该游戏的上期投注'
        },
        GamePrevBetLoading:''
    }
}
// 结果
const jg = async(d) =>
{
    const { id, game, category, type } = d;
    // 
    if(!isInGame(category,type)) return;
    // 
    let Lottery = {};
    Lottery['Lottery'+category+''+type] = await getNewLottery(category, type);
    //
    if(['q214','q28'].find(v=>v==category))
    {
        const _odd = await get_2('odd-'+category+'-'+type);
        let _new_odd = {};
        for(let i in _odd)
        {
            _new_odd[i] = _odd[i][1];
        }
        Lottery['gameodd'+category+''+type] = _new_odd;
    }else{
        Lottery['LotteryList'+category+''+type] =  [ 1, await getGameList(category, type, 1, id) ];
    }
    // 
    const sysbetmax = await get_2('sysbetmax');
    const sysbetmax_xg = sysbetmax && parseInt(sysbetmax[category+'-xg']) || 50000000;
    // 
    const gameset = await get_2('GameSet');
    Lottery['GamePageData'] = [
        gameset['min-bet']||1000,
        sysbetmax_xg,
        gameset['max-open']||10000000000
    ];
    Lottery['UserDayBetData'+category+''+type] = await getGameBetData({
        user_id:id, 
        category, 
        type
    });
    // 
    return {
        ...Lottery
    }
}
// 投注记录
const jl = async(d) => 
{
    const { id, game, category, type, page } = d;
    // 
    if(!isInGame(category,type)) return;
    // 
    return await getBetList(id,category,type,page);
}
// 结果列表
const jglist = async(d) =>
{
    const { id, category, type, page } = d;
    // 
    if(!isInGame(category,type)) return;
    //
    let Lottery = {};
    Lottery['LotteryList'+category+''+type] = [ page||1, await getGameList(category, type, page||1, id) ];
    // 
    return Lottery;
}
// 预测
const yc = async(d) =>
{
    const { game, category, type } = d;
    // if(!game) return '';
    let _t = type=='28gd' ? 28 : type;
    let yc  = await lrange_1_Async('yc_'+category, 0, -1);
    let list = [];
    for(let i in yc)
    {
        let yci = JSON.parse(yc[i]);
        let _v = yci[2][_t];
        list.push([
            yci[0],
            yci[1],
            yci[2][_t]
        ]);
    }
    let gameYc = {};
    gameYc['GameYc'+game] = list;
    return gameYc;
}
//
const zst = async(d) =>
{
    let { game, category, type, num } = d;
    num = num-1;
    const nums = [ 99, 199, 299, 399, 499 ];
    // 
    const _lotterys = 
    {
        jnd: 'jnd',
        pk: 'jnd',
        dd: 'ddbj',
        bj: 'ddbj',
        jnc: 'jnc',
        elg: 'elg',
        slfk: 'slfk',
        btc: 'btc',
        au: 'au',
        kr: 'kr'
    };
    const data = await get_1_List(_lotterys[category], 0, nums[num]);
    if(!data) return;
    // 
    const x = type=='28gd' ? 28 : type;
    let list = [];
    for(let i in data)
    {
        const di = data[i];
        if(di&&di.number)
        {
            const _r = game=='pksc' ? [ di['pk']['n'], di[category][x][1] ] : [ di[category][x][1] ];
            list.push([
                di.peroids,
                dayjs(di.time).format('MM-DD HH:mm:ss'),
                ..._r
            ]);
        }
    }
    // 
    let gameZst = {};
    gameZst['gameZst'+game] = list;
    return gameZst;
}
// 规则
const gz = async(d) => 
{
    const { category, type } = d;
    // 
    if(!isInGame(category,type)) return;
    //
    let x = ['dd', 'bj'].find(v=>v==category) ? 'ddbj' : category;
    x = x=='pk' ? 'jnd' : x;
    const t = type=='28gd' ? '28' : type;
    //
    const _d = await get_1('lottery_last_'+x);
    // 
    let GZ = {};
    GZ['GZ'+category+''+type] = await getGz(category, x, t, _d);
    // 
    return GZ;
}
// 规则s
const gzs = async(d) => 
{
    const { category, type, peroids } = d;
    // 
    if(!isInGame(category,type))
    {
        return {M:{c:'没有找到相关内容，请稍后再试！'}};
    }
    //
    let x = ['dd', 'bj'].find(v=>v==category) ? 'ddbj' : category;
    x = x=='pk' ? 'jnd' : x;
    const t = type=='28gd' ? '28' : type;
    //
    const _ds = await get_1_List(x);
    if(!_ds || _ds.length<=0)
    {
        return {M:{c:'没有找到相关内容，请稍后再试！'}};
    }
    const _d = _ds.find(v=>v.peroids==peroids);
    if(!_d)
    {
        return {M:{c:'没有找到相关内容，请稍后再试！'}};
    }
    // 
    let GZ = {};
    GZ['GZ'+category+''+type] = await getGz(category, x, t, _d);
    // 
    return GZ;
}
//
const msadd = async(d) => 
{
    let { id, category, type, name, vals } = d;
    // 
    vals = await valsChange(vals);
    // 
    if(!name)
    {
        const len = await USERBETMODE.count({where:{user_id:id,category,type}});
        if(len>=1000) return { M: { c: '最多只能创建 1000 条模式，请删除后再新建！' } };
        name = '模式-'+(len+1);
    }else{
        if(!/^[a-zA-Z0-9\-\_\u4E00-\u9FA5]{1,10}$/.test(name)) return { M: { c: '名称格式错误，只能为中文英文数字-_，请重试！' } };
    }
    // 
    const { sum, num } = await objNumSum(vals);
    // 
    const gameset = await get_2('GameSet');
    const _min_bet = parseInt(gameset['min-bet']);
    if(sum<_min_bet)
    {
        return { 
            M: { c: '最低投注金豆在 '+_min_bet+' 豆，请进行调整！' }
        };
    }
    const _max_bet = parseInt(gameset['max-bet']);
    if(sum>_max_bet)
    {
        return { 
            M: { c: '最高投注金豆在 '+_max_bet+' 豆，请进行调整！' }
        };
    }
    // 
    const _is_ok = await USERBETMODE.create({
        user_id: id,
        category,
        type,
        name,
        vals: JSON.stringify(vals),
        num,
        sum,
        ls: await isLs(type, vals), 
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    if(_is_ok)
    {
        let GameMs = {};
        GameMs['GameMs'+category+''+type] = await getBetmodeList(id,category,type,1)
        return { 
            M: { c: '恭喜您，添加模式成功！' }, 
            A: { u: 'game/'+category+'/'+type+'/ms' },
            ...GameMs
        };
    }
    return { 
        M: { c: '添加失败，请稍后再试！' }
    };
}
//
const msdel = async(d) => 
{
    let { id, category, type, _id } = d;
    // 
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            M:{
                c: '已存在自动投注，无法进行该操作，请先暂停！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            }
        }
     }
    // 
    const _is = await USERBETMODE.findOne({where:{user_id:id,category,type,id:_id}});
    if(!_is)
    {
        return { 
            M: { c: '删除失败，请稍后再试！' }
        };
    }
    await USERBETMODE.destroy({where:{user_id:id,category,type,id:_id}});
    let GameMs = {};
        GameMs['GameMs'+category+''+type] = await getBetmodeList(id,category,type,1)
    return { 
        M: { c: '模式删除成功！' },
        ...GameMs
    };
}
//
const ms = async(d) => 
{
    let { id, category, type, page } = d;
    // 
    let GameMs = {};
    GameMs['GameMs'+category+''+type] = await getBetmodeList(id,category,type,page)
    return GameMs;
}
// 模式投注列表
const msbets = async(d) => 
{
    let { id, category, type, page } = d;
    // 
    let GameMs = {};
    GameMs['GameBetMs'+category+''+type] = await getBetmodeListBet(id,category,type,page)
    return GameMs;
}
//
const zdmsget = async(d) => 
{
    let { id, category, type, page } = d; 
    page = page || 1;
    const { offset,limit } = await xpage(page);
    // 
    const count = await USERBETMODE.count({ where:{ user_id:id,category,type } });
    const rows = await USERBETMODE.findAll({
        attributes: ['id','name','vals'],
        where: { 
            user_id:id,
            category,
            type 
        },
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    for(let i in rows)
    {
        let v = rows[i];
        list.push([
            v.id,
            v.name,
            JSON.parse(v.vals)
        ])
    }
    let GameZd = {};
    GameZd['GameZdms'+category+''+type] = [ [page,count], list];
    return GameZd;
}
// 
const zdget = async(d) => 
{
    let { id, category, type } = d;
    // 
    if(!category || !type)
    {
        return {
            ZdLoading:1,
            ZdData: '',
        }
    }
    const _auto = await USERBETAUTO.findOne({where:{user_id:id,category,type,status:2}});
    // 
    if(!_auto)
    {
        return {
            ZdLoading:1,
            ZdData: '',
        }
    }
    return {
        ZdLoading:1,
        ZdData: {
            start_peroids: _auto.start_peroids,
            end_peroids: _auto.end_peroids,
            min_dou: _auto.min_dou,
            max_dou: _auto.max_dou,
            mode: _auto.mode,
            peroids: _auto.peroids,
            pn: _auto.pn,
            dou: _auto.dou,
            win: _auto.win,
            status: _auto.status,
            time: dayjs(_auto.time).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}
// 
const zdstop = async(d) => 
{
    let { id, category, type } = d;
    // 
    if(!category || !type)
    {
        return {
            ZdStopLoading: ''
        }
    }
    const _auto = await USERBETAUTO.findOne({where:{user_id:id,category,type,status:2}});
    // 
    if(!_auto)
    {
        return {
            ZdStopLoading: '',
            M:{c:'没有找到该自动投注或已停止！'}
        }
    }
    await USERBETAUTO.update({status:1},{where:{id:_auto.id,user_id:id,category,type,status:2}});
    return {
        ZdLoading:1,
        ZdStopLoading: '',
        ZdData: ''
    }
}
//
const autobet = async(d) => 
{
    let { id, category, type, start_peroids, end_peroids, min_dou, max_dou, vals, mode } = d;
    // 
    // vals = await valsChange(vals);
    // 
    if(vals.length<=0)
    {
        return {
            ZdBtnLoading:'',
            M:{ c: '参数错误，请检查！' }
        }
    }
    // 
    if(start_peroids>end_peroids)
    {
        return {
            ZdBtnLoading:'',
            M:{ c: '开始期数必须比结束期数大！' }
        }
    }
    // 
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            ZdBtnLoading:'',
            ZdLoading: 1, 
            ZdData: {
                start_peroids: _is_has_auto.start_peroids,
                end_peroids: _is_has_auto.end_peroids,
                min_dou: _is_has_auto.min_dou,
                max_dou: _is_has_auto.max_dou,
                mode: _is_has_auto.mode,
                peroids: _is_has_auto.peroids,
                pn: _is_has_auto.pn,
                dou: _is_has_auto.dou||0,
                win: _is_has_auto.win||0,
                lose: _is_has_auto.lose||0,
                status: _is_has_auto.status,
                time: dayjs(_is_has_auto.time).format('YYYY-MM-DD HH:mm:ss')
            },
            M:{
                c: '已存在自动投注，无法进行该操作，请先暂停！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            }
        }
    }
    //
    const _is_in_auto = await USERBETAUTO.findOne({where:{user_id:id,category,type}});
    if(_is_in_auto)
    {
        await USERBETAUTO.update({
            user_id: id, 
            category,
            type,
            start_peroids,
            end_peroids,
            min_dou,
            max_dou,
            mode,
            vals: JSON.stringify(vals), 
            peroids: start_peroids, 
            pn: 0,
            dou: 0,
            win: 0,
            lose: 0,
            status: 2,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        },{
            where:{
                id: _is_in_auto.id,
                user_id: id
            }
        });
        return {
            ZdBtnLoading:'',
            ZdLoading: 1, 
            ZdData: {
                start_peroids,
                end_peroids,
                min_dou,
                max_dou,
                mode,
                peroids: start_peroids,
                pn: 0,
                dou: 0,
                win: 0,
                lose: 0,
                status: 2,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss')
            },
            M:{
                c: '开始自动投注模式成功！'
            }
        }
    }
    // 
    await USERBETAUTO.create({
        user_id: id,
        category,
        type,
        start_peroids,
        end_peroids,
        min_dou,
        max_dou,
        mode,
        vals: JSON.stringify(vals), 
        peroids: start_peroids, 
        pn: 0,
        win: 0,
        lose: 0,
        status: 2,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    //
    return {
        ZdBtnLoading:'',
        ZdLoading: 1, 
        ZdData: {
            start_peroids,
            end_peroids,
            min_dou,
            max_dou,
            mode,
            peroids: start_peroids,
            pn: 0,
            dou: 0,
            win: 0,
            lose: 0,
            status: 2,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
        M:{
            c: '开始自动投注模式成功！'
        }
    }
}
// 
module.exports = {
    bet,
    bet_last,
    jg,
    jl,
    jglist,
    yc,
    zst,
    gz,
    gzs,
    ms,
    msbets,
    msadd,
    msdel,
    zdmsget,
    prevbet,
    autobet,
    zdget,
    zdstop
};