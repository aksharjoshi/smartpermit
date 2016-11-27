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
		
		var userdata = {
			FIRST_NAME: req.body.txtFirstName,
			LAST_NAME: req.body.txtLastName,
			EMAIL: req.body.txtEmail,
			PASSWORD: req.body.txtPassword,
			ADDRESS1: req.body.txtAddress1,
			ADDRESS2: req.body.txtAddress2,
			STATE: req.body.txtState,
			ZIPCODE: req.body.txtZipcode,
			LASTLOGIN: new Date(),
			LAST_SESSION_ID: 123,
		}

		console.log("new user data: ", userdata);

		//console.log("db object: ", (dbObject2));

		dbObject.create(userdata, function(err, response){
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
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
};
