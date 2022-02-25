'use strict';
// 掩码
const mask = (i, ikey) => {
    return ikey[i & ikey.length];
};
// obj转buffer
const arrayToBuffer = async(obj, ikey) => 
{
    let str = JSON.stringify(obj);
    let source = '';
    try {
        let _arr = [];
        for (let i = 0; i < str.length; i++) {
            _arr.push(str.charCodeAt(i) ^ mask(i, ikey));
        }
        source = new Uint16Array(_arr);
    } catch (e) {

    }
    return source;
};
// str转buffer
const strToBuffer = async(str, ikey) => 
{
    let source = '';
    try {
        let _arr = [];
        for (let i = 0; i < str.length; i++) {
            _arr.push(str.charCodeAt(i) ^ mask(i, ikey));
        }
        source = new Uint16Array(_arr);
    } catch (e) {

    }
    return source;
};
// buffer转数组
const bufferToArray = async(d, ikey) => 
{
    let message = '';
    try {
        message = new Uint16Array(d.length / 2);
        let j = 0;
        for (let i = 0; i < d.length; i += 2) {
            message[j] = d.readUInt16LE(i);
            message[j] ^= mask(j, ikey);
            j++;
        }
        message = JSON.parse(String.fromCharCode.apply(null, message));
    } catch (e) {
        
    }
    return message;
};
//
module.exports = {
    strToBuffer,
    arrayToBuffer,
    bufferToArray
};