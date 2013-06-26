var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	LocalStrategy = require('passport-local').Strategy,
	db = require("./DataSource"),
	ObjectID = require('mongodb').ObjectID,
	crypto = require('crypto'),
	logger = require('log4js').getLogger();

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

	logger.info("authentication username: " + username);
	db.collection('user', function(err, collection) {

		// Return error if error occur
		if (err)
			return done(err);

		// Hash password first
		var shasum = crypto.createHash('sha1');
		shasum.update(username);
		var hashPasswd = shasum.digest('hex').toString();

		// Find specific user with username and password
		collection.findOne({

			username : username,

			password : hashPasswd

		}, function(err, data) {

			if (data) {

				logger.info(data);
				return done(null, data);

			} else {

				return done(null, false, {
					message : 'Incorrect username or password!!'
				});

			}

		});

	});

}));

// Passport Ffacebook OAuth configuration
passport.use(new FacebookStrategy({

	clientID : "138521589682299",
	clientSecret : "c95dd1966614afc48129a5405b96dd79",
	callbackURL : "/auth/facebook/callback"

}, function(accessToken, refreshToken, profile, done) {

	logger.info("accessToken: " + accessToken);
	logger.info("refreshToken: " + refreshToken);
	logger.info("profile: " + profile);
	db.collection('user', function(err, collection) {

		collection.findOne({

			fid : profile.id

		}, function(err, user) {

			logger.info(user);
			if (user) {

				logger.info("old user");
				done(err, user);

			} else {

				logger.info("new user");
				collection.insert({

					username : profile.username,
					fid : profile.id,
					access_toke : accessToken,
					role : "user"

				}, function(err, newUser) {

					if (newUser) {

						logger.info('Successfully Insert User ' + data.username);
						done(err, newUser);

					} else {

						logger.info('Failed to create new user ' + profile.username);
						return done(null, false, { message : 'Server error, fail to create new user ' + profile.username });

					}

				});

			}

		});

	});

}));

logger.info("Finish passport setup");

module.exports = passport;