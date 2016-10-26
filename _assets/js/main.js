(function ($) {
    $(function () {

        lazySizes.init();

        var panel,
            menu;

        function loaded () {
            panel = new IScroll('#panel', { mouseWheel: true });
            menu  = new IScroll('#menu-mobile', { mouseWheel: true });
        }

        document.addEventListener('DOMContentLoaded', loaded, false);

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
            if ($(this).hasClass('active')) {
                slideout.close();
                // main.iScroll.refresh();
                $(this).removeClass('active');
                $('#menu-mobile, #panel').removeClass('on');
                $('#menu-mobile, #panel').addClass('off');
            } else {
                slideout.open();
                $(this).addClass('active');
                $('#menu-mobile, #panel').removeClass('off');
                $('#menu-mobile, #panel').addClass('on');
            }
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

        $.getJSON("/projects.json", function(e) {
            var url = e;
            var loc = window.location.href;
            $.each(e, function(index, val) {
                if(loc.indexOf(val.href) > -1) { 
                    $('#modal-projects').css({
                        'overflow-y': 'auto',
                        'z-index': 9999,
                        'opacity': 1
                    });
                    $('body').css({ 'overflow':'hidden' });
                }
            });
        });

        $('.open-search').animatedModal({
            modalTarget: 'modal-search',
            animatedIn: 'fadeIn',
            animatedOut: 'fadeOut',
            animationDuration:'.3s',         
            beforeOpen: function() {
                if ($('.menu-control').hasClass('active')) {
                    slideout.close();
                    $(this).removeClass('active');
                } 
                $('#panel, #menu-mobile').addClass('blur off');
                $('#panel, #menu-mobile').removeClass('on');
                $('#search_input').val('').focus();
            }, 
            beforeClose: function() {
                $('#panel, #menu-mobile').removeClass('blur');
            }
        });

        $(document).on('click', '.share a.popup', {}, function popUp(e) {
            var self = $(this);
            popupCenter(self.attr('href'), self.text(), 580, 470);
            e.preventDefault();
        });

        $('select').niceSelect();

        $('.svg-icon').each( function() { $(this).insertSvg() });
        
        $('.article-entry img').materialbox();
    });
})(jQuery);