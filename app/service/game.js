const { 
    get_1, get_1_List, get_1_List_new_one, get_1_List_last_one,
    redis_1_lottery_fou,
    redis_1_lottery_fou_peroids_time,
    redis_1_lottery_page_list,
} = require('../plugin/redis');
const { DdBjJndJg, jndTopk, getNextPeroidsTime } = require('./gameTool');
const { xpage } = require('../plugin/tool');
const { percent } = require('./tool');
const dayjs = require("dayjs");
const { USERBET, USERBETDATA, USERBETMODE } = require('../sequelize/sd28');
// 
// 获取最新开奖数据
const lotteryShowPk = async(type) => 
{
    const lottery = await get_1('lottery_last_jnd');
    const pk = lottery['pk'];
    const lottery_new = await get_1_List_last_one('jnd');
    const _next = await getNextPeroidsTime('jnd', lottery_new.time, lottery_new.peroids);
    //
    const _pkt = pk[type];
    const _p = lottery_new['p']['pk'][type];
    return [
        [
            lottery.peroids,
            _pkt[0],
            _pkt[1],
            pk['n']
        ],
        [
            _next.peroids,
            _next.next,
            30
        ],
        _p
    ]
}
const lotteryShowDdbj = async(x, category, type, t) => 
{
    const lottery = await get_1('lottery_last_'+x);
    const lottery_new = await get_1_List_last_one(x);
    const _next = await getNextPeroidsTime(x, lottery_new.time, lottery_new.peroids);
    //
    const _p = lottery_new['p'][category][t];
    // 
    const _bet_times = 
    {
        jnd: 30,
        pk: 30,
        dd: 30,
        bj: 30,
        jnc: 30,
        elg: 25,
        slfk: 30,
        btc: 5,
        au: 20,
        kr: 10
    };
    // 
    return [
        [
            lottery.peroids,
            lottery[category][type][0], // [ [1,2,3], 6 ]
            lottery[category][type][1]+'',
            lottery.number
        ],
        [
            _next.peroids,
            _next.next,
            _bet_times[category]
        ], 
        _p
    ]
}
const getNewLottery = async(_category, _type) => 
{
    const { category, type } = await qunCt(_category, _type);
    // 
    if (category=='pk') return await lotteryShowPk(type);
    //
    const x = ['dd', 'bj'].find(v=>v==category) ? 'ddbj' : category;
    const t = type=='28gd' ? '28' : type;
    return await lotteryShowDdbj(x, category, t, type);
};
// 是否在投注范围
const _bet_is_in_peroids = async({category, type, peroids}) => 
{
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
    const _bet_times = 
    {
        jnd: 30,
        pk: 30,
        dd: 30,
        bj: 30,
        jnc: 30,
        elg: 25,
        slfk: 30,
        btc: 5,
        au: 20,
        kr: 10
    };
    // 
    let _is_qun = ['q214','q28'].find(v=>v==category);
    // 
    const _category = _is_qun ? type : category;
    const _game = _lotterys[_category];
    // 
    let _fou = await redis_1_lottery_fou_peroids_time(_game);
    //
    if(!_fou) return '投注失败，请稍后再试！';
    //
    let _is_in = _fou.find(v=>v[0]==peroids);
    if(!_is_in) return '该期数不在投注范围！';
    //
    const _xt = parseInt(dayjs(_is_in[1]).diff(dayjs(), 'second'));
    const _xtc = _bet_times[_category];
    if(_xt<_xtc) return '投注时间已过！';
    //
    return '';
}
// 号码列表
const getGameList = async(category, type, page=1, id) => 
{
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
    let _game = _lotterys[category];
    let _fou = [];
    if(page==1) _fou = await redis_1_lottery_fou(_game, category, type);
    const rows = await redis_1_lottery_page_list(_game, page);
    // 
    const _t = type=='28gd' ? '28' : type;
    let list = [];
    for (let i in rows) 
    {
        const _r = rows[i];
        // This is to remove the duplicates in page jg when for e.g the official website stops opening lottoy
        //
        let _a = '';
        let _b = '';
        let _c = '';
        let _co = 3;
        //
        if(_r.number)
        {
            const _d = _r[category][_t];
            //
            _a = _d[0];
            _b = type=='sc' ? _d[1] : _d[1]+'';
            _c = category=='pk' ? _r['pk']['n'] : '';
            _co = 4;
        }
        //
        let _p = [0,0,0];
        if(_r['p'] && Object.keys(_r['p']).length>0) _p = _r['p'][category][type];
        //
        list.push([
            _r.peroids,
            dayjs(_r.time).format('MM-DD HH:mm:ss'),
            _a,
            _b,
            _c,
            _co,
            _p,
        ])
    }
    let _rlist = [ ..._fou ,...list ];
    // 
    let peroids = [];
    for(let i in _rlist)
    {
        peroids.push(_rlist[i][0]);
    }
    const rowx = await USERBET.findAll({
        attributes: ['peroids','dou','win_dou'],
        where: { 
            user_id:id,
            category,
            type,
            peroids
        },
        limit: 20
    });
    if(rowx.length>0)
    {
        let _dou_win_s = {};
        for(let i in rowx)
        {
            let _rowsi = rowx[i];
            _dou_win_s[_rowsi.peroids] = [
                _rowsi.dou,
                _rowsi.win_dou
            ];
        }
        for(let i in _rlist)
        {
            const _rlisti = _rlist[i];
            const _bw = _dou_win_s[_rlisti[0]] || [0,0];
            _rlist[i][6] = [
                _rlisti[6][0],
                _rlisti[6][1],
                _rlisti[6][2],
                ..._bw
            ];
        }
    }
    // 
    return _rlist;
};
// 获取游戏规则
const getGz = async(category,x,t,data) => 
{
    if (category=='pk')
    {
        return [
            ...await jndTopk(data.number),
            [
                data.peroids,
                '',
                ...data['pk'][t],
                data['pk']['n']
            ]
        ]
    }
    //
    let _r = [
        data.number,
        ...await DdBjJndJg(x, t, data.number),
        [
            data.peroids,
            '',
            ...data[category][t]
        ]
    ];
    // 
    if(category=='btc')
    {
        _r[5] = await getBtcGz(data.code);
    }
    // 
    return _r;
}
// 
const getBtcGz = async(code) => 
{
    let _code = code.split('');
    let _as = [];
    let _bs = [];
    let _cs = [];
    for(var i=0,len=_code.length;i<len;i+=3)
    {
        if(i<60)
        {
            let _a = _code.slice(i,i+3).join('');
            _as.push(_a);
            let _b = parseInt(_a,16);
            _bs.push(_b);
            let _c = (_b%80);
            _cs.push(_c);
        }
    }
    //
    return [
        code,
        _as,
        _bs,
        _cs
    ]
}
// 投注列表
const getBetList = async(id,category,type,page=1) => 
{
    const { offset,limit } = await xpage(page);
    //
    const count = await USERBET.count({ where:{ user_id:id,category,type } });
    const rows = await USERBET.findAll({
        attributes: ['id','peroids','num','dou','win_dou','wins','vals','mode','status','time'],
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
        let vals = JSON.parse(v.vals);
        let wins = v.wins?JSON.parse(v.wins):'';
        let _new_vals = {};
        for(let j in vals)
        {
            _new_vals[j] = [
                vals[j],
                ...(wins&&wins[j]||['-','-'])
            ]
        }
        list.push([
            v.peroids,
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.mode,
            v.num,
            v.dou,
            v.win_dou,
            v.status,
            _new_vals
        ])
    };
    let _r = {};
    _r['GameJL'+category+''+type] = [
        [page, count],
        list
    ];
    return _r;
}
// 投注模式列表
const getBetmodeList = async(id,category,type,page=1) => 
{
    const { offset,limit } = await xpage(page);
    const count = await USERBETMODE.count({ where:{ user_id:id,category,type } });
    const rows = await USERBETMODE.findAll({
        attributes: ['id','name','vals','num','sum','time'],
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
            v.name,
            v.num,
            v.sum,
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            JSON.parse(v.vals),
            v.id
        ])
    }
    return [[page,count],list];
}
// 模式投注列表
const getBetmodeListBet = async(id,category,type,page=1) => 
{
    const { offset,limit } = await xpage(page);
    const count = await USERBETMODE.count({ where:{ user_id:id,category,type } });
    const rows = await USERBETMODE.findAll({
        attributes: ['name','vals','sum'],
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
            v.name,
            v.sum,
            JSON.parse(v.vals)
        ])
    }
    return [[page,count],list];
}
// 获取单游戏当天投注情况
const getGameBetData = async(d) => 
{
    const { user_id, category, type } = d;
    //
    const _bet_time = dayjs().format('YYYY-MM-DD');
    const _user_bet_data = await USERBETDATA.findOne({
        attributes: ['bet','win','pn','wn'],
        where:{
            user_id,
            category,
            type,
            time: _bet_time
        }
    });
    if(!_user_bet_data) return [0,0,0,0];
    return [
        _user_bet_data.bet, // 投注金豆
        _user_bet_data.pn, // 投注期数
        _user_bet_data.wn, // 胜利期数
        parseInt(_user_bet_data.win), // 盈亏
        percent(_user_bet_data.wn,_user_bet_data.pn) // 胜率
    ];
}
// 游戏是否正确
const isInGame = async(category, type) => 
{
    const categorys = [ 'jnd', 'jnc', 'pk', 'dd', 'bj', 'elg', 'slfk', 'au', 'btc', 'kr', 'q214', 'q28' ];
    const types = [ 10, 11, 16, 22, 28, 36, '28gd', 'sc', 'gyh', 'lh', 'gj', 'jnd', 'jnc', 'pk', 'dd', 'bj', 'elg', 'slfk', 'au', 'btc' ];
    if(categorys.find((v)=>v==category) && types.find((v)=>v==type)) return true;
    return false;
}
// 群转换
const qunCt = async(category, type) => 
{
    if(!['q214','q28'].find(v=>v==category))
    {
        return {
            category,
            type
        }
    }
    let _t = 28;
    if(type=='pk') _t = 'sc';
    return {
        category: type,
        type: _t
    }
}
// 对象数量和总和
const objNumSum = async(obj) => 
{
    let sum = 0;
    for(let i in obj) sum+=obj[i]; 
    const num = Object.keys(obj).length;
    return { sum, num };
}
// 获取流水
const _jd_gz = {
    10: 7, 
    11: 8, 
    16: 11, 
    22: 15, 
    28: 21, 
    36: 2,
    '28gd': 21, 
    'gj': 7,
    'gyh': 11
}
const _qun_gz = {
    dan: [1,3,5,7,9,11,13,15,17,19,21,23,25,27],
    shuang: [0,2,4,6,8,10,12,14,16,18,20,22,24,26],
    da: [14,15,16,17,18,19,20,21,22,23,24,25,26,27],
    xiao: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    dadan: [15,17,19,21,23,25,27],
    xiaodan: [1,3,5,7,9,11,13],
    dashuang: [14,16,18,20,22,24,26],
    xiaoshuang: [0,2,4,6,8,10,12], 
    jida: [22,23,24,25,26,27],
    jixiao: [0,1,2,3,4,5],
    bao: 1, dui: 1, shun: 1, ban: 1, za: 1
}
const isLs = async(type, vals) => 
{
    if(_jd_gz[type])
    {
        const { num } = await objNumSum(vals); 
        if(_jd_gz[type]<num) return 0;
        return 1;
    } 
    //
    if(type=='pk') return 1;
    let _this_valss = {};
    let _this_bsdbzs = [];
    for(let i in vals)
    {
        let _this_qun_gz = _qun_gz[i];
        if(_this_qun_gz)
        {
            if(_this_qun_gz==1)
            {
                _this_bsdbzs.push(i);
            }else{
                _this_qun_gz.map((v,k)=>{
                    _this_valss[v] = 1;
                })
            }
        }else{
            _this_valss[i] = 1;
        }
    }
    // 
    if(Object.keys(_this_valss).length > _jd_gz['28'] || _this_bsdbzs.length>_jd_gz['36'] ) return 0;
    return 1;
}
//
module.exports = {
    _bet_is_in_peroids,
    getNewLottery,
    isInGame,
    getGameList,
    getGameBetData,
    getBetList,
    getGz,
    getBetmodeList,
    getBetmodeListBet,
    qunCt,
    objNumSum,
    isLs
};