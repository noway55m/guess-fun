/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'), 
	main = require('./routes/main'), 
	user = require('./routes/user'), 
	login = require('./routes/login'),
	http = require('http'), 
	path = require('path'), 
	bootstrap = require('./model/Bootstrap'), 
	passport = require('passport'),
	passport = require('./config/PassportSetup');


/* ---------------------------------------------------------------------------- */

var app = express();

// Session setup for passport authentication.
// Note: including express and passport module, and passport.initialize need to be setup before app.router.
app.use(express.cookieParser());	
app.use(express.session({ secret: 'lcv9ifhwefdsjfowefm213dfjioj' }));
app.use(passport.initialize());
app.use(passport.session());	

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Support html by nodejs module "ejs"
app.engine('html', require('ejs').renderFile);

/* ---------------------------------------------------------------------------- */


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/* ---------------------------------------------------------------------------- */

// Url mapping
app.get('/', routes.index);
app.get('/main', main.index);
app.get('/users', user.list);
app.get('/login', login.index);
app.post('/login/authenticate', passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash: true 
}));
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/* ---------------------------------------------------------------------------- */


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// Bootstrap execution 
bootstrap();
