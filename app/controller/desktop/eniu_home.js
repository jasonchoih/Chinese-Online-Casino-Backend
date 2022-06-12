const { getNewLottery } = require('../../service/game');
const { TITLE } = require('../../sequelize/sd28');
// 
const index = async(d) => 
{
    const games = {
        'jnd': 28,
        'dd' : 28,
        'pk' : 10
    };
    // 
    let Lottery = {};
    for ( let i in games )
    {
        Lottery['Lottery'+i+''+games[i]] = await getNewLottery(i, games[i])
    }
    // 
    return {
        ...Lottery
    }
};
// 
const newshome = async(d) => 
{
    const rows = await TITLE.findAll({
        attributes: ['title'],
        order: [['id','DESC']],
        limit: 3
    });
    let NewListHome = [];
    rows.map((v,k)=>{
        NewListHome.push(
            v.title
        )
    });
    return {
        NewListHome
    };
}
// 
const news = async(d) => 
{
    const rows = await TITLE.findAll({
        attributes: ['id','title','time'],
        order: [['id','DESC']]
    });
    let NewList = [];
    const rowslen = rows.length;
    rows.map((v,k)=>{
        NewList.push([
            rowslen-k,
            v.title,
            dayjs(v.time).format('YYYY-MM-DD HH:mm:ss'),
            v.id
        ])
    });
    return {
        NewList,
    };
}
// 
module.exports = {
    index,
    news,
    newshome
};