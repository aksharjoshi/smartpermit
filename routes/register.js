/*
 * GET home page.
*/
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
			 res.redirect('/home');
		}
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
};
