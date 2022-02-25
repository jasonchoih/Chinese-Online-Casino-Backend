const { TITLE } = require('../sequelize/sd28');
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
    console.log ({
        NewList
    });
}
// 
news();