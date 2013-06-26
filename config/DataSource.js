var mongodb = require('mongodb'),
	mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 }),
	db = new mongodb.Db('guess_fun', mongodbServer);
module.exports = db;