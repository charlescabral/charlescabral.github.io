// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


function workBelt() {
  
  $(".trigger").remove();
  $(".return").remove();

  $('.thumb-unit').click(function() {
    $('.work-belt').addClass("slided");
    $('.work-container').show();
  });
  
  $('.work-return').click(function() {
    $('.work-belt').removeClass("slided");
    $('.work-container').hide(800);
  });

}


function  workLoad() {
  
  $.ajaxSetup({ cache: true });
  
  $('.thumb-unit').click(function() {
    var $this = $(this),
        newTitle = $this.find('strong').text(),
        spinner = '<div class="loader">Loading...</div>',
        filePath = $this.data('filepath');
      
    $('.project-load').html(spinner).load(filePath);
    $('.project-title').text(newTitle);
  });
  
}
