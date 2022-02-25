// 
const { controller } = require('./app/plugin/controllers');
const desktop = controller('../controller/desktop');
// 
const { wsss } = require('./app/plugin/wss');
//
const ports = [
  1001,
  1002,
  1003,
  1004,
  1005,
  1006,
  1007,
  1008,
  1009,
  1010,
];
//
for(let i in ports)
{
  wsss(ports[i], desktop);
}