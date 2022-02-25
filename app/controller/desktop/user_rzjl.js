//
const dayjs = require('dayjs');
const { USERLOG } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
// 投注记录 
const list = async(d) => 
{
    const { id,page } = d;
    const { offset,limit } = await xpage(page);
    //
    const { count,rows } = await USERLOG.findAndCountAll({
        attributes: ['des','ip','time'],
        where: { user_id: id },
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.des,
            v.ip
        ])
    })
    return {
        Userrzjl:[
            [page, count],
            list
        ]
    }
}
//
module.exports = {
    list
};