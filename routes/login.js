var passport = require('passport'),
	OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/*
 * GET user login  page
 */
exports.index = function(req, res){
	res.render('login.html');
};

/*
 * POST username and password authenticate action
 */
exports.authenticate = passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash: true
});

/*
 * GET user logout action
 */
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};
