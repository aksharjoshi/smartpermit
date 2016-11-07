'use strict'; 

/**
 * DAL dependencies.
 */
var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('permit_history', 'smart_permit');

exports.seasonalAnalysis = function(req, res){
	var condition = {};
	
    if(req.query){
        condition = req.query;
    };

    var inputYear = req.query.year;
    if(inputYear != "undefined" && inputYear != null && inputYear != "")
        var inputYearStr = " AND Year(`FILING DATE`)=" + inputYear;
    else
        var inputYearStr = "";

    var qs = "SELECT "+
                    " Year(`FILING DATE`) AS Year,"+
                    " QUARTER(`FILING DATE`) As Quarter,"+
                    " `PERMIT TYPE` As Permit_Type,"+
                    " P.FULLFORM As Permit_Desc,"+
                    " COUNT(*) As Count "+
                " FROM `permit_history`,`permit_accronym` As P "+
                " WHERE `PERMIT TYPE` = P.ACCRONYM "+inputYearStr+
                " GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`PERMIT TYPE`";
	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
		if (err) {
        	//console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR seasonalAnalysis is: ", response);
        res.jsonp(response);
	});
};

exports.expirartionAnalysis = function(req, res){
    var condition = {};
    
    if(req.query){
        condition = req.query;
    };

    var inputYear = req.query.year;

    var qs = "SELECT Year(`EXPIRATION DATE`) AS Year, QUARTER(`EXPIRATION DATE`) As Quarter,`PERMIT TYPE` As Permit_Type, P.FULLFORM As Permit_Desc, COUNT(*) As Count FROM `permit_history`,`permit_accronym` As P WHERE Year(`EXPIRATION DATE`)=" + inputYear + " AND `RESIDETIAL` = 'YES' AND `PERMIT TYPE` = P.ACCRONYM GROUP BY Year(`EXPIRATION DATE`),QUARTER(`EXPIRATION DATE`),`PERMIT TYPE`";

    dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR seasonalAnalysis is: ", response);
        res.jsonp(response);
    });
};


exports.heatMap = function(req, res){
    var condition = {};
    
    if(req.query){
        condition = req.query;
    };

    var inputYear = req.query.year;

   // var qs = "SELECT Year(`FILING DATE`) As Year, QUARTER(`FILING DATE`) As Quarter,`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`,COUNT(*) FROM `permit_history` WHERE Year(`FILING DATE`)="+ inputYear + " AND `RESIDETIAL` = 'YES' GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`";
    var qs = "SELECT `BOROUGH`,`ZIP CODE` As zipcode,`PERMIT TYPE` As Permit_Type,P.FULLFORM As Permit_Desc, COUNT(*) as permit_count FROM `permit_history`, `permit_accronym` As P  WHERE `RESIDETIAL` = 'YES' "
    +" AND `ZIP CODE` != '' AND `ZIP CODE` != 0 AND `PERMIT TYPE` = P.ACCRONYM GROUP BY `BOROUGH`,`ZIP CODE`,`PERMIT TYPE` LIMIT 400";
    dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR seasonalAnalysis is: ", response);
        res.jsonp(response);
    });
};

exports.popularPermit = function(req, res){
    var condition = {};
    
    if(req.query){
        condition = req.query;
    };

    var inputYear = req.query.year;

   // var qs = "SELECT Year(`FILING DATE`) As Year, QUARTER(`FILING DATE`) As Quarter,`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`,COUNT(*) FROM `permit_history` WHERE Year(`FILING DATE`)="+ inputYear + " AND `RESIDETIAL` = 'YES' GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`";
    var qs = "SELECT `PERMIT TYPE` As Permit_Type, QUARTER(`FILING DATE`) As Quarter, P.FULLFORM As Permit_Desc, COUNT(*) as permit_count FROM `permit_history`, `permit_accronym` As P WHERE `RESIDETIAL` = 'YES' "
    +"  AND `PERMIT TYPE` = P.ACCRONYM AND Year(`FILING DATE`)=" + inputYear + "GROUP BY `PERMIT TYPE`, QUARTER(`FILING DATE`) ";
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