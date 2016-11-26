/*
 * GET home page.
*/
var dal = require('./dbUtility/dalMySql.js');

var dbObject = new dal('USER', 'smart_permit');


exports.load = function(req, res){	
	res.render('register', { title: 'Smart Permits - Register'});	
};

exports.register = function(req, res){
	try {
		var param = req.body;
		console.log(param);
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
			//Database Connection - validate customer login credentials and redirect to home page
			dbObject.create(param, function(err, response){
				if(err){
					res.send({"errMsg":err});
				}
				else{
					console.log("response from sign up is: ", JSON.stringify(response));
					res.redirect('/home');
				}
			});
//			res.redirect('/home');
		}
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
};
