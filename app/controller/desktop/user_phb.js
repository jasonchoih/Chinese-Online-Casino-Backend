// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo, get_2 } = require('../../plugin/redis');
const { Op, USERS, USERPHB, USERDAYDATA } = require('../../sequelize/sd28');
// 列表
const list = async(d) => 
{
    const { user_id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id };
    // 
    const count = await USERPHB.count({ where });
    const rows = await USERPHB.findAll({
        // attributes: ['type','num','dou','time'],
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
            v.rank,
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
    const { id, page } = d;
    // 
    let UserPhbHave = '';
    let UserPhbNow = ['-','-','-','-']; // 时间 排名 奖励 状态
    const yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const _yser_day_data = await USERDAYDATA.findOne({attributes:['rank','phb','time'],where:{user_id:id,time:yestoday}});
    //
    const time_start = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const time_end = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const _phb_lq = await USERPHB.findOne({
        where:
        {
            user_id: id, 
            time:{
                [Op.gte]: time_start,
                [Op.lte]: time_end,
            }
        }
    });
    // 
    if(_yser_day_data)
    {
        const _phb = await get_2('PhbjlSet');
        const _rank = _yser_day_data.rank;
        const _lq = _phb_lq ? 2 : _yser_day_data.phb;
        // 
        UserPhbNow[0] = dayjs(_yser_day_data.time).format('YYYY-MM-DD');
        UserPhbNow[1] = _rank;
        UserPhbNow[2] = _phb['p'+_rank] || '-';
        UserPhbNow[3] = _lq
        // 
        if(_lq==1) UserPhbHave = 1;
    }
    // 
    return {
        UserPhbHave,
        UserPhbNow,
        UserPhbList: await list({ user_id:id, page }),
        UserPhbLoading:''
    }
}
// 
const go = async(d) => 
{
    const { uuidkey, id } = d;
    // 
    await SubDo({
        path:[ 'rank', 'go' ],
        data:{ uuidkey, id }
    });
}
// 
module.exports = {
    list,
    now,
    go
};