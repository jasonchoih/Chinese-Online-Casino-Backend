//
const dayjs = require("dayjs");
// 手机号码
const phoneHide = async(p) => {
    return p.substring(0, 2) + "*****" + p.substr(p.length - 2);
};
// 随机数
const getRandom = async(min, max, _p = 2) => {
    return parseInt(Math.random() * (max - min) + min);
};
// 分页
const page = (page, limit = 20) => {
    page = page || 1;
    page = parseInt(page);
    let _page = page - 1;
    _page = _page > 0 ? _page : 0;
    const offset = _page * limit;
    return {
        limit,
        offset
    }
};
// 游戏时间
const getTimeDown = async(d) => {
    if (!d) return 0;
    d = dayjs(d).diff(dayjs(), 'second');
    d = d < 0 ? 0 : d;
    return d;
};
// 跳转
const GotoUrl = async(u) => {
    let _r = {};
    _r['A'] = {
        u,
        t: dayjs().valueOf()
    }
    return _r;
};
// 分页
const xpage = async(page, limit=20) =>
{
    page = page || 1;
    page = parseInt(page);
    let _page = page-1;
    _page = _page>0 ? _page : 0;
    const offset = _page * limit;
    return {
        limit,
        offset
    }
}
// 返回年月日
const yearmonthday = async() =>
{
    return {
        year: dayjs().format('YYYY'),
        month: dayjs().format('MM'),
        day: dayjs().format('DD')
    }
}
// 
module.exports = {
    phoneHide,
    getRandom,
    page,
    getTimeDown,
    GotoUrl,
    xpage,
    yearmonthday
};