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
const news = async(d) => 
{
    const rows = await TITLE.findAll({
        attributes: ['title'],
        order: [['id','DESC']],
        limit: 3
    });
    let NewList = [];
    rows.map((v,k)=>{
        NewList.push(
            v.title
        )
    });
    return {
        NewList
    };
}
// 
module.exports = {
    index,
    news
};