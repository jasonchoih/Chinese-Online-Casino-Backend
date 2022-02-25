// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { GotoUrl, phoneHide } = require('../../plugin/tool');
const { USERS } = require('../../sequelize/sd28');
const { UserTgflSum } = require('../../service/usertgfl');
// 提现列表
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { parent: id, role: 1 };
    // 
    const count = await USERS.count({ where });
    const rows = await USERS.findAll({
        attributes: ['level','nick','calling','phone','name'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    for(let i in rows)
    {
        const v = rows[i];
        list.push([
            v.name ? '**'+(v.name).substr((v.name).length - 1) : '-',
            v.nick,
            v.level,
            v.calling+' '+await phoneHide(v.phone)
        ])
    }
    return {
        UserYqhyList: [
            [page||1, count],
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
module.exports = {
    list,
    now
};