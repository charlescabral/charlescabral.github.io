(function ($) {
    $(function () {

        lazySizes.init();

    	var slideout = new Slideout({
    		'panel': document.getElementById('panel'),
    		'menu': document.getElementById('menu-mobile'),
    		'padding': 256,
    		'tolerance': 70,
            'side': 'right',
            'touch': false
    	});

    	// Toggle button
        $('.menu-control').on('click', function(){
            slideout.toggle();
            $(this).toggleClass('active');
            $('#menu-mobile').toggleClass('active');
            $('#panel').toggleClass('active');
        });

        $('#page_holder').pagify({ 
            pages: [], 
            animation: 'fadeIn',
            animationOut: 'fadeOut',
            cache: false
        });

        $('.open-project').animatedModal({
            modalTarget: 'modal-projects',
            animatedIn: 'slideInUp',
            animatedOut: 'slideOutDown',
            color: '#FFF'
        });









    });
})(jQuery);