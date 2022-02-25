// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERWDHB } = require('../../sequelize/sd28');
const { UserTgflSum } = require('../../service/usertgfl');
// 提现列表
const list = async(d) => 
{
    const { id, page } = d;
    //
    const { offset,limit } = await xpage(page);
    //
    let where = { user_id: id };
    // 
    const count = await USERWDHB.count({ where });
    const rows = await USERWDHB.findAll({
        attributes: ['hbm','num','dou','time'],
        where,
        order: [['id','DESC']],
        offset,
        limit
    });
    let list = [];
    rows.map((v,k)=>{
        list.push([
            dayjs(v.time).format('YY-MM-DD HH:mm:ss'),
            v.hbm,
            v.num,
            v.dou
        ])
    });
    return {
        UserWdhbList: [
            [page, count],
            list
        ],
        UserWdhbLoading:''
    };
}
// 
const go = async(d) => 
{
    let { uuidkey, id, hbm } = d;
    // 
    if(!/^[a-zA-Z0-9\-]{18,26}$/.test(hbm)) return {M:{c:'请输入正确的红包码！'},UserWdhbLoading:''}
    // 
    await SubDo({
        platform: 'user',
        path: [ 'wdhb', 'go' ],
        data: { uuidkey, id, hbm }
    });
}
// 
module.exports = {
    list,
    go
};