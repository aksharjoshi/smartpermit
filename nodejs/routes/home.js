/*
 * GET home page.
*/
exports.load = function(req, res){
	res.render('home', { title: 'Home'});
};

exports.dashboard = function(req, res){
	res.render('dashboard', { title: 'Home'});
};
