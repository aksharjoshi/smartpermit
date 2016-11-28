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
        inputjob_typeStr = " JOB_TYPE = " + job_type + ", ";

	if(permit_type != "undefined" && permit_type != null && permit_type != "")
        inputpermit_typeStr = " PERMIT_TYPE = " + permit_type;
    
    if(permit_subtype != "undefined" && permit_subtype != null && permit_subtype != "")
        inputpermit_subtypeStr = " PERMIT_SUBTYPE = " + permit_subtype;
    
    console.log("job type: ", job_type, "    " , inputjob_typeStr);
    console.log("permit type: ", permit_type, "    " , inputpermit_typeStr);
    console.log("permit sub type: ", permit_subtype, "    " , inputpermit_subtypeStr)


	var qs = "SELECT ID from PERMIT_MASTER where " + inputjob_typeStr + inputpermit_typeStr;

	if(inputpermit_subtypeStr != "")
		qs += ", " + inputjob_typeStr;

	console.log("query in recommendation.js is: ", qs);

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR recommendation is: ", response);
        res.jsonp(response);
    });
};