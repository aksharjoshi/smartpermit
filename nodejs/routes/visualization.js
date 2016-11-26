'use strict'; 

/**
 * DAL dependencies.
 */
var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('PERMIT_DETAILS', 'smart_permit');

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
                    " Year(`FILING_DATE`) AS Year,"+
                    " QUARTER(`FILING_DATE`) As Quarter,"+
                    " `PERMIT_TYPE` As PERMIT_TYPE,"+
                    " P.FULLFORM As PERMIT DESCRIPTION,"+
                    " COUNT(*) As Count "+
                " FROM `PERMIT_DETAILS`,`permit_accronym` As P "+
                " WHERE `PERMIT_TYPE` = P.ACCRONYM "+inputYearStr+
                " GROUP BY Year(`FILING_DATE`),QUARTER(`FILING_DATE`),`PERMIT TYPE`";
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

    var qs = "SELECT Year(`EXPIRATION_DATE`) AS Year, QUARTER(`EXPIRATION_DATE`) As Quarter,`PERMIT_TYPE` As PERMIT_TYPE, P.FULLFORM As PERMIT_DESCRIPTION, COUNT(*) As Count FROM `PERMIT_DETAILS`,`permit_accronym` As P WHERE Year(`EXPIRATION_DATE`)=" + inputYear + " AND `PERMIT_TYPE` = P.ACCRONYM GROUP BY Year(`EXPIRATION_DATE`),QUARTER(`EXPIRATION_DATE`),`PERMIT_TYPE`";

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
    var qs = "SELECT `BOROUGH`,`ZIP_CODE` As ZIPCODE,`PERMIT_TYPE` As PERMIT_TYPE,Year(`FILING_DATE`) AS Year,P.FULLFORM As PERMIT_DESCRIPTION, COUNT(*) as permit_count FROM `PERMIT_DETAILS`, `permit_accronym` As P  WHERE `ZIP CODE` != '' AND `ZIP CODE` != 0 AND `PERMIT_TYPE` = P.ACCRONYM AND Year(`FILING_DATE`)="+inputYear+" GROUP BY `HOUSE_BOROUGH`,`ZIP CODE`,`PERMIT_TYPE`,Year(`FILING_DATE`)";
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
    var qs = "SELECT Year(`FILING_DATE`) AS Year,"+
                " `PERMIT_TYPE` As PERMIT_TYPE,"+
                " QUARTER(`FILING_DATE`) As QUARTER,"+
                " P.FULLFORM As PERMIT_DESCRIPTION,"+
                " COUNT(*) as permit_count "+
                " FROM `PERMIT_DETAILS`, `permit_accronym` As P"+
                " WHERE `RESIDETIAL` = 'YES' "+
                " AND Year(`FILING_DATE`)="+inputYear+
                " AND `PERMIT_TYPE` = P.ACCRONYM"+
                " GROUP BY `PERMIT_TYPE`, QUARTER(`FILING_DATE`) ";
    dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
        if (err) {
            //console.log("err", err);
            res.status(500).jsonp(err)
        }
        console.log("\n\nresponse FOR seasonalAnalysis is: ", response);
        res.jsonp(response);
    });
};

exports.mapsData = function(req, res){
    var condition = {};
    
    if(req.query){
        condition = req.query;
    };

    var inputYear = req.query.year;

   // var qs = "SELECT Year(`FILING DATE`) As Year, QUARTER(`FILING DATE`) As Quarter,`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`,COUNT(*) FROM `permit_history` WHERE Year(`FILING DATE`)="+ inputYear + " AND `RESIDETIAL` = 'YES' GROUP BY Year(`FILING DATE`),QUARTER(`FILING DATE`),`BOROUGH`,`ZIP CODE`,`PERMIT TYPE`";
    var qs = "SELECT `HOUSE_BOROUGH`,`HOUSE_ZIP` As ZIPCODE, COUNT(*) as PERMIT_COUNT, zip_codes_states.latitude, zip_codes_states.longitude FROM `PERMIT_DETAILS` "
    +" LEFT JOIN zip_codes_states ON zip_codes_states.zip_code = `permit_history`.`HOUSE_ZIP`"
    +" GROUP BY `HOUSE_BOROUGH`,`HOUSE_ZIP`";
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