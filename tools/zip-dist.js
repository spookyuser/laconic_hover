// From https://archiverjs.com/docs/
// From https://github.com/archiverjs/node-archiver/issues/156#issuecomment-135497173
// require modules
var fs = require('fs');
var archiver = require('archiver');

// create a file to stream archive data to.
var output = fs.createWriteStream('./dist/laconic-hover.zip');
var archive = archiver('zip', {
//    DON'T SET STORE = TRUE. MUST BE ZIPPED FOR CHROME.
});

// listen for all archive data to be written
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

// good practice to catch this error explicitly
archive.on('error', function (err) {
    console.log("Zipping fail:", err);
    process.exitCode = 1;
});
archive.pipe(output);

// append files from a directory
archive.directory('build/', '/');

// finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();