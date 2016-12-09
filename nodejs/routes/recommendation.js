'use strict'; 

var dal = require('./dbUtility/dalMySql.js');
var dbObject = new dal('PERMIT_MASTER', 'smart_permit');
var http = require('http');
var index = require('./index.js');


exports.getRecommendation = function(req, res){

  if(req.session.userid != ""){

  	//console.log("req body is: ", JSON.stringify(req.body));

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
  		qs += " AND " + inputpermit_subtypeStr;

  	console.log("query in recommendation.js is: ", qs);

  	dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
          if (err) {
              //console.log("err", err);
              res.status(500).jsonp(err)
          }
          console.log("\n\nresponse FOR recommendation is: ", response);

          var options = {
            host: 'localhost',
            port: 8181,
            path: '/recommend?permitId='+response[0].ID+'&count=5',
            method: 'GET'
          };

          var responseJava = "";

          try{
            http.request(options, function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('error', function(err){
              console.log("Error on calling engine. ", err);
            });
            response.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              responseJava = chunk;
              res.send({"msg":"hello"});
            });
            }).end();
          }
          catch(e){
            console.log("Something wrong with recommendation engine. Following is the details: ");
            console.log(e);
          }
      });
  }
};

exports.getRecommendationMultiple = function(req, res){

  var querystring = require('querystring');

  console.log("in post reco");

  /*console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& RECO &&&&&&&&&&&&&&&&&&&&&&&&&");
  console.log("Session is: ", req.session);
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& RECO &&&&&&&&&&&&&&&&&&&&&&&&&");
*/
  if(req.session.userid != "")
  {
    //console.log("in if of post reco")
    //console.log("req body is: ", JSON.stringify(req.body));

    var temp = req.body.permits;
    var value_list = []

    for(var key_main in temp)
    {
      for(var key_child in temp[key_main])
      {
        //console.log("============================");
        //console.log(temp[key_main][key_child]);
        value_list.push(temp[key_main][key_child]);
        //console.log("============================");
      }
    }

    console.log("value_list : " + JSON.stringify(value_list));


    var data = querystring.stringify({
      body: value_list
//      password: yourPasswordValue
    });

    console.log("value_list is: ", value_list);
    var options = {
            host: 'localhost',
            port: 8181,
            path: '/recommend',
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
            //body: JSON.stringify(value_list)
          };

          var responseJava = "";

          var reqJava = http.request(options, function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              responseJava += chunk;
            });
          });
          console.log("response java is : ", responseJava);
          reqJava.write(JSON.stringify(value_list));
          reqJava.end();
          res.send("data" : JSON.sreingify(responseJava);
  }
};

exports.getJobType = function(req, res){

  if(req.session.userid != ""){

  	var qs = "SELECT DESCRIPTION, ACRONYM FROM ACRONYM_MASTER WHERE ACRONYM IN ( SELECT DISTINCT(JOB_TYPE) FROM PERMIT_MASTER)";

    console.log("session is: ", req.session);
  	dbObject.find(qs, function(err, response){
          if (err) {
              res.status(500).jsonp(err)
          }
          else{
  	        res.jsonp(response);
          }
      });
  }
};


exports.getPermitType = function(req, res){

  if(req.session.userid != ""){
    var job_type = req.query.job_type;

  	var qs = "SELECT DESCRIPTION, ACRONYM FROM ACRONYM_MASTER WHERE ACRONYM IN (SELECT DISTINCT(PERMIT_TYPE) FROM PERMIT_MASTER WHERE JOB_TYPE='"+job_type+"')";

  	dbObject.find(qs, function(err, response){
          if (err) {
              res.status(500).jsonp(err)
          }
          else{
  	        res.jsonp(response);
          }
      });
  }
};

exports.getPermitSubType = function(req, res){

  if(req.session.userid != ""){

    var job_type = req.query.job_type;
    var permit_type = req.query.permit_type;

  	var qs = "SELECT DESCRIPTION, ACRONYM FROM ACRONYM_MASTER WHERE ACRONYM IN (SELECT DISTINCT(PERMIT_SUBTYPE) FROM PERMIT_MASTER WHERE JOB_TYPE = '"+job_type+"' AND PERMIT_TYPE = '" + permit_type + "')";

  	dbObject.find(qs, function(err, response){
          if (err) {
              res.status(500).jsonp(err)
          }
          else{
  	        res.jsonp(response);
          }
      });
  }
};