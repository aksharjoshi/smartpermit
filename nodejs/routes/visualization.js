'use strict'; 

/**
 * DAL dependencies.
 */
var dal = require('../dbUtility/dalMySql.js');

var dbObject = new dal('permit_history', 'GEM_PRECARE_SYS_DS');

exports.seasonalAnalysis = function(req, res){
	var condition = {};
	
    if(req.query){
        condition = req.query;
    };

    var qs = "SELECT Year(`FILING DATE`), QUARTER(`FILING DATE`),`PERMIT TYPE`,COUNT(*) FROM `permit_history` WHERE Year(`FILING DATE`)>=2012 GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`PERMIT TYPE`";

	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
		if (err) {
        	//console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR seasonalAnalysis is: ", response);
        res.jsonp(response);
	});
};


//SELECT Year(`FILING DATE`), QUARTER(`FILING DATE`),`PERMIT TYPE`,COUNT(*) FROM `permit_history` WHERE Year(`FILING DATE`)>=2012 GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`PERMIT TYPE`;