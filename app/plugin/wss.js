"use strict";
const WebSocket = require("ws");
const http = require('http');
const { upgradeCheck, pathCheck, userCheck, qunCheck } = require('../middleware/ws');
const { arrayToBuffer } = require('./buffer');
const { lpush_2, redis_2_room_sub, redis_2_sub, redis_2_admin_to_user_sub } = require('../plugin/redis');
const wssub = require('./wssub');
const dayjs = require("dayjs");
//
// -------------------------------------------------------------------------------------------

// 数据发送
const wsSend = async(ws, d) => {
    if (!d) return;
    d = await arrayToBuffer(d, ws.userInfo.ikey);
    if (d) ws.send(d);
};
// -------------------------------------------------------------------------------------------
const wsss = (port, controller) => 
{
    const server = http.createServer();
    const wss = new WebSocket.Server({
        noServer: true
    });
    //
    wss.on('connection', (ws, userInfo) => 
    {
        ws.isAlive = true;
        ws.path = '/';
        ws.userInfo = userInfo;
        ws.in_my_room = false;
        // 
        // 接受客服端的ping
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        // 客服端关闭事件
        ws.on('close', () => {

        });
        // 客户端错误事件
        ws.on("error", function(code, reason) {
            
        });
        // 客户端收发信息
        ws.onmessage = async(d) => 
        {
            // console.log(ws);
            // 心跳信息
            if (d.data == 'i') {
                ws.isAlive = true;
                return;
            }
            // 检查路径
            let _data = await pathCheck(d.data, userInfo.ikey);
            if (!_data) {
                await wsSend(ws, { error: 701 });
                return;
            }
            // 用户检查
            let _user = await userCheck(userInfo.platform, userInfo.ip, _data.path, _data);
            if(_user&&_user.M){
                await wsSend(ws, { ..._user });
                return;
            }
            if(_user)
            {
                ws.uuids = _user.id+'-'+_user.uuid;
                ws.user_id = _user.id,
                ws.user_nick = _user.nick,
                ws.uuidkey = userInfo.wkey+'-'+ws.uuids;
                _data['id'] = _user.id;
                _data['uuidkey'] = ws.uuidkey;
            }
            // 
            ws.wata = _data;
            _data = {
                ..._data,
                ip: userInfo.ip,
            };
            // 
            // 返回信息
            try {
                const _path = _data.path.split('/');
                // console.log(_path);
                let res = await controller[_path[0]][_path[1]](_data);
                // console.log(_path,res);
                await wsSend(ws, res);
            } catch (error) {
            //     await wsSend(ws, {
            //         M: { c: '没有找到任何数据' }
            //     });
            }
            // postData(d, ws, config.posturl);
            // // 进入群检测
            // pathInQunUser(ws.path, ws.user_nick);
            // // 记录和监控
            // await PageviewIn({
            //     user_id: ws.user_id||0,
            //     user_nick: ws.user_nick||'',
            //     path: ws.path,
            //     time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            //     port: config.port,
            //     ip: ws.ip
            // })
            // redis_2_pub.publish('sd28-admin-data', JSON.stringify({PageView:Object.values(__data)}));
            // await PAGEVIEW.create(__data);
            await lpush_2('sd28_request_view_data', JSON.stringify({
                type: 'view',
                data: {
                    user_id: ws.user_id||0,
                    user_nick: ws.user_nick||'',
                    path: _data.path+(_data.game?'/'+_data.category+'/'+_data.type:''),
                    ip: userInfo.ip,
                    time: dayjs().format('MM-DD HH:mm:ss')
                }
            }));
            // const _abcc = await lrange_2('sd28_request_view_data', 0, 10);
            // console.log(_abcc);
            // 
            await qunCheck(_data,_user.nick);
        };
    });
    // 
    const interval = setInterval(() =>
    {
        wss.clients.forEach((ws) =>
        {
            if (ws.isAlive === false)
            {
                // console.log('已断开的链接');
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping('i');
        });
    }, 30000);
    // //
    wss.on('close', () => {
        clearInterval(interval);
    });
    // 监听
    const inRoom = async() => 
    {
        // 站点信息通知
        redis_2_sub.subscribe('sd28-site-room');
        redis_2_sub.on("message", (channel, message) =>
        {
            wss.clients.forEach(async(ws) =>
            {
                if (ws.isAlive === true) 
                {
                    try {
                        let _m = JSON.parse(message);
                        // console.log(_m);
                        let d = await wssub[_m['controller']](ws.wata, _m, ws.uuids);
                        if(!d) return;
                        // console.log(d);
                        d = await arrayToBuffer(d, ws.userInfo.ikey);
                        if(!d) return; 
                        ws.send(d);
                    } catch (error) {
                        
                    }
                }
            });
        });
        // web 发送至 用户
        redis_2_room_sub.subscribe('sd28-user-room');
        redis_2_room_sub.on("message", (channel, message) =>
        {
            wss.clients.forEach(async(ws) =>
            {
                if (ws.isAlive === true && ws.uuidkey)
                {
                    try {
                        let _m = JSON.parse(message);
                        if((!_m || _m.uuidkey!==ws.uuidkey)) return;
                        _m = await arrayToBuffer(_m.data, ws.userInfo.ikey);
                        if (_m) ws.send(_m);
                    } catch (error) {
                        
                    }
                }
            })
        });
        // 后台 发送至 用户端
        redis_2_admin_to_user_sub.subscribe('sd28-admin-to-user-room');
        redis_2_admin_to_user_sub.on("message", (channel, message) =>
        {
            wss.clients.forEach(async(ws) =>
            {
                if (ws.isAlive === true) 
                {
                    try {
                        let _m = JSON.parse(message);
                        // console.log('------sd-fsd-fsd-fsd-f-------',_m._user_id_uuid, ws.uuids);
                        if(_m._user_id_uuid!==ws.uuids) return;
                        _m = await arrayToBuffer(_m.data, ws.userInfo.ikey);
                        if (_m) ws.send(_m);
                    } catch (error) {
                        
                    }
                }
            })
        });
    }
    inRoom();
    // ----------------------------------------------------------
    // 升级
    server.on('upgrade', async(request, socket, head) => 
    {
        const { headers } = request;
        const _info = await upgradeCheck(request);
        // console.log(_info);
        // 检查
        if (_info < 301) {
            //
            await lpush_2('sd28_request_view_data', JSON.stringify({
                type: 'request',
                data: {
                    origin: headers['origin'],
                    agent: headers['user-agent'],
                    time: dayjs().format('MM-DD HH:mm:ss'),
                    ip: headers['x-real-ip'],
                    port,
                    code: _info
                }
            }));
            //
            socket.destroy();
            socket.end();
            return;
        }
        // 通过
        wss.handleUpgrade(request, socket, head, async(ws) => 
        {
            wss.emit('connection', ws, _info);
            //
            // redis_2_pub.publish('sd28-admin-data', JSON.stringify({PageRequest:Object.values(__data)}));
            // await PAGEREQUEST.create(__data); 
            await lpush_2('sd28_request_view_data', JSON.stringify({
                type: 'request',
                data: {
                    origin: _info.origin,
                    agent: _info.userAgent,
                    time: dayjs().format('MM-DD HH:mm:ss'),
                    ip: _info.ip,
                    port
                }
            }));
        });
    });
    //
    server.listen(port);
    console.log(port);
};
//
module.exports = {
    wsss
};