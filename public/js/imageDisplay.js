(function($){

	$.fn.imageDisplay = function(options){

		return this.each(function(){

			console.log($.fn.imageDisplay.options)

			var opts = $.extend($.fn.imageDisplay.options, options);
			$.imageDisplay.methods.loadImg(this, opts.appendArea, opts.defaultEffect);

		});

	};

	$.fn.imageDisplay.prototype.options = {

		defaultEffect : "moving",

		appendArea : "body",

		duration: 5000,

		widthUnit: 100,

		heightUnit: 100

	};

	$.fn.imageDisplay.prototype.methods = {


		"fading" : function(div){

			$(div).animate({
					opacity: 1
			}, i * j * 3000);

		},

		"moving" : function(div){

			$(div).css({
				position: "absolute",
				top: (random(0, $(window).height()) + 0) + "px",
				left: (random(0, $(window).width()) + 0) + "px"
			});

			$(div).animate({
				opacity: 1
			}, i * 1000 + j * 400);

			$(div).animate({
				top: $('#chooseEffect').offset().top + i * default_width_unit + "px",
				left : $('#chooseEffect').offset().left  + j * default_height_unit + "px"
			}, i * j * random(2000, 4000));

		},

		"loadImg" : function(img, appendArea, type){

			var origin_img_width = img.width,
				origin_img_height = img.height,
				default_width_unit = $.fn.imageDisplay.options.widthUnit,
				default_height_unit = $.fn.imageDisplay.options.heightUnit,
				horizontal_number = Math.ceil(origin_img_width/default_width_unit),
				vertical_number = Math.ceil(origin_img_height/default_height_unit);

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
						$.fn.imageDisplay.fading(div);

					}else{

						console.log("move effect")
						$.fn.imageDisplay.moving(div);

					}

					if(j == horizontal_number)
						$('#chooseEffect').append("<br/>")

				}

			}// end for

		}

	}

}(window.jQuery));

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
			$(appendArea).append(div);

			if(type){

				console.log("opacity effect");
				$(div).animate({
						opacity: 1
				}, i * j * 3000);

			}else{

				console.log("move effect");
				$(div).css({
					position: "absolute",
					top: (random(0, $(window).height()) + 0) + "px",
					left: (random(0, $(window).width()) + 0) + "px"
				});

				$(div).animate({
					opacity: 1
				}, i * 1000 + j * 400)

				$(div).animate({
					top: $(appendArea).offset().top + i * default_width_unit + "px",
					left : $(appendArea).offset().left  + j * default_height_unit + "px"
				}, i * j * random(2000, 4000));

			}

			if(j == horizontal_number)
				$(appendArea).append("<br/>")
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