var pjson = require('../package.json');
var filename = pjson.name + "_" + pjson.version + "_" + process.argv[2] + ".crx";
console.log(filename);