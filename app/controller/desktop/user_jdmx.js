//
const dayjs = require('dayjs');
const { USERLOGDOU } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
//
const list = async(d) => 
{
    const { id, type, mode, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id };
    if(type) where['type'] = type;
    if(mode) where['mode'] = mode;
    // 
    const count = await USERLOGDOU.count({ where });
    const rows = await USERLOGDOU.findAll({
        attributes: ['type','mode','num','dou','des','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            v.type,
            v.mode,
            v.num,
            v.dou,
            v.des||'',
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
        ])
    });
    return {
        Userjdmx: [
            [page, count],
            list
        ]
    };
}
//
module.exports = {
    list
};