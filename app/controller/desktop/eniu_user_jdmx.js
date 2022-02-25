//
const dayjs = require('dayjs');
const { Op,sequelize, QueryTypes, USERLOGDOU } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
//
const list = async(d) => 
{
    const { id, type, mode, page, time_start } = d;
    // 
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD');
    const daybefore = dayjs().add(-2, 'day').format('YYYY-MM-DD');
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id, time: today };
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
            list,
        ],
        tabs : [today,yesterday,daybefore]
    };
}
// 
const get = async(d) => 
{
    const { id, type, mode, page, time_start } = d;
    const { offset,limit } = await xpage(page);
    // 
    const userlogdou = await sequelize.query(`
        SELECT  type,
                mode,
                num,
                dou,
                des,
                time
        FROM    user_log_dou
        WHERE   user_id = ${id}
        AND     type = ${type}
        AND     time LIKE '${time_start}%'
        ORDER BY id DESC
        LIMIT   ${limit}
        OFFSET  ${offset}`,
    {
        type: QueryTypes.SELECT,
        plain: false
    });
    // 
    const count = await sequelize.query(`
        SELECT  count(*) as count
        FROM    user_log_dou
        WHERE   user_id = ${id}
        AND     type = ${type}
        AND     time LIKE '${time_start}%'
        ORDER BY id DESC
        LIMIT   ${limit}
        OFFSET  ${offset}`,
    {
        type: QueryTypes.SELECT,
        plain: false
    });
    let list = [];
    userlogdou.map((v)=>{
        list.push([
            v.type,
            v.mode,
            v.num,
            v.dou,
            v.des||'',
            dayjs(v.time).format('HH:mm:ss'),
        ])
    });
    // 
    const _count = count[0]['count'];
    return {
        Userjdmx: [
            [page, _count],
            list,
        ]
    };
}
//
module.exports = {
    list,
    get
};