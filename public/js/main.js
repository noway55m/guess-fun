$(document).ready(function(){

	var nav =$("div.navbar-inner");

	// Logo control
	$("#logo").bind("mouseover", function(){


		if(nav.css('display') == 'none'){

			// Fade-in effect
			//$("div.navbar-inner").fadeIn(200);

			// Slide-in and wave effect
			nav.css({
				display:"",
				height: 0
			});
			nav.animate({
				display:"",
				height: 50
			}, 200).animate({
				display:"",
				height: 46
			}, 100).animate({
				display:"",
				height: 50
			}, 100);

		}

	});


	var t, l = (new Date()).getTime();

	$(window).scroll(function(){
		var now = (new Date()).getTime();

		if(now - l > 400){
			$(this).trigger('scrollStart');
			l = now;
		}

		clearTimeout(t);
		t = setTimeout(function(){
			$(window).trigger('scrollEnd');
		}, 500);
	});

	$(window).bind('scrollStart', function(){
		nav.fadeOut();
	});

	$(window).bind('scrollEnd', function(){
		nav.fadeIn();
	});



})



function navigatorDisplayControl(){


}

function navigatorShow(){
}

function navigatorHide(){

}
