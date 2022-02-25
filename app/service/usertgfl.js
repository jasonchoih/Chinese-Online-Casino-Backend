// 
const { USERTGFL } = require('../sequelize/sd28');
// 
const UserTgflSum = async(user_id) => 
{
    const usertgfl = await USERTGFL.findOne({where:{user_id}});
    // 
    const tgflodd = 0.1; // %
    // 
    if(!usertgfl)
    {
        return {
            tgflman: 0,
            tgflbet: 0,
            tgflodd,
            tgflsum: 0
        }
    }
    // 
    const _tgflodd = parseFloat(tgflodd/100);
    const tgflbet = usertgfl&&usertgfl.bet||0;
    const tgflsum = parseInt(tgflbet*_tgflodd);
    // 
    return {
        tgflman: usertgfl.man,
        tgflbet,
        tgflodd,
        tgflsum
    }
}
//
module.exports = {
    UserTgflSum
};