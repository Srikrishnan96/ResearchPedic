const path = require('path');
const timestamp = require('timestamp');
module.exports = path.dirname(process.mainModule.filename);

console.log(timestamp('MM/DD/YYYY'));

console.log('hello');
