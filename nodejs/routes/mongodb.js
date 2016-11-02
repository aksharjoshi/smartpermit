var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

//Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/local';

//Use connect method to connect to the Server
function testConnection(){
	
	
}


function fetch(callback,mongoquery){
	
	console.log("\nMongo Query::"+mongoquery);
	
	//var con=testConnection();
	//console.log(con);
	myconnection.query(mongoquery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			//console.log("DB Results:"+rows);
			console.log(rows.length);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	con.end();

}

exports.connect=testConnection;
