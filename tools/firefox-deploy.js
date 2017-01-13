// From https://www.npmjs.com/package/firefox-extension-deploy
var fs = require('fs');
var deploy = require('firefox-extension-deploy');

deploy({
    // obtained by following the instructions here:
    // https://olympia.readthedocs.io/en/latest/topics/api/auth.html
    // or from this page:
    // https://addons.mozilla.org/en-US/developers/addon/api/key/
    issuer: process.env.FIREFOX_USER,
    secret: process.env.FIREFOX_SECRET,

    // the ID of your extension
    id: 'exampleId@jetpack',
    // the version to publish
    version: require('../package.json').version,

    // a ReadStream containing a .zip (WebExtensions) or .xpi (Add-on SDK)
    src: fs.createReadStream('path/to/zipped/extension.zip')
}).then(function () {
    // success!
}, function (err) {
    console.error('Firefox deploy fail:', err);
    process.exitCode = 1;
});
