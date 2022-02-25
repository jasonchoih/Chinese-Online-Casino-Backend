
const { USERS, AGENT, QueryTypes, sequelize } = require('../sequelize/sd28');

const test = async() =>
{
    // const _agent = await sequelize.query('SELECT '+
    // '* '+
    // " FROM agent where up_rate>1.1", 
    // {
    //     type: QueryTypes.SELECT,
    //     plain: false,
    // });
    // 
    const _agent = await sequelize.query('SELECT '+
    '* '+
    " FROM agent", 
    {
        type: QueryTypes.SELECT,
        plain: false,
    });
    console.log(_agent);
    let _agents = {};
    for(let i in _agent)
    {
        const _ai = _agent[i];
        // _agents[_ai.agent_id] = {
        //     up_rate0: (_ai.up_rate).toFixed(3),
        //     up_rate: (_ai.up_rate/10).toFixed(3),
        //     down_rate0: (_ai.down_rate).toFixed(3),
        //     down_rate: (_ai.down_rate/10).toFixed(3)
        // }
        // await AGENT.update({ 
        //     up_rate: (_ai.up_rate/10).toFixed(3),
        //     down_rate: (_ai.down_rate/10).toFixed(3)
        // }, { 
        //     where:{
        //         id:_ai.id,
        //         agent_id:_ai.agent_id
        //     }
        // });
    }
    // console.log(_agents);
    // console.log(Object.keys(_agents).length);
};
test();