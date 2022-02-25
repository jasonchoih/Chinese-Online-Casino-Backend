//
const fs = require('fs');
const path = require('path');
// 
const controller = (_path) => 
{
    let cons = {};
    const files = fs.readdirSync(path.join(__dirname, _path));
    for(let i in files)
    {
        let fileName = files[i].replace(/\.js/i, '');
        cons[fileName] = require(_path+'/'+fileName);
    }
    return cons;
}
// 
module.exports = {
    controller
};