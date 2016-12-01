var DB =  require("./dbConnect.js")

module.exports = function(collection, dbName){
	this.collection = collection;
	this.connection = DB(dbName);

	this.find = function (qs, callBack) {

		console.log("qs ", qs);

		this.connection.query(qs, function (err, rows, fields) {
			callBack(err, rows, fields);
		});
	}

	this.create = function (data, callBack) {
		var qs = "INSERT INTO "+ this.collection + " SET ?";
		console.log("qs in create is: ", qs, data);

		this.connection.query(qs, data, function (err, result) {

			if(err){
			    console.log("error", JSON.stringify(err));
			}
			else{
				callBack(err, result);
			}
		});
	}
}