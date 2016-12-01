var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PRE_PERMIT', 'smart_permit');
var index = require('./index.js');

exports.getCurrentQuestion = function(req, res){
	var id = req.query.id;

	if(index.checkLogin(req,res)){
		console.log("req query is: ", JSON.stringify(req.query));
		var qs = "Select Question, Options, Next_question, Answer_type from PRE_PERMIT where ID="+id;
		dbObject.find(qs, function(err, response){
			if (err) {
	            res.status(500).jsonp(err)
	        }
	        console.log("\n\nresponse FOR prepermit is: ", response);
	        console.log(response[0].Next_question);
	        res.jsonp(response[0]);
		});
	}
};

exports.saveNextQuestion = function(req, res){

	if(index.checkLogin(req,res)){
		var qid = req.body.saveQuestions;
		console.log("req in saveQuestions is: ", req.body);
		console.log("len is: ", req.body.saveQuestions.length);
		for(var i = 0; i < qid.length; i++){
			if(qid[i] != '')
				req.session.question_set.push(qid[i]);
		}
		console.log("next question set: ", req.session.question_set);
		res.jsonp(req.session.question_set);
	}
}


exports.checkNextQuestions = function(req, res){
	var id ={};
	if(index.checkLogin(req,res)){
		if(req.session.question_set.length > 0){
			id = req.session.question_set.pop();

			var qs = "Select Question, Options, Next_question, Answer_type from PRE_PERMIT where ID="+id.next_question_id;

			dbObject.find(qs, function(err, response){
				if (err) {
		            res.status(500).jsonp(err)
		        }
		        console.log("\n\nresponse FOR prepermit is: ", response);
		        console.log(response[0].Next_question);
		        res.send({"msg": "Success", "data":response[0], "previous_answer": id.answer});
			});
		}
		else{
			res.send({"msg":"Empty stack", "data": "None"});
		}
	}
}