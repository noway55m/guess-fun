(function($){

	// Makes sure the dataTransfer information is sent when we
	// Drop the item in the drop box.
	$.event.props.push('dataTransfer');

	// Avoid console execption on IE browser
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		console.log = function() {
		};
	}

	// Declare imagesDraggedArea class
	$.fn.imagesDraggedArea = function(options) {

		/* jshint multistr: true */
		var defaultHtml = '<div class="drop-files" ondragover="return false"> Drop Images Here </div> \
			<div id="uploaded-holder"> \
			<div id="dropped-files"> \
				<div id="upload-button"> \
					<a href="#" class="upload">Use</a> \
					<a href="#" class="delete">Remove</a> \
					<span>0 Files</span> \
				</div> \
			</div> \
			<div id="extra-files"> \
				<div class="number"> 0 </div> \
				<div id="file-list"> \
					<ul></ul> \
				</div> \
			</div> \
		</div> \
		<div id="loading"> \
			<div id="loading-bar"> \
				<div class="loading-color"></div> \
			</div> \
			<div id="loading-content">Uploading file.jpg</div> \
		</div> \
		<div id="file-name-holder"> \
			<ul id="uploaded-files"> \
				<h1>Uploaded Files</h1> \
			</ul>\
		</div>';

		return this.each(function() {

			$(this).html(defaultHtml);


			var settings = {},
				z = -40,
				maxFiles = 5, // The number of images to display
				errMessage = 0,
				dataArray = []; // Data array for put all of the data URIs

			// Overide the defaultOptions from options argument
			this.settings = $.extend(settings, options);

			// Set event control on dropped zone.
			var dropzone = $('.drop-files');
			dropzone.on('dragenter', function() {
				$(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '4px dashed #bb2b2b'});
				return false;
			});
			dropzone.on('drop', function() {
				$(this).css({'box-shadow' : 'none', 'border' : '4px dashed rgba(0,0,0,0.2)'});
				return false;
			});
			dropzone.on('drop', function(e) {

				// Stop the default action, which is to redirect the page
				// To the dropped file
				var files = e.dataTransfer.files;

				// Showing effect of uploaded-holder
				$('#uploaded-holder').css({
					display: "inline-block",
					width: 0,
					height: 0,
					opacity: 0
				});
				$('#uploaded-holder').animate({
					width: 300,
					height: 200,
					opacity: 100
				}, 350);

				// For each file
				$.each(files, function(index, file) {

					// Some error messaging
					if (!files[index].type.match('image.*')) {

						if(errMessage === 0) {
							$('#drop-files').html('Hey! Images only');
							++errMessage;
						}
						else if(errMessage === 1) {
							$('#drop-files').html('Stop it! Images only!');
							++errMessage;
						}
						else if(errMessage === 2) {
							$('#drop-files').html("Can't you read?! Images only!");
							++errMessage;
						}
						else if(errMessage === 3) {
							$('#drop-files').html("Fine! Keep dropping non-images.");
							errMessage = 0;
						}
						return false;
					}

					// Check length of the total image elements
					if($('#dropped-files > .image').length < maxFiles) {
						// Change position of the upload button so it is centered
						var imageWidths = ((220 + (40 * $('#dropped-files > .image').length)) / 2) - 20;
						$('#upload-button').css({'left' : imageWidths+'px', 'display' : 'block'});
					}


					// Start a new instance of FileReader
					var fileReader = new FileReader();

					// When the filereader loads initiate a function
					fileReader.onload = (function(file) {

						return function(e) {

							// Push the data URI into an array
							dataArray.push({name : file.name, value : this.result});

							// Move each image 40 more pixels across
							z = z+40;
							var image = this.result;


							// Just some grammatical adjustments
							if(dataArray.length == 1) {
								$('#upload-button span').html("1 file to be uploaded");
							} else {
								$('#upload-button span').html(dataArray.length+" files to be uploaded");
							}
							// Place extra files in a list
							if($('#dropped-files > .image').length < maxFiles) {
								// Place the image inside the dropzone
								$('#dropped-files').append('<div class="image" style="left: '+z+'px; background: url('+image+'); background-size: cover;"> </div>');
							}
							else {

								$('#extra-files .number').html('+'+($('#file-list li').length + 1));
								// Show the extra files dialogue
								$('#extra-files').show();

								// Start adding the file name to the file list
								$('#extra-files #file-list ul').append('<li>'+file.name+'</li>');

							}
						};

					})(files[index]);

					// For data URI purposes
					fileReader.readAsDataURL(file);

				});


			});

			function restartFiles() {

				// This is to set the loading bar back to its default
				// state
				$('#loading-bar .loading-color').css({
					'width' : '0%'
				});
				$('#loading').css({
					'display' : 'none'
				});
				$('#loading-content').html(' ');
				// --------------------------------------------------------

				// We need to remove all the images and li elements as
				// appropriate. We'll also make the upload button
				// disappear

				$('#upload-button').hide();
				$('#dropped-files > .image').remove();
				$('#extra-files #file-list li').remove();
				$('#extra-files').hide();
				$('#uploaded-holder').hide();

				// And finally, empty the array/set z to -40
				dataArray.length = 0;
				z = -40;

				return false;
			}

			$('#upload-button .delete').click(restartFiles);


			$('#upload-button .upload').click(function() {

				$('#loading-content').html('Uploading '+ dataArray[0].name);
				$.each(dataArray, function(index, file) {

					var img = new Image();
					img.src = dataArray[index].value;
					$(img).appendTo("#uploadedImageZone");

//					var img = new Image();
//					img.src = dataArray[index].value;
//
//					$(img).imageDisplay({
//
//						defaultEffect : "moving",
//
//						appendArea : "#chooseEffect",
//
//						duration: 5000,
//
//						widthUnit: 100,
//
//						heightUnit: 100
//
//					});

				});

				return false;
			});

			// For the file list
			$('#extra-files .number').toggle(function() {
				$('#file-list').show();
			}, function() {
				$('#file-list').hide();
			});

			// Append the localstorage the the uploaded files section
			if(window.localStorage.length > 0) {
				$('#uploaded-files').fadeIn();
				for (var t = 0; t < window.localStorage.length; t++) {
					var key = window.localStorage.key(t);
					var value = window.localStorage[key];
					// Append the list items
					if(value !== undefined || value !== '') {
						$('#uploaded-files').append(value);
					}
				}
			} else {
				$('#uploaded-files').fadeOut();
			}

		});


	};

}($));
