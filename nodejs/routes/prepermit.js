var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PRE_PERMIT', 'smart_permit');

exports.getCurrentQuestion = function(req, res){
	var id = req.query.id;

	//console.log("req is: ", JSON.stringify(req));
	
	req.session.question_set=[];

	console.log("req query is: ", JSON.stringify(req.query));
	//console.log("session var is ", req.session.question_set);

	var qs = "Select Question, Options, Next_question from PRE_PERMIT where ID="+id;

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
		if (err) {
        	//console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR prepermit is: ", response);

        //req.session.question_set.push(response[0]);

        //response[0].Next_question = JSON.parse
        console.log(response[0].Next_question);

       // JSON.parse(response[0].Next_question);

        console.log((response[0].Next_question));

        res.jsonp(response[0]);
	});
};

exports.saveNextQuestion = function(req, res){

	var qid = req.body.saveQuesitions;

	for(id in qid){
		req.session.question_set.push(id);
	}
	console.log("next question set: ", req.session.question_set);
}