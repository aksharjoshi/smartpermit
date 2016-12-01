
/*
 * GET home page.
 */
 var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('USER', 'smart_permit');


exports.index = function(req, res){
	req.session.question_set=[];
	req.session.userid = "";
	res.render('index', { title: "Smart Permits",errMsg: "" });
};

exports.login = function(req, res){
	try {
		var param = req.body;
		console.log(param);
		console.log("test");
		var errMsg = '';
		
		if(param.email == "" || param.email == "undefined"){
			errMsg += 'Email is required.';
			res.render('index', { title: 'Smart Permits',errMsg: errMsg });
		}
		else if(param.password == "" || param.password == "undefined"){
			errMsg += 'Password is required.';
			res.render('index', { title: 'Smart Permits',errMsg: errMsg });
		}
		else{
			//Database Connection - validate customer login credentials and redirect to home page
			var qs = "SELECT EMAIL, PASSWORD, ID FROM USER WHERE EMAIL = '" + param.email + "' and PASSWORD = '" + param.password + "'";

			dbObject.find(qs/*condition, '*' , {}, 0, 0, {}*/, function(err, response){
				if (err) {
		        	//console.log("err", err);
		            //res.status(500).jsonp(err)
		            res.render('index', { title: 'Smart Permits',errMsg: "Invalid username or password!" });
		        }
		        else{
					console.log("\n\n User info is: ", response);
			        //res.jsonp(response);	
			        var session = req.session;
			        //sess.id= 1233;
			        session.userid = response[0].EMAIL; 
			        var date = new Date();

			        var qs = "Update USER SET LAST_LOGIN = '" + date + "', LAST_SESSION_ID = '" + req.session.id + "' WHERE ID = " + response[0].ID;
					
			        dbObject.find(qs, function(err, response){
			        	if(err){
		            		res.render('index', { title: 'Smart Permits',errMsg: "Error in updating user table while logging in" });
			        	}
			        	else{
			        		console.log("User table updated. Response is: ", response);
			        	}
			        });	        	
			    }
			});
			
			/*if(param.email == "admin@sps.com" && param.password == "admin")
				res.redirect('/home');
			else
				res.render('index', { title: 'Smart Permits',errMsg: "Invalid username or password!" });
			*/
			//req.session.id = 1212;
		}
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
};

exports.admin = function(req, res){
	res.render('admin', { title: "Smart Permits - Admin Panel",errMsg: "" });
};

exports.adminLogin = function(req, res){
	try {
		var param = req.body;
		var errMsg = '';
		if(param.inputEmail == "" || param.inputEmail == "undefined"){
			errMsg += 'Email is required.';
			res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
		}
		else if(param.inputPassword == "" || param.inputPassword == "undefined"){
			errMsg += 'Password is required.';
			res.render('index', { title: 'Mobile Sensor Cloud',errMsg: errMsg });
		}
		else{
			//Database Connection - validate admin login credentials and redirect to dashboard page
			 res.redirect('/dashboard');
		}
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
};

exports.logout = function(req, res){
	if(req.session.userid != ""){
		req.session.userid = "";
		console.log("Session destroyed");
		req.session.question_set=[];
		res.render('index', { title: "Smart Permits",errMsg: "" });
	}
	else{
		res.render('index', { title: "Smart Permits",errMsg: "Already logged out" });
	}
};

exports.checkLogin = function(req, res){
	if(req.session.userid != ""){
		return true;
	}
	else
		res.render('index', { title: "Smart Permits",errMsg: "Already logged out" });
};