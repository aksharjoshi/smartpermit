var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PRE_PERMIT', 'smart_permit');
var index = require('./index.js');

exports.getCurrentQuestion = function(req, res){
	var id = req.query.id;

	/*console.log("getCurrentQuestion");

	console.log("================== getCurrentQuestion ====================");
	console.log("Session in getCurrentQuestion is: ", req.session);*/

	if(index.checkLogin(req,res)){
		//console.log("req query is: ", JSON.stringify(req.query));
		var qs = "Select Question, Options, Next_question, Answer_type from PRE_PERMIT where ID="+id;
		dbObject.find(qs, function(err, response){
			if (err) {
	            res.status(500).jsonp(err)
	        }
	        console.log("\n\nresponse FOR prepermit is: ", response);
	        //console.log(response[0].Next_question);
	        res.jsonp(response[0]);
		});
	}
};

exports.saveNextQuestion = function(req, res){

	/*console.log("================== saveNextQuestion ====================");
	console.log("Session in saveNextQuestion is: ", req.session);*/
	if(index.checkLogin(req,res)){
		var qid = req.body.saveQuestions;
		console.log("req in saveQuestions is: ", req.body);
		console.log("len is: ", req.body.saveQuestions.length);
		for(var i = 0; i < qid.length; i++){
			if(qid[i] != '' && qid[i] != null && qid[i] != "undefined")
				req.session.question_set.push(qid[i]);
		}
		//console.log("next question set: ", req.session.question_set);
		/*console.log(" After push in session in  saveNextQuestion : ", req.session.question_set);
		console.log("================== saveNextQuestion ====================");*/

		res.send(req.session.question_set);
	}
}


exports.checkNextQuestions = function(req, res){
	var id ={};
	console.log("type of req.session", req.session.question_set);
	if(index.checkLogin(req,res)){
		if(typeof req.session.question_set == "object" && req.session.question_set.length > 0){
			/*console.log("in next question: ", req.session.question_set);

			console.log("================== checkNextQuestions before pop ====================");
			console.log("Session in saveNextQuestion is: ", req.session);
			console.log("Question set len: ", req.session.question_set.length);

			console.log(req.session.question_set);
			console.log("================== checkNextQuestions before pop ====================");*/

			/*var t = req.session.question_set;
			id = t[0]
			delete t[0]
			delete req.session.question_set;
			req.session.question_set = t;
			console.log("Value of t is: ", t);
*/
			console.log("question set is: ", req.session.question_set);
			id = req.session.question_set.pop();
			console.log("type of id is: ", typeof id.next_question_id);

			/*console.log("================== checkNextQuestions after pop ====================");
			console.log(req.session.question_set);
			console.log("================== checkNextQuestions after pop ====================");*/

			//console.log("Object id is: ", id);
			//console.log("next question id is: ", id.next_question_id);

			//console.log("after pop question set: ", req.session.question_set);

			var qs = "Select Question, Options, Next_question, Answer_type from PRE_PERMIT where ID="+id.next_question_id;

			dbObject.find(qs, function(err, response){
				if (err) {
		            res.status(500).jsonp(err)
		        }
		        //console.log("\n\nresponse FOR prepermit is: ", response);
		        //console.log(response[0].Next_question);
		        res.send({"msg": "Success", "data":response[0], "previous_answer": id.answer});
			});
		}
		else{
			res.send({"msg":"Empty stack", "data": "None"});
		}
	}
}

exports.getDescription = function(req, res){
	if(index.checkLogin(req,res)){
		var qs = "SELECT ACRONYM, DESCRIPTION FROM ACRONYM_MASTER WHERE ACRONYM IN (";

		var accr = JSON.parse(req.body.permits);
		//console.log("permits are : ", req.body.permits);
		qs += "'"+accr[0]+"'";

		for(var i = 1; i < accr.length; i++){
			qs += ", '"+accr[i]+"'";
		}
		qs += ")";
		
		dbObject.find(qs, function(err, response){
				if (err) {
		            res.status(500).jsonp(err)
		        }
		        //console.log("\n\nresponse FOR description is: ", response);
		        //console.log(response[0].Next_question);
		        var result = {};
		        /*for (var i = 0; i < accr.length; i++) {
		        	result[accr[i]] = "";//response[i].DESCRIPTION;
		        }
		        for (var k = 0; i < accr.length; i++) {
		        	for(var j=0; j<accr.length; j++){
		        		console.log("here");
		        		if(response[j].ACRONYM == result[accr[k]]){
		        			console.log("inside if...");
		        			result[accr[k]] = response[j].DESCRIPTION;
		        			console.log("result[accr[",i,"]] = ", result[accr[k]]);
		        			break;
		        		}
		        	}
		        }

		        console.log("final result is: ", result);*/
		        res.send({"msg": "Success", "data":response});
		});

	}
}