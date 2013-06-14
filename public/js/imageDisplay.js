(function($){

	$.fn.imageDisplay = function(options){

		// Default options
		var opts = $.extend({

			effect : "moving",

			appendArea : "body",

			duration: 5000,

			widthUnit: 100,

			heightUnit: 100

		}, options);

		// Default effect and methods
		var methods = {

			"fading" : function(div, i, j){

				$(div).animate({
						opacity: 1
				}, i * j * 3000);

			},

			"moving" : function(div, i, j){

				$(div).css({
					position: "absolute",
					top: (random(0, $(window).height()) + 0) + "px",
					left: (random(0, $(window).width()) + 0) + "px"
				});

				$(div).animate({
					opacity: 1
				}, i * 1000 + j * 400);

				$(div).animate({
					top: $('#chooseEffect').offset().top + i * width_unit + "px",
					left : $('#chooseEffect').offset().left  + j * height_unit + "px"
				}, i * j * random(2000, 4000));

			},

			"loadImg" : function(img, opts){

				var origin_img_width = img.width,
					origin_img_height = img.height,
					width_unit = opts.widthUnit,
					height_unit = opts.heightUnit,
					horizontal_number = Math.ceil(origin_img_width/width_unit),
					vertical_number = Math.ceil(origin_img_height/height_unit),
					appendArea = opts.appendArea,
					type = opts.effect;


				for(var i=1; i<=vertical_number; i++){

					for(var j=1; j<=horizontal_number; j++){

						var div = document.createElement('div');
						$(div).css({
							width: width_unit + "px",
							height: height_unit + "px",
							opacity: 0,
							display: "inline-block",
							backgroundImage: "url(" + img.src + ")" ,
							backgroundRepeat: "no-repeat"
						});
						div.style.backgroundPosition =  (-(j-1) * width_unit) + "px " + (-(i-1) * width_unit) + "px";
						$(appendArea).append(div);

						if(type){

							this.fading(div, i, j);

						}else{

							this.moving(div, i, j);

						}

						if(j == horizontal_number)
							$(appendArea).append("<br/>");

					}

				}// end for

			}

		};

		return this.each(function(){

			methods.loadImg(this, opts);

		});

	};

}(window.jQuery || jQuery));
