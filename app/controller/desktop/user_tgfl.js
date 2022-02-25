// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERHDFL } = require('../../sequelize/sd28');
const { UserTgflSum } = require('../../service/usertgfl');
// 提现列表
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id };
    where['type'] = 4;
    // 
    const count = await USERHDFL.count({ where });
    const rows = await USERHDFL.findAll({
        attributes: ['num','dou','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.num,
            v.dou
        ])
    });
    return {
        UserTgflList: [
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
    const { tgflman, tgflbet, tgflodd, tgflsum } = await UserTgflSum(id);
    // 
    return {
        UserYqhyFl: [
            tgflman,
            tgflbet,
            tgflodd,
            tgflsum
        ],
        ...await list({id})
    }
}
// 
const go = async(d) => 
{
    let { uuidkey, id } = d;
    // 
    await SubDo({
        platform: 'user',
        path: [ 'tgfl', 'go' ],
        data: { uuidkey, id }
    });
}
// 
module.exports = {
    list,
    now,
    go
};