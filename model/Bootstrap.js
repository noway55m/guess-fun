var db = require("../config/DataSource"),
	crypto = require('crypto');

module.exports = function() {
	
	/* open db */
	db.open(function() {

		/* Select 'contact' collection */
		db.collection('user', function(err, collection) {
			
			// Find default user
			collection.findOne({
				username : 'frank'
			}, function(err, data) {
				
				/* Found this People */
				if (data) {
					console.log('Default user exist Name: ' + data.username);					
				} else {
					
					/* Insert default frank user */
					var shasum  = crypto.createHash('sha1');
					shasum .update("frank");
					collection.insert({
						username : 'frank',
						password : shasum.digest('hex'),
						role : 1
					}, function(err, data) {
						if (data) {
							console.log('Successfully Insert User ' + data.username);
							
							/* Insert default admin */
							var shasum2  = crypto.createHash('sha1');
							shasum2.update("admin");
							collection.insert({
								username : 'admin',
								password : shasum2.digest('hex'),
								role : 1
							}, function(err, data) {
								if (data) {
									console.log('Successfully Insert User ' + data.username);
								} else {
									console.log('Failed to Insert');
								}
							});									
							
							
						} else {
							console.log('Failed to Insert');
						}
					});
					
				}
				
				
			});
			
			
		});
	});

};