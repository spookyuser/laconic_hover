var fs = require('fs');
var deploy = require('chrome-extension-deploy');

deploy({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    id: 'ignndocldlheghlflchdbokagecncgmm',
    zip: fs.readFileSync('./dist/laconic-hover.zip'),
    to: deploy.PUBLIC
}).then(function () {
    console.log("Successful chrome deploy!");
}, function (err) {
    console.log("Failed to deploy:", err);
});