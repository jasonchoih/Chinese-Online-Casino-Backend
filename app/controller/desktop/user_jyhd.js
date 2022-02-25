// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERS, USERDATA, USEREXPDOU } = require('../../sequelize/sd28');
// 提现列表
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id };
    // 
    const count = await USEREXPDOU.count({ where });
    const rows = await USEREXPDOU.findAll({
        attributes: ['exp','num','dou','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.exp,
            v.num,
            v.dou
        ])
    });
    return {
        UserJyhdList: [
            [page, count],
            list
        ]
    };
}
//
const now = async(d)=>
{
    let { id } = d;
    //
    const _user = await USERDATA.findOne({attributes:['exp'],where:{user_id:id}});
    // 
    const _user_exp_dou_odd = 100;
    const _expodd = parseFloat(_user_exp_dou_odd/100);
    const _user_exp = _user&&_user.exp||0;
    const expsum = parseInt(_user_exp*_expodd);
    // 
    return {
        UserJyhd: [
            _user_exp,
            _user_exp_dou_odd,
            expsum
        ],
        ...await list({id})
    }
}
// 
const go = async(d) => 
{
    let { uuidkey, id } = d;
    // 
    const _user = await USERS.findOne({ attributes: ['cs'], where:{id} });
    if(_user && _user.cs=='2')
    {
        return { M:{c:'该账号为测试账号，无法兑换！'} };
    }
    // 
    await SubDo({
        platform: 'user',
        path: [ 'jyhd', 'go' ],
        data: { uuidkey, id }
    });
}
// 
module.exports = {
    list,
    now,
    go
};