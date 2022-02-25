// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERS, USERHDFL } = require('../../sequelize/sd28');
const { getHdfl, getYgz } = require('../../service/hdfl');
// 提现列表
const list = async(d) => 
{
    const { user_id, page, mode } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id, mode };
    // 
    const count = await USERHDFL.count({ where });
    const rows = await USERHDFL.findAll({
        attributes: ['type','num','dou','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>
    {
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.type,
            v.num,
            v.dou
        ])
    });
    return  [
        [page, count],
        list
    ];
}
//
const now = async(d)=>
{
    let { id, page } = d;
    // 
    return {
        ...await getHdfl({ user_id: id }),
        UserHdflList: await list({ user_id:id, page, mode:1 }),
        UserHdflLoading:''
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
        return { M:{c:'该账号为测试账号，无法领取！'}, UserHdflLoading:'' };
    }
    // 
    await SubDo({
        platform: 'user',
        path: [ 'hdfl', 'go' ],
        data: { uuidkey, id }
    });
}
// 
const ygz = async(d)=>
{
    let { id, page } = d;
    // 
    return {
        UserYgzList: await list({ user_id:id, page, mode:2 }),
        UserYgzLoading: '',
        ...await getYgz({ user_id: id })
    }
}
const ygz_go = async(d) => 
{
    let { uuidkey, id } = d;
    // 
    const _user = await USERS.findOne({ attributes: ['cs'], where:{id} });
    if(_user && _user.cs=='2')
    {
        return { M:{c:'该账号为测试账号，无法领取！'}, UserYgzLoading:'' };
    }
    // 
    await SubDo({
        platform: 'user',
        path: [ 'hdfl', 'ygz_go' ],
        data: { uuidkey, id }
    });
}
// 
module.exports = {
    list,
    now,
    go,
    ygz,
    ygz_go
};