const fs = require('fs');
const request = require('request');

// start util helper const definitions

const VAL = 'VAL';

// end util helper const definitions

// start util helper function definitions

const utilsTest = (p) => {

  return p;
};

const utilsGetRandomStr = (length=16) => {
  let str = '';
  let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i=0; i<length; i++) 
    str += s.charAt(Math.floor(Math.random()*s.length));
  return str;
};

const utilsGetUrlData =async (url) => new Promise (resolve => request.get(url, (error, response, body) => resolve(JSON.parse(body))));

// end util helper function definitions

// start serverUtil class definition

let utils = class {
  test=(p)=>utilsTest(p);
  getRandomStr=(length)=>utilsGetRandomStr(length);
  getUrlData = async (url) => new Promise(resolve => resolve(utilsGetUrlData(url)));
}

module.exports = new utils();

// end util class definition

/*
  util.js

  Description:

*/