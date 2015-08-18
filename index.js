'use strict';
var sm = require('sitemap');
var cradle = require('cradle');

var envVariables;
var databaseName = 'app';
var url = 'localhost';
var port = 5984;

var smUrlRoot = 'https://locator-app.com';

var relativeUrls = [];

// if build is triggerd in travis
if (process.env.travis) {
    envVariables = require('./placeholderEnv.json');

} else {
    // production
    envVariables = require('./env.json');
}

cradle.setup({
    host: url || 'localhost',
    port: port || 5984,
    auth: {
        username: envVariables.db.COUCH_USERNAME,
        password: envVariables.db.COUCH_PASSWORD
    }
});

var db = new (cradle.Connection)().database(databaseName);

Promise.all([buildLocationUrls(), buildTripUrls()])
    .then(function () {
        var sitemap = sm.createSitemap({
            hostname: smUrlRoot,
            cacheTime: 600000,        // 600 sec - cache purge period
            urls: relativeUrls
        });
        sitemap.toXML(function (xml) {
            console.log(xml);
        });
    });


function buildLocationUrls() {
    return new Promise(function (resolve, reject) {
        db.view('location/locationIds', function (err, res) {
            if (err) {
                return reject(err);
            }
            res.forEach(function (elem) {
                relativeUrls.push('/location/' + elem.id);
            });
            resolve();
        });
    });
}

function buildTripUrls() {
    return new Promise(function (resolve, reject) {
        db.view('trip/tripIds', function (err, res) {
            if (err) {
                return reject(err);
            }
            res.forEach(function (elem) {
                relativeUrls.push('/trip/' + elem.id);
            });
            resolve();
        });
    });
}
