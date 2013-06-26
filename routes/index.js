var	logger = require('log4js').getLogger();

/*
 * GET index page
 */
exports.index = function(req, res) {

	logger.info(req.user);
	if (req.user) {

		res.redirect('/main');

	} else {

		res.render('index.html');

	}

};