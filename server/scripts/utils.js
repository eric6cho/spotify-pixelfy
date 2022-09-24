const fs = require('fs');
const request = require('request');

// start util helper const definitions

const VAL = 'VAL';

// end util helper const definitions

// start util helper function definitions

const utilTest = (p) => {

  return p;
};

const getUrlData = async url => new Promise (resolve => 
  request.get(url, (error, response, body) => resolve(JSON.parse(body))));

// end util helper function definitions

// start serverUtil class definition

let util = class {
  test=(p)=>utilTest(p);
}

module.exports = new util();

// end util class definition

/*
  util.js

  Description:

*/