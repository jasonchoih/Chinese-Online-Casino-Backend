'use strict';
// 
const dayjs = require("dayjs");
// 是否存在于字符串
const inStrs = (strs, str) => 
{
    if(strs.indexOf(str)!=-1) return true;
    return false;
}
// 是否存在于数组
const inArr = (arr, str) => 
{
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i]==str) return true
    }
    return false;
}
// 网址合法
const inNumAndZm = (path) => 
{
    if(/^[a-z0-9\/\_]+$/.test(path)) return true;
    return false;
}
// 路径首字母大写
const pathUpperCase = (d) =>
{
    return d.replace(/([^\/])(?:\/+([^\/]))/g, function ($0, $1, $2) {
	    return $1 + $2.toUpperCase();
  	});
}
// 首字母大写
const firstUpper = (e) => 
{
    return e.charAt(0).toUpperCase() + e.slice(1)
}
// 
const pathInOne = (path) => {
    path = '_'+path+'_';
    let strs = '_index_news_activy_shop_agents_';
    if(inStrs(strs, path)) return true;
    return false;
}
// 数组相加
const strArrSum = async(arr) => {
    let _r = arr.reduce(function(prev, curr) {
        return parseInt(prev) + parseInt(curr);
    });
    return _r;
}
// 
const valsCountSum = async(d) => 
{
    
}
// 
const qwfType = {
    xy: 28,
    dd: 28,
    bj: 28,
    pk: 'sc',
    jnd: 28,
    jnc: 28,
    btc: 28,
    kr: 28,
    au: 28,
    elg: 28,
    slfk: 28,
}
const pathInGame = (path) => 
{
    // let reg = /^game\/(xy|dd|bj|pk|jnd|ft)\/(10|11|16|22|28|36|28gd|gj|lh|sc|gyh)\/(jg|ms|zd|zs|yc|bet)/g;
    // 'btc','kr','au','elg','slfk'
    let reg = /^game\/(dd|bj|pk|jnd|jnc|au|btc|kr|elg|slfk)\/(10|11|16|22|28|36|28gd|gj|lh|sc|gyh)*?/g;
    let qwf = /^game\/(q214|q28)\/(dd|bj|pk|jnd|jnc|au|btc|kr|elg|slfk)*?/g;
    if (reg.test(path))
    {
        path = path.split('/');
        path = 'game'+path[1]+''+path[2];
        return path;
    }
    if (qwf.test(path))
    {
        path = path.split('/');
        path = 'game'+path[2]+''+qwfType[path[2]];
        return path;
    }
    return '';
}
const pathInAuto = (path, _path) => 
{ 
    if(path.indexOf(_path) != -1) return true;
    return false;
}
const pathInQun = (path, type) => 
{
    let qwf = /^game\/(q214|q28)\/(dd|bj|pk|jnd|jnc|au|btc|kr|elg|slfk)*?/g;
    let _path = path.split('/');
    // console.log(_path, type);
    if (qwf.test(path) && type==_path[2]) return true
    return false;
}
// 
const IsGameSend = (path, name) =>
{
    const _gaempath = pathInGame(path);
    const arr = [ 'Lottery', 'TimeDown', 'NextPeroids', 'Open'];
    //
    for(let i in arr)
    {
        let _name = _gaempath+''+arr[i];
        if(_name==name) return 'game'+arr[i];
    }
    return false;
}
// 随机数
const _rand = async(min, max) => 
{
    let _money = parseInt(Math.random()*(max-min+1)+min,10)
    return await _money
}
// 两位小数
const dot2 = async(e) => 
{
    e = e.toString();
    let _vvs = e.split('.');
    if(_vvs[1]) e = _vvs[0]+'.'+_vvs[1].substring(0, 2);
    e = parseFloat(e);
    return e
}
// 数组随机顺序
const randomsort = (a, b) => 
{
    return Math.random() > .5 ? -1 : 1;
}
// 两个数之间的随机数
const twoNumberRandom = async(min, max) =>
{
    return Math.random() * (max - min) + min;
}
// 金额转数字
const moneyToNumber = async(n) =>
{
    n = n+'';
    n = n.replace(/,/gi, '');
    n = parseInt(n)
    return !n ? '' : n;
}
// 数字转金额
const numberToMoney = async(n) =>
{
    if(n==0) return '';
    n = await moneyToNumber(n);
    if(!n) return '';
    n = n+'';
    return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => 
    {
        return $1 + ",";
    });
}
// 游戏名称
const _game_name = async(category,type) => 
{
    const _category = 
    {
        'qwf': '群玩法',
        'xy': '幸运',
        'bj': '台湾',
        'dd': '台湾蛋蛋',
        'pk': 'PK',
        'jnd': '加拿大',
        'jnc': '加拿大西部',
        'btc': '比特币',
        'kr': '韩国',
        'au': '澳洲',
        'elg': '俄勒冈',
        'slfk': '斯洛伐克'
    }
    const _type = 
    {
        '28gd': '28固定',
        'gyh': '冠亚和',
        'lh': '龙虎',
        'sc': '赛车',
        'xy': '幸运',
        'bj': '北京',
        'dd': '蛋蛋',
        'pk': 'PK',
        'jnd': '加拿大',
        'jnc': '加拿大西部',
        'btc': '比特币',
        'kr': '韩国',
        'au': '澳洲',
        'elg': '俄勒冈',
        'slfk': '斯洛伐克'
    }
    return (_category[category])+''+(_type[type]||type);
}
const _jgTxt = {
    //
    cd: '车道',
    gyh: '冠亚和',
    // 
    long: '龙',
    hu: '虎',
    // 
    bao: '豹',
    shun: '顺',
    dui: '对',
    ban: '半',
    za: '杂',
    // 
    da: '大',
    xiao: '小',
    dan: '单',
    shuang: '双',
    dadan: '大单',
    dashuang: '大双',
    xiaodan: '小单',
    xiaoshuang: '小双',
    jida: '极大',
    jixiao: '极小',
}
const _gamename = async(type, e) => 
{
    let _e = e.toString().split('-');
    if(_e.length>0)
    {
        let _ee = [];
        for(let i in _e)
        {
            _ee.push(_jgTxt[_e[i]]||_e[i]);
        }
        if(_ee.length>0) return _ee.join('-');
    }
    return _jgTxt[e]||e;
}
// 
const timeToAddPeroids = async(time) => 
{
    let _s_t = time.split(' ');
    let _s_1 = _s_t[0].split('-');
    let _s_2 = _s_t[1].split(':');
    return parseInt(_s_1[0]) + parseInt(_s_1[1]) + parseInt(_s_1[2]) + parseInt(_s_2[0]) + parseInt(_s_2[1]) + parseInt(_s_2[2]);
}
// 百分比
const percent = (num, total) =>
{
    if (num == 0 || total == 0) return 0;
    return (Math.round(num / total * 10000) / 100.00);
}
// 折扣显示
const zhekou = (e) => 
{
    if(e==1) return '无折扣';
    return (Math.round((e*10)*1000)/1000)+' 折';
}
//
const math_abs = async(e) => 
{
    return Math.abs(parseInt(e));
}
const valsChange = async(vals) => 
{
    let _n = {};
    for(let i in vals)
    {
        _n[i] = await math_abs(vals[i]);
    }
    return _n;
}
//
module.exports = {
    inNumAndZm,
    twoNumberRandom,
    inArr,
    inStrs,
    firstUpper,
    pathUpperCase,
    pathInOne,
    pathInGame,
    pathInAuto,
    pathInQun,
    IsGameSend,
    _rand,
    qwfType,
    dot2,
    numberToMoney,
    moneyToNumber,
    _game_name,
    _gamename,
    // 
    timeToAddPeroids,
    randomsort,
    strArrSum,
    percent,
    zhekou,
    //
    math_abs,
    valsChange
};