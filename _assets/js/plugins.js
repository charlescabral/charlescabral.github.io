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







/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var ScrollFix = function(elem) {
  // Variables to track inputs
  var startY, startTopScroll;
  
  elem = elem || document.querySelector(elem);
  
  // If there is no element, then do nothing  
  if(!elem)
    return;

  // Handle the start of interactions
  elem.addEventListener('touchstart', function(event){
    startY = event.touches[0].pageY;
    startTopScroll = elem.scrollTop;
    
    if(startTopScroll <= 0)
      elem.scrollTop = 1;

    if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
      elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
  }, false);
};