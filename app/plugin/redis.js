'use strict';
// 
const { redis_1_Config, redis_2_Config, sd28_auto } = require('../config/config');
const dayjs = require("dayjs");
//
const { promisify } = require("util");
const redis = require("redis");
const client_sd28_auto = redis.createClient(sd28_auto);
// 1 - lottery
const client_1 = redis.createClient(redis_1_Config);
const get_1_async = promisify(client_1.get).bind(client_1);
const lrange_1_Async = promisify(client_1.lrange).bind(client_1); // 读取 lrangeAsync(name, 0, -1);
// 2 - sd28.com
const client_2 = redis.createClient(redis_2_Config);
const get_2_async = promisify(client_2.get).bind(client_2);
const set_2_async = promisify(client_2.set).bind(client_2);
// const lrange_2_async = promisify(client_2.lrange).bind(client_2);
// 
const redis_2_pub = redis.createClient(redis_2_Config);
const redis_2_pubs = promisify(redis_2_pub.publish).bind(redis_2_pub);
//
const redis_2_sub = redis.createClient(redis_2_Config);
const redis_2_room_sub = redis.createClient(redis_2_Config);
const redis_2_admin_to_user_sub = redis.createClient(redis_2_Config);
//
const lpush_2 = promisify(client_2.lpush).bind(client_2);
const lrange_2 = promisify(client_2.lrange).bind(client_2);

// 分页获取数据
const pageStartEnd = {
    1: [0, 15],
    2: [16, 35],
    3: [36, 55],
    4: [56, 75],
    5: [76, 95],
    6: [96, 115],
    7: [116, 135],
    8: [136, 155],
    9: [156, 175],
    10: [176, 195],
    11: [196, 215],
    12: [216, 235],
    13: [236, 255],
    14: [256, 275],
    15: [276, 295],
    16: [296, 315],
    17: [316, 335],
    18: [336, 355],
    19: [356, 375],
    20: [376, 395],
    21: [396, 415],
    22: [416, 435],
    23: [436, 455],
    24: [456, 475],
    25: [476, 495],
}
const redis_1_lottery_page_list = async(n, p=1) => 
{
    p = p > 25 ? 25 : p;
    const _p = pageStartEnd[p];
    const _list = await lrange_1_Async('lottery_list_'+n, _p[0], _p[1]);
    if(!_list) return '';
    let _r = [];
    try {
        for(let i in _list)
        {
            _r.push(JSON.parse(_list[i]));
        }
    } catch (error) {
        
    }
    return _r;
}
// 
const redis_1_lottery_fou = async(n,category,type) => 
{
    const _list = await lrange_1_Async('lottery_fou_'+n, 0, 3);
    if(!_list) return '';
    let _r = [];
    try {
        for(let i in _list)
        {
            const _d = JSON.parse(_list[i]);
            const _p = _d['p'][category][type];
            _r.push([
                _d.peroids,
                dayjs(_d.time).format('MM-DD HH:mm:ss'),
                '',
                '',
                '',
                2,
                [
                    _p[0], 
                    _p[1],
                    0,
                    0
                ]
            ]);
        }
    } catch (error) {
        
    }
    if(_r.length<=0) return '';
    return _r;
}
const redis_1_lottery_fou_peroids_time = async(n) => 
{
    const _list = await lrange_1_Async('lottery_fou_'+n, 0, 3);
    if(!_list) return '';
    let _r = [];
    try {
        for(let i in _list)
        {
            const _d = JSON.parse(_list[i]);
            _r.push([
                _d.peroids,
                _d.time,
            ]);
        }
    } catch (error) {
        
    }
    if(_r.length<=0) return '';
    return _r;
}
// 读取 1
const get_1 = async(name) => 
{
    const d = await get_1_async(name);
    if(!d) return '';
    return JSON.parse(d);
}
// 读取 1 list
const get_1_List = async(n, a=0, b=-1) => 
{
    const _list = await lrange_1_Async('lottery_list_'+n, a, b);
    if(!_list) return '';
    let _r = [];
    try {
        for(let i in _list)
        {
            _r.push(JSON.parse(_list[i]));
        }
    } catch (error) {
        
    }
    return _r;
}
const get_1_List_new_one = async(n) => 
{
    const _list = await lrange_1_Async('lottery_list_'+n, 0, 50);
    if(!_list) return '';
    try {
        for(let i in _list)
        {
            let _this = JSON.parse(_list[i]);
            if(_this.number) return _this;
        }
    } catch (error) {
        
    }
    return '';
}
const get_1_List_last_one = async(n) => 
{
    const _list = await lrange_1_Async('lottery_list_'+n, 0, 0);
    if(!_list) return '';
    return JSON.parse(_list[0]);
}

// 读取 2
const get_2 = async(name) => 
{
    const d = await get_2_async(name);
    if(!d) return '';
    return JSON.parse(d);
}

// 设置
const set_2 = async(n, d) => 
{
    return await set_2_async(n, JSON.stringify(d));
}

// 发送更新 - 将金豆数据发送到 async_center 队列更新
const SubDo = async(d) => 
{
    await lpush_2('sd28_sub_do_list', JSON.stringify({ 
        platform: 'user', // 默认，指定平台为用户，即目录
        ...d
    }));
}

const redis_sd28_auto_gets = promisify(client_sd28_auto.get).bind(client_sd28_auto);
// 读取
const redis_sd28_auto_get = async(n) => 
{
    const d = await redis_sd28_auto_gets(n);
    if(!d) return '';
    return JSON.parse(d);
}

module.exports = 
{
    get_1,
    get_1_List,
    get_1_List_new_one,
    get_1_List_last_one,
    lrange_1_Async,
    // 
    redis_1_lottery_fou,
    redis_1_lottery_fou_peroids_time,
    redis_1_lottery_page_list,
    // 
    get_2,
    set_2,
    // lrangeAsync,
    // getList,
    // getZst
    lpush_2,
    lrange_2,
    redis_2_pub,
    redis_2_pubs,
    redis_2_sub,
    redis_2_room_sub,
    redis_2_admin_to_user_sub,
    SubDo,
    // 
    redis_sd28_auto_get,
};