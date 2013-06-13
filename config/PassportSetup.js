var	passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy,
	db = require("./DataSource"),
	ObjectID = require('mongodb').ObjectID,	
	crypto = require('crypto');	


// Session user serialize and de-serialize
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	
	db.collection('user', function(err, collection) {

		collection.findOne({

			_id : new ObjectID(id)

		}, function(err, user) {
			
			done(err, user);

		});

	});

});

// Authentication setup
passport.use(new LocalStrategy(function(username, password, done) {
	
	console.log("username: " + username);
	
	db.collection('user', function(err, collection) {
		
		// Return error if error occur
		if (err)
			return done(err); 
		
		// Hash password first
		var shasum  = crypto.createHash('sha1');
		shasum .update(username);
		var hashPasswd = shasum.digest('hex').toString();
		
		// Find specific user with username and password
		collection.findOne({
			
			username : username,
			
			password : hashPasswd
			
		}, function(err, data) {
			
			if (data) {
				
				console.log(data);
				return done(null, data);

			} else {
				
				return done(null, false, { message: 'Incorrect username or password!!' });
			
			}
			
		});		
		
	});
	
}));

console.log("Finish passport setup");

module.exports = passport;