'use strict'; 

var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PERMIT_MASTER', 'smart_permit');

var http = require('http');

exports.getRecommendation = function(req, res){

	console.log("req body is: ", JSON.stringify(req.body));

	var job_type = req.query.job_type;
	var permit_type = req.query.permit_type;
	var permit_subtype = req.query.permit_subtype;

	var inputjob_typeStr = "";
	var inputpermit_typeStr = "";
	var inputpermit_subtypeStr = "";

	if(job_type != "undefined" && job_type != null && job_type != "")
        inputjob_typeStr = " JOB_TYPE = '" + job_type + "' AND";

	if(permit_type != "undefined" && permit_type != null && permit_type != "")
        inputpermit_typeStr = " PERMIT_TYPE = '" + permit_type + "'";
    
    if(permit_subtype != "undefined" && permit_subtype != null && permit_subtype != "")
        inputpermit_subtypeStr = " PERMIT_SUBTYPE = '" + permit_subtype + "'";
    
    console.log("job type: ", job_type, "    " , inputjob_typeStr);
    console.log("permit type: ", permit_type, "    " , inputpermit_typeStr);
    console.log("permit sub type: ", permit_subtype, "    " , inputpermit_subtypeStr)


	var qs = "SELECT ID from PERMIT_MASTER where " + inputjob_typeStr + inputpermit_typeStr;

	if(inputpermit_subtypeStr != "")
		qs += " AND " + inputjob_typeStr;

	console.log("query in recommendation.js is: ", qs);

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR recommendation is: ", response);

        /*var options = {
  		  host: 'localhost',
		  port: '8181',
		  path: '/recommend?permitId=' + response[0].ID + ' count=5',
		  method: 'GET'
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded',
		    'Content-Length': post_data.length
		  }
		};

		var req = http.request(options, function(res) {
  			// response is here
  			console.log("response from java: ", res);
		});*/

        res.jsonp(response);
    });
};

exports.getJobType = function(req, res){
	var qs = "SELECT DISTINCT(JOB_TYPE) FROM PERMIT_MASTER";

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        else{
	        res.jsonp(response);
        }
    });
};


exports.getPermitType = function(req, res){
	var qs = "SELECT DISTINCT(PERMIT_TYPE) FROM PERMIT_MASTER";

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        else{
	        res.jsonp(response);
        }
    });
};


exports.getPermitSubType = function(req, res){
	var qs = "SELECT DISTINCT(PERMIT_SUBTYPE) FROM PERMIT_MASTER";

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        else{
	        res.jsonp(response);
        }
    });
};