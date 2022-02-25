'use strict';
const dayjs = require("dayjs");
const { createHash } = require('crypto');
const { inArr, strArrSum } = require('./tool');

// 1豹 2顺 3对 4半 5杂
const bsdbz = async(ee) => {
    let e = ee;
    // e.sort((a, b)=>{return parseInt(a)-parseInt(b)});
    e.sort();
    // 
    let _this_jg = '_' + (parseInt(e[0]) - parseInt(e[1])) + '_' + (parseInt(e[1]) - parseInt(e[2])) + '_';
    _this_jg = _this_jg.replace(/-/g, '');
    if (_this_jg == '_0_0_') return 'bao';
    if (_this_jg == '_1_1_') return 'shun';
    if ((e[0] == '0' && e[1] == '8' && e[2] == '9') || (e[0] == '0' && e[1] == '1' && e[2] == '9')) return 'shun';
    if (_this_jg.indexOf('_0_') !== -1) return 'dui';
    if (_this_jg.indexOf('_1_') !== -1) return 'ban';
    if (e[0] == '0' && e[2] == '9') return 'ban';
    return 'za';
};
// 取尾数
const strLastOne = (str) => {
    str = str + '';
    let spstr = str.split('');
    return spstr[spstr.length - 1];
};
// 除以6，余数+1
const sixAddOne = (num) => {
    return (num % 6) + 1;
};
// PK 虎龙
const pklonghu = (a, b) => {
    return parseInt(a) > parseInt(b) ? 'long' : 'hu';
};
// PK 小大 冠亚和
const pkdaxiao = (a) => {
    return parseInt(a) > 11 ? 'da' : 'xiao';
};
// PK 小大 车道
const pkcddaxiao = (a) => {
    return parseInt(a) > 5 ? 'da' : 'xiao';
};
// 群玩法 小大
const jddaxiao = (a) => {
    return parseInt(a) > 13 ? 'da' : 'xiao';
};
// PK 单双
const pkdanshuang = (a) => {
    return parseInt(a) % 2 == 0 ? 'shuang' : 'dan';
};

// 区位
const areaNum = (type) => {
    if (type == 'dd') {
        return {
            11: [
                [0, 1, 2, 3, 4, 5],
                [12, 13, 14, 15, 16, 17]
            ],
            16: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ],
            28: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ],
            36: [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ],
            '28gd': [
                [0, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17]
            ]
        }
    }
    return {
        11: [
            [0, 3, 6, 9, 12, 15],
            [2, 5, 8, 11, 14, 17]
        ],
        16: [
            [0, 3, 6, 9, 12, 15],
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17]
        ],
        28: [
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17],
            [3, 6, 9, 12, 15, 18]
        ],
        36: [
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17],
            [3, 6, 9, 12, 15, 18]
        ],
        '28gd': [
            [1, 4, 7, 10, 13, 16],
            [2, 5, 8, 11, 14, 17],
            [3, 6, 9, 12, 15, 18]
        ],
    }
};
// 
const modeToJg = async(e, d) => {
    if (e == 11 || e == 16) return sixAddOne(d);
    return strLastOne(d);
};
const showJg = async(e, d) => {
    if (e == '36') return await bsdbz(d);
    return await strArrSum(d);
};
// 
const DdBjJndJg = async(type, mode, number) => {
    // console.log(type, mode, number);
    // 开奖号码
    let _area = areaNum(type)[mode];
    // 取得号码
    let num = [];
    for (let ii in _area) {
        num[ii] = [];
        for (let i in _area[ii]) {
            num[ii][i] = number[_area[ii][i]];
        }
        num[ii] = await strArrSum(num[ii]);
        num[ii] = await modeToJg(mode, num[ii]);
    }
    //
    return {
        number,
        num,
        jg: await showJg(mode, num)
    }
};
// 
const jndTopk = async(number) => {
    number = number.join('');
    let data = createHash('sha256').update(number).digest('hex').split('');
    const one = [];
    for (var i = 0, len = data.length; i < len; i += 6) {
        if (i < 55) one.push(parseInt(data.slice(i, i + 6).join(''), 16));
    }
    let two = {};
    one.map((v, k) => {
        two[k + 1] = v;
    })
    two = Object.keys(two).sort((a, b) => { return two[b] - two[a] });
    return two;
};
const PkJg = async(type, d, peroids) => {
    d = await jndTopk(d);
    let _one;
    switch (type) {
        case '10':
            _one = strLastOne(peroids);
            _one = _one == 0 ? 10 : _one;
            _one = parseInt(_one) - 1;
            return {
                number: d,
                num: '',
                jg: d[_one],
                des: ''
            }
        case '22':
            let _num = [d[0], d[1], d[2]];
            return {
                number: d,
                num: _num,
                jg: await strArrSum(_num),
                des: ''
            }
        case 'gj':
            return {
                number: d,
                num: '',
                jg: d[0],
                des: ''
            }
        case 'lh':
            return {
                number: d,
                num: [d[0], d[9]],
                jg: pklonghu(d[0], d[9]),
                des: ''
            }
        case 'sc':
            _one = await strArrSum([d[0], d[1]]);
            const des = [
                pkdaxiao(_one),
                pkdanshuang(_one),
                pklonghu(d[0], d[9]),
                pklonghu(d[1], d[8]),
                pklonghu(d[2], d[7]),
                pklonghu(d[3], d[6]),
                pklonghu(d[4], d[5])
            ];
            return {
                number: d,
                num: [d[0], d[1]],
                jg: _one,
                des
            }
        case 'gyh':
            _one = await strArrSum([d[0], d[1]]);
            return {
                number: d,
                num: [d[0], d[1]],
                jg: _one,
                des: ''
            }
    }
};

