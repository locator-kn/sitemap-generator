var sm = require('sitemap');
var cradle = require('cradle');

var envVariables;
var databaseName = 'app';
var url = 'localhost';
var port = 5984;

var smUrlRoot = 'https://locator-app.com';

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

var db = new(cradle.Connection)().database(databaseName);

db.view('location/locationIds', function (err, res) {
    res.forEach(function(elem) {
        console.log(smUrlRoot + '/location/' + elem.id);
    });
    //console.log(res, res.length);
});
db.view('trip/tripIds', function (err, res) {
    res.forEach(function(elem) {
        console.log(smUrlRoot + '/trip/' + elem.id);
    });
    //console.log(res, res.length);
});
