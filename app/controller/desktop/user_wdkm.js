//
const dayjs = require('dayjs');
const { USERCARD } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
// 投注记录 
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    let where = { user_id: id };
    // 
    const count = await USERCARD.count({ where });
    const rows = await USERCARD.findAll({
        attributes: ['km','money','rate','status','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            v.km,
            v.money,
            v.rate,
            v.status,
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
        ])
    });
    return {
        Userwdkm: [
            [page, count],
            list
        ]
    };
}
//
module.exports = {
    list
};