// 每期时间 
// 0 每期间隔时间
// 1 官方维护时间
// 2 官方维护时间间隔
const gamePeroidsTime = {
    jnd: [210, '19:00:00', 3600],
    ddbj: [300, '23:55:00', 25800],
    jnc: [300, '16:30:00', 7200],
    slfk: [300, '05:50:00', 18600],
    elg: [240, '17:40:00', 9360],
    au: [160, '00:00:00', 160],
    btc: [60, '00:00:00', 60],
};
// 下一期时间
const getNextPeroidsTime = async(category, _time, _peroids) => 
{
    const game_time = gamePeroidsTime[category];
    let add_time = game_time[0];
    let stop = false;
    if (game_time[1] && _time.indexOf(game_time[1]) !== -1) {
        add_time = game_time[2];
        stop = true;
    }
    let time = await dayjs(_time).add(add_time, 'second').format('YYYY-MM-DD HH:mm:ss');
    // 
    // const peroids = await peroidsCheck(category, _peroids, time);
    // 
    const next = await dayjs(time).diff(dayjs(), 'second');
    // console.log(_stop);
    // stop = next > game_time[0] * 4 ? true : stop;
    // 
    return {
        peroids: parseInt(_peroids)+1,
        time,
        next,
        stop,
    }
};
// 当期时间
const getNowtPeroidsTime = async(category, time, peroids) => 
{
    const game_time = gamePeroidsTime[category];
    let stop = false;
    if (time.indexOf(game_time[1]) !== -1) {
        stop = true;
    }
    // 
    let next = await dayjs(time).diff(dayjs(), 'second');
    next = next <= 0 ? 0 : next;
    // 
    return {
        peroids,
        next,
        stop,
    }
};
// 前端时间显示
const timeShow = async(category, time) => {
    // const arr = ['jnd','pk','au'];
    // if (arr.find(v=>v==category)) return dayjs(time).format('MM-DD HH:mm:ss');
    return dayjs(time).format('MM-DD HH:mm:ss');
}

module.exports = {
    //
    bsdbz,
    strLastOne,
    sixAddOne,
    pklonghu,
    pkdaxiao,
    pkdanshuang,
    strArrSum,
    //
    DdBjJndJg,
    PkJg,
    // 
    gamePeroidsTime,
    getNextPeroidsTime,
    getNowtPeroidsTime,
    timeShow
};