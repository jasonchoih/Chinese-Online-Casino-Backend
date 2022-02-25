//
const { sequelize,Transaction } = require('../sequelize/sd28');
// 
const TCL = async(d) => 
{
    let _re;
    try {
        _re = await sequelize.transaction({
            autocommit: true,
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async(transaction) => 
        {
            return d(transaction);
        });
    } catch (e) {
        _re = parseInt(e.message);
    }
    return _re;
}
// 
const TCC = async(d) => 
{
    let _re;
    // try {
        _re = await sequelize.transaction({
            autocommit: true,
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async(transaction) => 
        {
            return d(transaction);
        });
    // } catch (e) {
    //     _re = parseInt(e.message);
    // }
    return _re;
}
// 
module.exports = 
{
    TCL,
    TCC
}