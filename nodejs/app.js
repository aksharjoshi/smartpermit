
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , home = require('./routes/home')
  , register = require('./routes/register')
  , mongodb = require('mongodb')
  , http = require('http')
  , path = require('path')
  , visualization = require('./routes/visualization');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.login);
app.get('/admin', routes.admin);
app.post('/admin', routes.adminLogin);
app.get('/register', register.load);
app.post('/register', register.register);
app.get('/home', home.load);
app.get('/dashboard', home.dashboard);

app.get('/seasonalAnalysis', visualization.seasonalAnalysis);
app.get('/expirartionAnalysis', visualization.expirartionAnalysis);
app.get('/heatMap', visualization.heatMap);
app.get('/popularPermit', visualization.heatMap);


app.del('/api/session',function(req,res){
	if(req.session.data){
		req.session.destroy();
		res.send(JSON.stringify({"response" : "Session Destroyed"}));
	}else{
		res.send(JSON.stringify({"response" : "No Session Data to DELETE"}));
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
