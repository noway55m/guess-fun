var	logger = require('log4js').getLogger();

/*
 * GET main page
 */
exports.index = function(req, res) {

	logger.info(req.user);
	if (req.user) {

		logger.info(req.user);

		res.render('main.html', { user : req.user } );

	} else {

		res.redirect('/');

	}

};



function getProfile(){

}

function getFriendList(){

}
