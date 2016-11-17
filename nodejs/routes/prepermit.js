var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PRE_PERMIT', 'smart_permit');

exports.getCurrentQuestion = function(req, res){
	var id = req.query.id;

	//console.log("req is: ", JSON.stringify(req));
	
	console.log("req query is: ", JSON.stringify(req.query));
	

	var qs = "Select Question, Options, Next_question from PRE_PERMIT where ID="+id;

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
		if (err) {
        	//console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR prepermit is: ", response);
        res.jsonp(response[0]);
	});
};