var mysql = require('mysql');
var config = require('../../config/config.js');

var connections = {};

module.exports = function (db) {
	if (connections[db] && connections[db].connection) {
		return connections[db].connection;
	};

	connections[db] = {};
	connections[db].connection = mysql.createConnection({
      	host     : config.database[db]['host'],
		user     : config.database[db]['userName'],
		password : config.database[db]['password'],
		database : db,
		//socketPath: '/var/run/mysqld/mysqld.sock'
    });
 
	connections[db].connection.connect();
	return connections[db].connection;
}

