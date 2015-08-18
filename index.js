var sm = require('sitemap');
var cradle = require('cradle');

var envVariables;
var databaseName = 'app';
var url = 'localhost';
var port = 5984;

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
console.log(db);
