//
const dayjs = require('dayjs');
const SMSClient = require('@alicloud/sms-sdk');
const request = require('request-promise');
// 
const { getRandom } = require('./tool');
// 
const {
    USERPHONESMS,
    USERS
} = require('../sequelize/sd28');

// 手机号码检测
const PhoneCheck = async(calling, phone) => {
    if (calling == 86 && (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone))) return false;
    if (!/^\d{6,11}$/.test(phone)) return false;
    return true;
};
// 地区检查
const CallingCheck = async(calling) => {
    const calls = [86, 852, 886, 82, 1, 31, 32, 33, 34, 44, 41, 53, 55, 60, 61, 66, 960, 971, 93, 355, 1684, 376, 244, 1264, 1268, 54, 374, 297, 61, 43, 994, 971, 358, 1242, 973, 880, 1246, 375, 32, 501, 229, 1441, 975, 591, 387, 267, 55, 673, 359, 226, 257, 599, 590, 237, 1, 238, 236, 56, 86, 61, 61, 57, 682, 506, 53, 5999, 357, 420, 243, 225, 242, 41, 213, 45, 253, 1767, 1809, 49, 593, 20, 291, 372, 251, 34, 212, 500, 298, 679, 358, 33, 691, 240, 594, 241, 220, 995, 233, 350, 30, 299, 1473, 590, 1671, 502, 44, 224, 245, 592, 500, 44, 385, 509, 504, 852, 36, 246, 354, 91, 62, 98, 964, 353, 44, 972, 39, 1876, 81, 44, 962, 855, 1345, 269, 7, 254, 686, 965, 996, 850, 1869, 82, 856, 371, 961, 266, 231, 218, 423, 370, 352, 1758, 94, 853, 389, 261, 265, 60, 960, 223, 356, 692, 596, 222, 230, 52, 373, 377, 976, 382, 1664, 212, 258, 95, 1670, 590, 264, 674, 977, 31, 687, 64, 505, 227, 234, 683, 672, 47, 968, 689, 92, 680, 970, 507, 675, 595, 51, 63, 64, 48, 351, 1787, 508, 974, 40, 7, 250, 262, 381, 503, 268, 378, 966, 221, 248, 232, 65, 1721, 421, 386, 677, 252, 211, 249, 597, 4779, 46, 963, 239, 235, 886, 992, 255, 66, 670, 228, 690, 676, 1868, 216, 90, 993, 1649, 688, 256, 380, 1, 598, 998, 1284, 1784, 1340, 678, 3906698, 58, 84, 685, 681, 383, 262, 967, 27, 260, 263];
    if (!calls.find(v => v == calling)) return false;
    return true;
};
// 发送验证码 - 国际
// type -- register / login / shopbuy / wjmm
// calling +86
// phone 1390000000
// ip -
//
const ItsmsSend = async(type, calling, phone, ip) => 
{
    // if(!await CallingCheck(calling)) return -11;
    //
    const _out_time = 60;
    let model = {
        register: 'SMS_179220774',
        login: 'SMS_181506055',
        shopbuy: 'SMS_181506055',
        wjmm: 'SMS_181506055',
    }
    if(!model[type]) return -1;
    // 
    const number = calling+''+phone;
    // 
    const _sms = await USERPHONESMS.findOne({
        where: {
            type,
            phone: number,
        },
        order: [
            ['id', 'DESC']
        ]
    });
    if (_sms) {
        const _this_seconds = dayjs().diff(_sms.time, 'seconds');
        if (_this_seconds < _out_time) return _out_time - _this_seconds;
    }
    const code = await getRandom(111111, 999999);
    let _send;
    try {
        await request({
            'method': 'POST',
            'url': 'https://api.sms.to/sms/send',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGg6ODA4MC9hcGkvdjEvdXNlcnMvYXBpL2tleS9nZW5lcmF0ZSIsImlhdCI6MTY0NDkzMTExNywibmJmIjoxNjQ0OTMxMTE3LCJqdGkiOiJROVJ5VDc0aGVWM0RramRMIiwic3ViIjozNDUzNzYsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.k9MpS649GF3zxq2hv5KvreTWu8bwHeZ_0aaOIskNAug'
            },
            body: `{ 
                "message": "您的验证码为：`+code+`，该验证码 60 分钟内有效，请勿泄漏于他人。",
                "to": "+`+number+`",
                "bypass_optout": true,    
                "sender_id": "sd28",    
                "callback_url": "https://example.com/callback/handler"
            }`}, function (error, response) {
            // if (error) throw new Error(error);
            // console.log(response.body);
            _send = JSON.parse(response.body);
        });
    } catch (error) {
        
    }
    if (!_send || _send['success'] !== true) return -2;
    // 
    // const _users = await USERS.findOne({attributes:['id','nick'],where:{phone}});
    //
    await USERPHONESMS.create({
        calling,
        phone,
        type,
        code,
        ip,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        // user_id : _users&&_users.id||0,
        // user_nick : _users&&_users.nick||''
    });
    return code;
};
// 
module.exports = {
    PhoneCheck,
    CallingCheck,
    // TxcaptchaCheck,
    ItsmsSend,
};