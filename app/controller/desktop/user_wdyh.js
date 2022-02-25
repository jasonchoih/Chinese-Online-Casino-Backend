//
const dayjs = require('dayjs');
const { USERS, USERDATA, USERLOGBANK, USERBETAUTO } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
const { xPass, cPass } = require('../../plugin/cryptos');
const { SubDo } = require('../../plugin/redis');
// 我的银行
const now = async(d) => 
{
    const { id } = d;
    const _user_data = await USERDATA.findOne({ attributes: ['dou','bank'], where:{ user_id:id} });
    return {
        Auth:{
            dou: _user_data.dou,
            bank: _user_data.bank,
        },
        Userwdyh: {
            dou: _user_data.dou,
            bank: _user_data.bank,
        },
        ...await list(d)
    }
}
// 我的银行 - 存豆
const cun = async(d) => 
{
    let { id,uuidkey,num,safe } = d; 
    // 是否有自动投注
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            M:{
                c: '已存在自动投注，无法进行银行存豆，请先暂停自动投注！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            },
            UserdbankcunLoading: ''
        }
    }
    // 
    let UserdbankcunStatus = {};
    if (!/^[0-9]{1,15}$/.test(num)) UserdbankcunStatus['num'] = { s: 'error', h: '请输入金豆数量，格式为数字' };
    num = parseInt(num);
    if (!num || num=='0' || num<=0) UserdbankcunStatus['num'] = { s: 'error', h: '最低输入 1 金豆' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(safe)) UserdbankcunStatus['safe'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    const _user = await USERS.findOne({ attributes: ['safe'], where:{id} });
    if(!await cPass(safe,_user.safe)) UserdbankcunStatus['safe'] = { s: 'error', h: '安全码错误' };
    if (Object.keys(UserdbankcunStatus).length > 0) return { UserdbankcunStatus, UserdbankcunLoading: '' };
    //
    await SubDo({ 
        path:[ 'user', 'wdyh_cun' ],
        data:{ uuidkey, id, num }
    });
}
// 我的银行 - 取豆
const qu = async(d) => 
{
    let { id,uuidkey,num,safe } = d;
    // 是否有自动投注
    const _is_has_auto = await USERBETAUTO.findOne({where:{user_id:id,status:2}});
    if(_is_has_auto)
    {
        return {
            M:{
                c: '已存在自动投注，无法进行银行取豆，请先暂停自动投注！',
                bt: '前往该自动投注',
                boo: { u: 'game/'+_is_has_auto.category+'/'+_is_has_auto.type+'/zd' },
                b:1
            },
            UserdbankquLoading: ''
        }
    }
    // 
    let UserdbankquStatus = {};
    if (!/^[0-9]{1,15}$/.test(num)) UserdbankquStatus['num'] = { s: 'error', h: '请输入金豆数量，格式为数字' };
    num = parseInt(num);
    if (!num || num=='0' || num<=0) UserdbankquStatus['num'] = { s: 'error', h: '最低输入 1 金豆' };
    if (!/^[a-zA-Z0-9\_\-\@\.]{6,26}$/.test(safe)) UserdbankquStatus['safe'] = { s: 'error', h: '格式为 a-zA-Z0-9_-@.，长度6-26' };
    const _user = await USERS.findOne({ attributes: ['safe'], where:{id} });
    if(!await cPass(safe, _user.safe)) UserdbankquStatus['safe'] = { s: 'error', h: '安全码错误' };
    if (Object.keys(UserdbankquStatus).length > 0) return { UserdbankquStatus, UserdbankquLoading: '' };
    //
    await SubDo({ 
        path:[ 'user', 'wdyh_qu' ],
        data:{ uuidkey, id, num }
    });
}
// 我的银行 - 列表
const list = async(d) => 
{
    const { id,page } = d;
    const { offset,limit } = await xpage(page);
    //
    const { count,rows } = await USERLOGBANK.findAndCountAll({
        attributes: ['type','num','dou','bank','time'],
        where: { user_id: id },
        order: [ ['id','DESC'] ],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.type,
            v.num,
            v.dou,
            v.bank
        ])
    })
    return {
        UserwdyhList:[
            [page, count],
            list
        ]
    }
}
//
module.exports = {
    now,
    cun,
    qu,
    list
};