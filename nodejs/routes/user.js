
/*
 * GET users listing.
 */
var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('USER', 'smart_permit');


exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.postUser = function(req, res){
	

};