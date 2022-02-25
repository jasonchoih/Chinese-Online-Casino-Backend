// 
const dayjs = require("dayjs");
const { xpage } = require('../../plugin/tool');
const { SubDo } = require('../../plugin/redis');
const { USERS, AGENT } = require('../../sequelize/sd28');
//
const info = async(d) => 
{
    const { id } = d;
    const _user = await USERS.findOne({attributes:['nick'],where:{id}});
    const _agent = await AGENT.findOne({attributes:['dou','up_rate','down_rate','up_max'],where:{agent_id:id}});
    // 
    return {
        Auth:{
            nick: _user.nick,
            dou: _agent.dou,
            up_rate: _agent.up_rate,
            down_rate: _agent.down_rate,
            up_max: _agent.up_max,
        }
    }
}
// 
module.exports = {
    info
};