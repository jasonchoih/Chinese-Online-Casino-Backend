const { getGameList } = require('../service/game');
const { 
    get_1, get_1_List, get_1_List_new_one, get_1_List_last_one,
    redis_1_lottery_fou,
    redis_1_lottery_fou_peroids_time,
    redis_1_lottery_page_list,
} = require('../plugin/redis');
const dayjs = require("dayjs");
// 
const test = async() =>
{
    
    const category = 'jnd';
    const type = '28';
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
    let _game = _lotterys[category];
    //
    const _fou = await redis_1_lottery_fou(_game, category, type);
    const rows = await redis_1_lottery_page_list(_game, 1);
    // 
    const _t = type=='28gd' ? '28' : type;
    let list = [..._fou];
    for (let i in rows) 
    {
        const _r = rows[i];
        if(_r.number && _r['p'] && Object.keys(_r['p']).length>0)
        {
            const _p = _r['p'][category][type];
            const _d = _r[category][_t];
            list.push([
                _r.peroids,
                dayjs(_r.time).format('MM-DD HH:mm:ss'),
                _d[0],
                type=='sc' ? _d[1] : _d[1]+'',
                category=='pk' ? _r['pk']['n'] : '',
                4,
                _p,
            ])
        }else{
            list.push([
                _r.peroids,
                dayjs(_r.time).format('MM-DD HH:mm:ss'),
                '',
                '',
                '',
                3,
                [0,0,0],
            ])
        }
    }
    for (let i in list) 
    {
        const _r = list[i];
        let _is_in = _fou.find(v=>v[0]==_r[0]);

        if(!_fou.find(v=>v[0]==_r[0])) console.log('---------'+i+'--------', _is_in);
    }
    // console.log(_fou,list);
};
// 
test();