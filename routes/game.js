var logger = require('log4js').getLogger(),
	mongodb = require('mongodb'),
	db = require("../config/DataSource"),
	ObjectID = mongodb.ObjectID,
	fs = require('fs'),
	path = require('path'),
	uuid = require('uuid'),
	crypto = require('crypto'),
	https = require('https');

/*
 * POST interface - create new game for specific user
 */
exports.create = function(req, res) {

	logger.info("Interface game create");
	logger.info("form data:");
	logger.info(req.body);
	logger.info("files:");
	logger.info(req.files);
	if (req.user) {

		var tempPath = req.files.files[0].path,
			name =  req.files.files[0].name;

		console.log(path.extname(name).toLowerCase());

		if (path.extname(name).toLowerCase() === '.png' ||
				path.extname(name).toLowerCase() === '.jpg' ||
				path.extname(name).toLowerCase() === '.gif') {

			// Hash the image as file name
			var md5sum = crypto.createHash('md5'),
				stream = fs.ReadStream(tempPath);
				stream.on('data', function(d) {
					md5sum.update(d);
				});

			stream.on('end', function() {
				var fileName = md5sum.digest('hex'),
					extension = (path.extname(name).toLowerCase() === '.png' ? ".png" : null) ||
								(path.extname(name).toLowerCase() === '.jpg' ? ".jpg" : null) ||
								(path.extname(name).toLowerCase() === '.gif' ? ".gif" : null),
					targetPath = path.resolve('./public/uploadedImages/' + fileName + extension);

				logger.info("temp path: " + tempPath);
				logger.info("target path: " + targetPath);

				fs.rename(tempPath, targetPath, function(err) {
					if (err)
						throw err;
					logger.info("Image Upload completed: " + targetPath);

					var formData = req.body;
					db.collection('game', function(err, collection) {

						if(err)
							return;

						// Create new game on database
						collection.insert({

							from : req.user.fid,
							to : formData.to,
							img : fileName + extension,
							qes: formData.qes,
							answer: formData.answer,
							hints: formData.hints,
							effect: formData.effect,
							time: parseInt(formData.time),
							is_reply: false,
							// nodejs ObjectId contain the timestamp info, so we don't have to save this for ourself.

						}, function(err, data) {

							if (data) {

								logger.info('Successfully Create Game ' + data.id);

								sendFbInvite();

								// Start to send app requst
								res.json(200, {
									msg : 'Incorrect data params!',
									data : data
								});

							} else {

								logger.info('Failed to Create');
								res.json(400, {
									msg : 'Internal server error(db)!'
								});

							}// end if

						});

					});

				});


			});

		} else {

			fs.unlink(tempPath, function() {
				if (err)
					throw err;
				console.error("Image Only - png, jpg and gif files are allowed!");
			});
			res.json(400, {
				msg : 'Image Only - png, jpg and gif files are allowed!'
			});

		}

	} else {

		res.redirect('/');

	}

};

/*
 * GET interface - get game list of specific user
 */
exports.list = function(req, res) {

	if (req.user) {

		db.collection('game', function(err, collection) {

			// Return error if error occur
			if (err)
				res.json(500, { msg : 'Server database error' });

			// Find specific user with username and password
			collection.find({
				$or: [
				      {
						"from" : req.user.fid,
						"is_reply": false
				      },
				      {
						"to" : req.user.fid,
						"is_reply": false
				      }
				]
			}).toArray(function(err, games) {

				logger.info(games);
				// Server error
				if (err){

					res.json(500, { msg : 'Server database error' });

				} else {

					res.json(200, games);

				}

			});

		});

	} else {

		logger.info(req);

		res.redirect('/');

	}

};

/*
 * Get interface - response image from specific path
 */
exports.getImg = function(req, res){

	if (req.user) {

		if(req.params && req.params.name) {

			var targetPath = path.resolve('./public/uploadedImages/' + req.params.name);
			logger.info("targetPath: " + targetPath);
            fs.stat(targetPath, function (err, stat) {

            	if(err)
        			res.json(400, { msg : "Incorrect path, file not found" });

            	var img = fs.readFileSync(targetPath);
                res.contentType = 'image/png';
                res.contentLength = stat.size;
                res.end(img, 'binary');
            });


		}else{

			res.json(400, { msg : "Incorrect parameters" });

		}

	}else{

		res.json(403, { msg : "You don't have permission to access, please login first" });

	}

};

/*
 * Get interface - response image from specific url
 */
function sendFbInvite(){

	var req = https.request({

		'method': 'POST',
		'host': 'https://graph.facebook.com',
		'port': 443,
		'path': "/1388752491/notifications",
		"template" : "dlsjfklsjfsldfjsldf"
	}, function (res) {

		console.log("-------------------------")

		console.log(res)

//		var data = '';
//		res.setEncoding('utf8');
//		res.on('data', function (chunk) {
//			data += chunk;
//		});
//		res.on('end', function () {
//			var result;
//			try {
//				result = JSON.parse(data);
//			} catch (err) {
//				return callback(res.statusCode !== 200, data || null);
//			}
//
//			if (result['error'] || result['error_code']) {
//				callback(result, null);
//			} else {
//				callback(null, result);
//			}
//		});
	});
	req.on('error', function (err) {

		console.log("-------------------------")

		console.log(err)
	});


}
