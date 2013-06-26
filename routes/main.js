var	logger = require('log4js').getLogger();

/*
 * GET main page
 */
exports.index = function(req, res) {

	logger.info(req.user);
	if (req.user) {

		res.render('main.html');

	} else {

		res.redirect('/');

	}

};
