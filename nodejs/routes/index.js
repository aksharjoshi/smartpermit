
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: "Smart Permits",errMsg: "" });
};

exports.login = function(req, res){
	try {
		var param = req.body;
		console.log(param);
		console.log("test");
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