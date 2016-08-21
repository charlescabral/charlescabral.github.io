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
            animationSpeed: 'slow',
            cache: false
        });

        $('.open-project').animatedModal({
            modalTarget: 'modal-projects',
            animatedIn: 'slideInUp',
            animatedOut: 'slideOutDown',
            color: '#FFF',
            animationDuration:'.5s'
        });


        $(document).on('click', '.share a.popup', {}, function popUp(e) {
            var self = $(this);
            popupCenter(self.attr('href'), self.text(), 580, 470);
            e.preventDefault();
        });
      
        $('.article-entry img').materialbox();
    });
})(jQuery);