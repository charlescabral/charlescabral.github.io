(function ($) {
    $(function () {

    	var slideout = new Slideout({
    		'panel': document.getElementById('panel'),
    		'menu': document.getElementById('menu'),
    		'padding': 256,
    		'tolerance': 70
    	});

    	// Toggle button
    	document.querySelector('.menu-control').addEventListener('click', function() {
    		slideout.toggle();
    	});

    });
})(jQuery);