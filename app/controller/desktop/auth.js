// 
const dayjs = require('dayjs'); 
// 
const { enSign, deSign, xPass, cPass, UUID } = require('../../plugin/cryptos');
const { PhoneCheck, CallingCheck, TxcaptchaCheck, AlismsSend } = require('../../plugin/verify');
const { GotoUrl, phoneHide } = require('../../plugin/tool');
const { USERS, USERLOGINNUM, USERDATA, USERLOG, AGENT, USERSUM } = require('../../sequelize/sd28');
const { TCL,TCC } = require('../../plugin/transaction');

// 注册获取KEY
const registercode = async(d) => 
{
    const { ticket, randstr, calling, phone, ip } = d;
    if (!ticket || !randstr || !calling || !phone) return { M: { c: '参数不完整，请重试！' }, RegisterLoading: '' };
    if (!await TxcaptchaCheck(randstr, ticket, ip)) return { M: { c: '验证时发生错误，请重试！' }, RegisterLoading: '' };
    if (!await CallingCheck(calling)) return { M: { c: '非常抱歉，暂未支持该国家的手机号，请更换！' }, RegisterLoading: '' };
    if (!await PhoneCheck(calling, phone)) return { M: { c: '手机号码格式错误，或手机归属国不对应，请检查！' }, RegisterLoading: '' };
    // 
    if (await USERS.findOne({ attributes: ['id'], where: { calling, phone } })) return { RegisterStatus: { phone: { s: 'error', h: '手机号码已存在，请更换' } }, RegisterLoading: '' };
    // 
    let code = await AlismsSend('register', calling, phone, ip);
    if (code < 0) return { M: { c: '发送失败，请稍后再试！' }, RegisterLoading: '' };
    if (code < 60) return { M: { c: '短信发送过快，请 ' + code + ' 秒后再试！' }, Register: { SendTime: code }, RegisterLoading: '' };
    // 
    return {
        RegisterLoading: '',
        Register: {
            SendTime: 59,
            _code: await enSign(calling + '|' + phone + '|' + ip + '|' + code + '|' + dayjs().add(600, 'second').valueOf())
        },
        M: { c: '验证码发送成功，请注意查收！' }
    }
};
// 注册
const register = async(d) => 
{
    const { uuidkey, _code, code, nick, parent, calling, phone, user, pass, ip } = d;
    if (!_code) return { M: { c: '请先获取验证码！' } };
    if (!code || !nick || !pass || !phone || !user) return { M: { c: '参数不完整，请重试！' } };
    let RegisterStatus = {};
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(user)) RegisterStatus['user'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) RegisterStatus['pass'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9_\u4E00-\u9FA5]{2,16}$/.test(nick)) RegisterStatus['nick'] = { s: 'error', h: '格式为 a-zA-Z0-9_或中文，长度2-16' };
    if (parent && !/^[0-9]{6,12}$/.test(parent)) RegisterStatus['parent'] = { s: 'error', h: '格式为 6-12位数字' };
    if (!await PhoneCheck(calling, phone)) RegisterStatus['phone'] = { s: 'error', h: '格式错误' };
    if (!/^[0-9]{6}$/.test(code)) RegisterStatus['code'] = { s: 'error', h: '格式为 6位数字' };
    // 
    if (await USERS.findOne({ attributes: ['id'], where: { user } })) RegisterStatus['user'] = { s: 'error', h: '登录账号已存在，请更换' };
    if (parent && await USERS.findOne({ attributes: ['id'], where: { id: parent, cs: 2 } })) RegisterStatus['parent'] = { s: 'error', h: '推荐人ID不正确或无法使用，请更换或留空' };
    if (await USERS.findOne({ attributes: ['id'], where: { calling, phone } })) RegisterStatus['phone'] = { s: 'error', h: '手机号码已存在，请更换' };
    if (await USERS.findOne({ attributes: ['id'], where: { nick } })) RegisterStatus['nick'] = { s: 'error', h: '昵称已存在，请更换' };
    // 
    try {
        let __code = await deSign(_code);
        __code = __code.split('|');
        if (__code[0] != calling || __code[1] != phone || __code[2] != ip) return { M: { c: '验证码在验证时发生错误，请重试！' }, RegisterLoading:'' };
        if (parseInt(__code[4]) < dayjs().valueOf()) return { M: { c: '验证码已过期，请重新获取！' }, RegisterLoading:'' };
        if (__code[3] != code) RegisterStatus['code'] = { s: 'error', h: '验证码错误，请更正！' };
    } catch (error) {

    }
    if (Object.keys(RegisterStatus).length > 0) return { RegisterStatus, RegisterLoading:'' };
    // 
    const _pass = await xPass(pass);
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    // 
    let _re = await TCL(async(transaction)=>
    {
        const _users = await USERS.create({
            uuid: await UUID(8),
            user,
            pass: _pass,
            safe: _pass,
            parent,
            calling,
            phone,
            nick
        },{ transaction });
        if(!_users) throw new Error(100);
        // 数据
        await USERDATA.create({
            user_id: _users.id
        },{ transaction });
        // 日志
        await USERLOG.create({
            user_id: _users.id,
            des: '账号注册',
            ip,
            time
        },{ transaction });
        // 用户统计
        await USERSUM.create({
            user_id: _users.id,
            time
        },{ transaction });
        // 推广人数
        // if(parent)
        // {
        //     await tgManAdd({
        //         user_id: parent,
        //         time,
        //         transaction
        //     })
        // };
        return {
            _users
        }
    });
    if(!_re||_re==100) return {M:{c:'注册失败，请稍后再试！'},RegisterLoading:''}
    //
    const { _users } = _re;
    // 
    return {
        M: { c: '恭喜您！注册成功！', b:1, bt:'点击跳转至会员中心', bcn:1, boo:{u:'user'} },
        Auth: {
            id: _users.id,
            nick: _users.nick,
            role: _users.role,
            dou: 0,
            exp: 0,
            __tk: await enSign(_users.id + '|' + _users.uuid + '|' + ip)
        },
        RegisterLoading: '',
        RegisterStatus: '',
        Register: ''
    }
};
// const tgManAdd = async(d) => 
// {
//     const { user_id,time, transaction } = d;
//     //
//     const _user = await USERS.findOne({where:{id:user_id}}); 
//     if(!_user) return;
//     const _user_tgfl = await USERTGFL.findOne({where:{user_id}});
//     //
//     if(_user_tgfl)
//     {
//         await sequelize.query(
//             'UPDATE `user_tgfl` SET '+
//             '`bet`=`bet` + '+dou+', time="'+time+'" '+
//             'WHERE id='+_user_tgfl.id,
//             { transaction }
//         );
//     }else{
//         await USERTGFL.create({
//             user_role: 1,
//             user_id,
//             man: 1,
//             bet: 0,
//             time
//         },{ transaction });
//     }
// } 
// 忘记密码获取KEY
const forgotcode = async(d) => 
{
    const { ticket, randstr, calling, phone, ip } = d;
    if (!await TxcaptchaCheck(randstr, ticket, ip)) return { M: { c: '验证时发生错误，请重试！' }, ForgotLoading: '' };
    if (!ticket || !randstr || !calling || !phone) return { M: { c: '参数不完整，请重试！' }, ForgotLoading: '' };
    if (!await CallingCheck(calling)) return { M: { c: '非常抱歉，暂未支持该国家的手机号，请更换！' }, ForgotLoading: '' };
    if (!await PhoneCheck(calling, phone)) return { M: { c: '手机号码格式错误，或手机归属国不对应，请检查！' }, ForgotLoading: '' };
    // 
    if(!await USERS.findOne({ attributes: ['id'], where: { calling, phone } })) return { ForgotStatus: { phone: { s: 'error', h: '手机号码不存在，请更换' } }, ForgotLoading: '' };
    // 
    let code = await AlismsSend('wjmm', calling, phone, ip);
    if (code < 0) return { M: { c: '发送失败，请稍后再试！' }, ForgotLoading: '' };
    if (code < 60) return { M: { c: '短信发送过快，请 ' + code + ' 秒后再试！' }, Forgot: { SendTime: code }, ForgotLoading: '' };
    // 
    return {
        ForgotLoading: '',
        Forgot: {
            SendTime: 59,
            _code: await enSign(calling + '|' + phone + '|' + ip + '|' + code + '|' + dayjs().add(600, 'second').valueOf())
        },
        M: { c: '验证码发送成功，请注意查收！' }
    }
};
// 忘记密码
const forgot = async(d) => 
{
    const { _code, code, calling, phone, pass, repass } = d;
    if (!_code) return { M: { c: '请先获取验证码！' } };
    if (!code || !phone || !pass || !repass) return { M: { c: '参数不完整，请重试！' } };
    let ForgotStatus = {};
    if (!await PhoneCheck(calling, phone)) ForgotStatus['phone'] = { s: 'error', h: '格式错误' };
    if (!/^[0-9]{6}$/.test(code)) ForgotStatus['code'] = { s: 'error', h: '格式为 6位数字' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) ForgotStatus['pass'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) ForgotStatus['repass'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    if (pass!==repass) ForgotStatus['repass'] = { s: 'error', h: '两次密码不一致！' };
    if (!await USERS.findOne({attributes:['id'],where:{calling,phone}})) ForgotStatus['phone'] = { s: 'error', h: '手机号码不存在，请更换' };
    try {
        let __code = await deSign(_code);
        __code = __code.split('|');
        if (__code[0] != calling || __code[1] != phone || __code[2] != ip) return { M: { c: '验证码在验证时发生错误，请重试！' }, ForgotLoading:'' };
        if (parseInt(__code[4]) < dayjs().valueOf()) return { M: { c: '验证码已过期，请重新获取！' }, ForgotLoading:'' };
        if (__code[3] != code) ForgotStatus['code'] = { s: 'error', h: '验证码错误，请更正！' };
    } catch (error) {

    }
    if (Object.keys(ForgotStatus).length > 0) return { ForgotStatus, ForgotLoading:'' };
    // 
    const _pass = await xPass(pass);
    // 
    await USERS.update({ pass:_pass }, {
        where:{
            calling,
            phone
        }
    });
    //
    return { 
        M: { c: '恭喜您，密码修改成功！',bt:'点击跳转至账号登录', bcn:1, b:1, boo:{u:'dl'}}, 
        ForgotLoading:''
    };
};
// 登录密钥
const logincode = async(d) => 
{
    const { ticket, randstr, user, pass, ip } = d;
    if (!ticket || !randstr || !user || !pass) return { M: { c: '参数不完整，请重试！' }, LoginLoading: '' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(user)) return { M: { c: '账号或密码错误，请重试！' }, LoginLoading: '' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(pass)) return { M: { c: '账号或密码错误，请重试！' }, LoginLoading: '' };
    //
    if (!await TxcaptchaCheck(randstr, ticket, ip)) return { M: { c: '验证时发生错误，请重试！' }, LoginLoading: '' };
    //
    const _user = await USERS.findOne({ attributes: ['id', 'calling', 'phone', 'pass'], where: { user } });
    if (!_user) return { M: { c: '账号或密码错误，请更正！' }, LoginLoading: '' };
    const _loginnum = await USERLOGINNUM.count({where:{user_id:_user.id,status:2}});
    if(_loginnum>5)
    {
        return { M: { c: '账号密码错误已达到 '+_loginnum+' 次，已被禁止登录，请通过忘记密码修改，或联系客服处理！' }, LoginLoading: '' };
    }
    if(!await cPass(pass, _user.pass))
    {
        await USERLOGINNUM.create({
            user_id: _user.id,
            user,
            pass,
            status: 2,
            ip,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
        // 
        const _num = parseInt(5 - parseInt(_loginnum));
        return { M: { c: '账号或密码错误，剩余 '+_num+' 次登录机会！' }, LoginLoading: '' };
    }
    if(_loginnum>0)
    {
        await USERLOGINNUM.update({status:1},{where:{user_id:_user.id,status:2}});
    }
    // 
    let code = await AlismsSend('login', _user.calling, _user.phone, ip);
    if (code < 0) return { M: { c: '登录验证码发送失败，请稍后再试！' }, LoginLoading: '' };
    if (code < 60) return { M: { c: '登录验证码发送过快，请 ' + code + ' 秒后再试！' }, LoginLoading: '' };
    // 
    return {
        LoginLoading: '',
        Login: {
            phone: _user.calling + ' ' + await phoneHide(_user.phone),
            _code: await enSign(_user.calling + '|' + _user.phone + '|' + ip + '|' + code + '|' + dayjs().add(600, 'second').valueOf() + '|' + _user.id)
        }
    }
};
// 进行登录
const login = async(d) => 
{
    const { _code, code, ip } = d;
    if (!_code || !code) return { M: { c: '参数不完整，请重试！' }, PhoneCodeLoading: '' };
    let PhoneCodeStatus = {};
    if (!/^\d{6}$/.test(code)) PhoneCodeStatus['code'] = { s: 'error', h: '格式为 6位数字' };
    let id;
    try {
        let __code = await deSign(_code);
        __code = __code.split('|');
        id = parseInt(__code[5]);
        if (__code[2] != ip || !id || id <= 0) return { M: { c: '验证码在验证时发生错误，请重新登录！' }, Login: '', PhoneCodeStatus: '', PhoneCodeLoading: '' };
        if (parseInt(__code[4]) < dayjs().valueOf()) return { M: { c: '验证码已过期，请重新登录！' }, Login: '', PhoneCodeStatus: '', PhoneCodeLoading: '' };
        if (__code[3] != code) return { PhoneCodeStatus: { code: { s: 'error', h: '验证码错误，请更正！' } }, PhoneCodeLoading: '' }
    } catch (error) {

    }
    const _user = await USERS.findOne({ attributes: ['nick', 'role', 'level', 'sound', 'status', 'user'], where: { id } });
    if (!_user) return { M: { c: '获取用户信息错误 1，请重新登录！' }, Login: '', PhoneCodeStatus: '', PhoneCodeLoading: '' };
    if (_user.status > 1) return { M: { c: '该账号已暂时被冻结，如有疑问请联系客服！' }, Login: '', PhoneCodeStatus: '', PhoneCodeLoading: '' };
    let _data;
    let Auth = {};
    // 
    if(_user.role==1)
    {
        _data = await USERDATA.findOne({ attributes: ['dou','bank'], where: { user_id: id } });
        Auth = {
            id: id,
            user: _user.user,
            nick: _user.nick,
            level: _user.level, 
            role: _user.role,
            dou: _data.dou,
            bank: _data.bank,
            exp: _data.exp,
            sound: _user.sound || 1
        }
    }else{
        _data = await AGENT.findOne({ attributes: ['dou','up_rate','down_rate','up_max'], where: { agent_id: id } });
        Auth = {
            id: id,
            nick: _user.nick,
            level: _user.level, 
            role: _user.role,
            dou: _data.dou,
            up_rate: parseFloat(_data.up_rate)*10,
            down_rate: parseFloat(_data.down_rate)*10,
            up_max: _data.up_max,
            sound: _user.sound || 1
        }
    }
    if (!_data) return { M: { c: '获取用户信息错误 2，请重新登录！' }, Login: '', PhoneCodeStatus: '', PhoneCodeLoading: '' };
    // 
    const uuid = await UUID(8);
    //
    await USERS.update({
        uuid
    }, {
        where: { id }
    });
    // 日志
    await USERLOG.create({
        user_id: id,
        des: '账号登录',
        ip,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });
    // 异地登录通知
    // 
    return {
        M: { c: '恭喜您！登录成功！', bt:'点击跳转至会员中心', bcn:1, b:1, boo:{u:'user'} },
        Auth: {
            ...Auth,
            __tk: await enSign(id + '|' + uuid + '|' + ip + '|' + dayjs().valueOf()),
        },
        Login: '',
        PhoneCodeStatus: '',
        PhoneCodeLoading: '',
    }
};
// 
module.exports = {
    registercode,
    forgotcode,
    logincode,
    login,
    register,
    forgot
};