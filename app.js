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
	log4js = require('log4js'),
	bootstrap = require('./config/Bootstrap'),
	passport = require('./config/PassportSetup'),
	db = require("./config/DataSource");


/* ---------------------------------------------------------------------------- */

var app = express();

// Session setup for passport authentication.
// Note: including express and passport module, and passport.initialize need to be setup before app.router.
app.use(express.cookieParser());
app.use(express.session({ secret: 'lcv9ifhwefdsjfowefm213dfjioj' }));
app.use(passport.initialize());
app.use(passport.session());

// All environments
app.set('port', process.env.PORT || 80);
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


// Development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/* ---------------------------------------------------------------------------- */

// URL mapping
app.get('/', routes.index);
app.get('/main', main.index);
app.get('/users', user.list);
app.get('/login', login.index);
app.post('/login/authenticate', login.authenticate);
app.get('/logout', login.logout);

// Facebook OAuth Authentication
app.get('/auth/facebook',passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }) );

// Facebook OAuth Code Callback (first handshake)
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/main', failureRedirect: '/' }) );

/* ---------------------------------------------------------------------------- */

// Log4js setup
log4js.replaceConsole();
log4js.setGlobalLogLevel("info"); // Both of lowercase or uppercase are okay.

/* ---------------------------------------------------------------------------- */

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// Bootstrap execution
bootstrap();
