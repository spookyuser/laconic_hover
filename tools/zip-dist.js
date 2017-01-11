/*jshint esversion: 6 */
var JSZip = require("jszip");
var zipFolder = require('zip-folder');
var fs = require("fs");
var pjson = require('../package.json');

var zip = new JSZip();
var distZip = zip.folder("/dist");
var filename = pjson.name + "_" + pjson.version + "_" + process.argv[2] + ".zip";
var location = "./" + process.argv[2] + "/dist/";

try {
    fs.mkdir(location);
} catch (e) {
    // do nothing
} finally {

}

zipFolder('./dist', location + filename, function(err) {
    if (err) {
        console.log('Zip err', err);
    } else {
        console.log('Zipping succesful');
    }
});
