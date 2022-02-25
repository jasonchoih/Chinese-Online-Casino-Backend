//
const dayjs = require('dayjs');
const { USERBET } = require('../../sequelize/sd28');
const { xpage } = require('../../plugin/tool');
// 投注记录 
const list = async(d) => 
{
    const { id, game, peroids, page } = d;
    const [ category, type ] = game||[];
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id };
    if(category) where['category'] = category;
    if(type) where['type'] = type;
    if(peroids) where['peroids'] = peroids;
    // 
    const count = await USERBET.count({ where });
    const rows = await USERBET.findAll({
        attributes: ['id','category','type','peroids','dou','win_dou','wins','vals','mode','ls','status','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    for(let i in rows)
    {
        let v = rows[i];
        let vals = JSON.parse(v.vals);
        let wins = v.wins?JSON.parse(v.wins):'';
        let _new_vals = {};
        for(let j in vals)
        {
            _new_vals[j] = [
                vals[j],
                ...(wins&&wins[j]||['-','-'])
            ]
        }
        list.push([
            dayjs(v.time).format('MM-DD HH:mm:ss'),
            v.category,
            v.type,
            v.peroids,
            v.mode,
            v.dou,
            v.win_dou,
            v.status,
            _new_vals,
            v.ls,
        ])
    };
    return {
        Usertzjl: [
            [page, count],
            list
        ],
        UserTzjlLoading:''
    };
}
//
module.exports = {
    list
};