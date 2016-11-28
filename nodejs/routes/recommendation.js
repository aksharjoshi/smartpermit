var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PERMIT_MASTER', 'smart_permit');

var http = require('http');

exports.getRecommendation = function(req, res){
	var job_type = req.body.job_type;
	var permit_type = req.body.permit_type;
	var permit_subtype = req.body.permit_subtype;

	if(job_type != "undefined" && job_type != null && job_type != "")
        var inputjob_typeStr = " JOB_TYPE = " + job_type + ", ";
    else
        var inputjob_typeStr = "";

	if(permit_type != "undefined" && permit_type != null && permit_type != "")
        var inputpermit_typeStr = " PERMIT_TYPE = " + permit_type;
    else
        var inputpermit_typeStr = "";    

    if(permit_subtype != "undefined" && permit_subtype != null && permit_subtype != "")
        var inputpermit_subtypeStr = " PERMIT_SUBTYPE = " + permit_subtype;
    else
        var inputpermit_subtypeStr = ""; 

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