const { 
    get_1, get_1_List, get_1_List_new_one, get_1_List_last_one,
    redis_1_lottery_fou,
    redis_1_lottery_fou_peroids_time,
    redis_1_lottery_page_list,
} = require('../plugin/redis');
const dayjs = require("dayjs");
const { USERBET, USERBETDATA, USERBETMODE } = require('../sequelize/sd28');
// 
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
    // return _rlist;
    console.log(_rlist);
};
// 
getGameList('jnd','16',7,888000);