(function($){

	// Makes sure the dataTransfer information is sent when we
	// Drop the item in the drop box.
	$.event.props.push('dataTransfer');

  	// Avoid console execption on IE browser
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		console.log = function () { };
	}

	// Declare imagesDraggedArea class
	$.fn.imagesDraggedArea = function(options) {

		return this.each(function() {

			$(this).html('<div class="drop-files" ondragover="return false"> Drop Images Here </div> \
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
			</div>');


			var settings = {},
				z = -40,
				maxFiles = 5, // The number of images to display
				errMessage = 0,
				dataArray = []; // Data array for put all of the data URIs

			// Overide the defaultOptions from options argument
			$.extend(settings, {});
			this.settings = settings;

			// Bind the drop event to the dropzone.
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

						if(errMessage == 0) {
							$('#drop-files').html('Hey! Images only');
							++errMessage;
						}
						else if(errMessage == 1) {
							$('#drop-files').html('Stop it! Images only!');
							++errMessage;
						}
						else if(errMessage == 2) {
							$('#drop-files').html("Can't you read?! Images only!");
							++errMessage;
						}
						else if(errMessage == 3) {
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

					// This is to set the loading bar back to its default state
					$('#loading-bar .loading-color').css({'width' : '0%'});
					$('#loading').css({'display' : 'none'});
					$('#loading-content').html(' ');
					// --------------------------------------------------------

					// We need to remove all the images and li elements as
					// appropriate. We'll also make the upload button disappear

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

				//$("#loading").show();
				var totalPercent = 100 / dataArray.length;
				var x = 0;
				var y = 0;

				$('#loading-content').html('Uploading '+dataArray[0].name);

				$.each(dataArray, function(index, file) {

					var img = new Image(); // get the image element
					img.src = dataArray[index].value;					
					imageDisplayEffect(img);

					// append original image
					
					
//					console.log(img.width)
//					console.log(img.height)
//					var div1 = document.createElement('div');
//					var div2 = document.createElement('div');
//					var div3 = document.createElement('div');
//					div1.style.width = "100px";
//					div1.style.height = "100px";					
//					div1.style.display = "inline-block";										
//					div1.style.backgroundImage = "url(" + img.src + ")";
//					div1.style.backgroundPosition = "0px 0px";
//					div2.style.width = "100px";
//					div2.style.height = "100px";
//					div2.style.display = "inline-block";															
//					div2.style.backgroundImage = "url(" + img.src + ")";
//					div2.style.backgroundPosition = "-100px 0px";
//					div3.style.width = "100px";
//					div3.style.height = "100px";
//					div3.style.display = "inline-block";															
//					div3.style.backgroundImage = "url(" + img.src + ")";
//					div3.style.backgroundPosition = "-200px 0px";										
//					$('#chooseEffect').append(div1)
//					$('#chooseEffect').append(div2)
//					$('#chooseEffect').append(div3)					
//					$('#chooseEffect').append('<br/>')
//					
					// Append new image
//					var newimg = Pixastic.process(img, "coloradjust", {red:0.5,green:0,blue:0});
//					console.log(newimg);
//					$('#chooseEffect').append(newimg)

					//$('#chooseEffect').append('<img src='+ effect_img.src + ' alt=ddd />');
					//effect_img.appendTo( $('<div/>').css('display', 'none') );

//					$.post('upload.php', dataArray[index], function(data) {
//
//						var fileName = dataArray[index].name;
//						++x;
//
//						// Change the bar to represent how much has loaded
//						$('#loading-bar .loading-color').css({'width' : totalPercent*(x)+'%'});
//
//						if(totalPercent*(x) == 100) {
//							// Show the upload is complete
//							$('#loading-content').html('Uploading Complete!');
//
//							// Reset everything when the loading is completed
//							setTimeout(restartFiles, 500);
//
//						} else if(totalPercent*(x) < 100) {
//
//							// Show that the files are uploading
//							$('#loading-content').html('Uploading '+fileName);
//
//						}
//
//						// Show a message showing the file URL.
//						var dataSplit = data.split(':');
//						if(dataSplit[1] == 'uploaded successfully') {
//							var realData = '<li><a href="images/'+dataSplit[0]+'">'+fileName+'</a> '+dataSplit[1]+'</li>';
//
//							$('#uploaded-files').append('<li><a href="images/'+dataSplit[0]+'">'+fileName+'</a> '+dataSplit[1]+'</li>');
//
//							// Add things to local storage
//							if(window.localStorage.length == 0) {
//								y = 0;
//							} else {
//								y = window.localStorage.length;
//							}
//
//							window.localStorage.setItem(y, realData);
//
//						} else {
//							$('#uploaded-files').append('<li><a href="images/'+data+'. File Name: '+dataArray[index].name+'</li>');
//						}
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
					if(value != undefined || value != '') {
						$('#uploaded-files').append(value);
					}
				}
			} else {
				$('#uploaded-files').fadeOut();
			}

		})


	};

}($))


function imageDisplayEffect(img, appendArea, type){
	
	
	var origin_img_width = img.width;
	var origin_img_height = img.height;
	
	var default_width_unit = 100;
	var default_height_unit = 100;
	
	var horizontal_number = Math.ceil(origin_img_width/default_width_unit);
	var vertical_number = Math.ceil(origin_img_height/default_height_unit);
	
	for(var i=1; i<=vertical_number; i++){
		
		for(var j=1; j<=horizontal_number; j++){
			
			var div = document.createElement('div');
			$(div).css({
				width: default_width_unit + "px",
				height: default_height_unit + "px",
				opacity: 0,
				display: "inline-block",
				backgroundImage: "url(" + img.src + ")"
				
			});
			div.style.backgroundPosition =  (-(parseInt(j)-1) * parseInt(default_width_unit)) + "px " + (-(parseInt(i)-1) * parseInt(default_width_unit)) + "px";
			$('#chooseEffect').append(div);
			
			if(type){
				
				console.log("opacity effect")
				$(div).animate({
						opacity: 1
				}, i * j * 3000);
				
			}else{
				
				console.log("move effect")
				$(div).css({
					position: "absolute",
					top: (random(0, $(window).height()) + 0) + "px",
					left: (random(0, $(window).width()) + 0) + "px"
				});
				
				$(div).animate({
					opacity: 1
				}, i * 1000 + j * 400)
				
				$(div).animate({
					top: $('#chooseEffect').offset().top + i * default_width_unit + "px",
					left : $('#chooseEffect').offset().left  + j * default_height_unit + "px"
				}, i * j * random(2000, 4000));
				
			}
			
			if(j == horizontal_number)
				$('#chooseEffect').append("<br/>")
		}			
			
	}
	
	for(var i=0; i<vertical_number; i++){
		
		for(var j=0; j<horizontal_number; j++){
		
			
			
		}
		
	}	
	
	
}


function random(min,max) {
	return Math.ceil(Math.random()*(max-min+1)+min-1);
}