!function(a){a.fn.animatedModal=function(o){function n(){s.css({"z-index":i.zIndexOut}),i.afterClose()}function t(){i.afterOpen()}var e=a(this),i=a.extend({modalTarget:"animatedModal",position:"fixed",width:"100%",height:"100%",top:"0px",left:"0px",zIndexIn:"9999",zIndexOut:"-9999",color:"#39BEB9",opacityIn:"1",opacityOut:"0",animatedIn:"zoomIn",animatedOut:"zoomOut",animationDuration:".6s",overflow:"auto",beforeOpen:function(){},afterOpen:function(){},beforeClose:function(){},afterClose:function(){}},o),d=a(".close-"+i.modalTarget),l=a(e).data("modal"),s=a("body").find("#"+i.modalTarget),m="#"+s.attr("id");s.addClass("animated"),s.addClass(i.modalTarget+"-off");var r={position:i.position,width:i.width,height:i.height,top:i.top,left:i.left,"background-color":i.color,"overflow-y":i.overflow,"z-index":i.zIndexOut,opacity:i.opacityOut,"-webkit-animation-duration":i.animationDuration};s.css(r),e.click(function(o){a("body, html").css({overflow:"hidden"}),a(".slideout-panel").css({"will-change":"initial"}),l==m&&(s.hasClass(i.modalTarget+"-off")&&(s.removeClass(i.animatedOut),s.removeClass(i.modalTarget+"-off"),s.addClass(i.modalTarget+"-on")),s.hasClass(i.modalTarget+"-on")&&(i.beforeOpen(),s.css({opacity:i.opacityIn,"z-index":i.zIndexIn}),s.addClass(i.animatedIn),s.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",t)))}),d.click(function(o){o.preventDefault();var t=history;a("body, html").css({overflow:"auto"}),t.pushState("",document.title,window.location.pathname),i.beforeClose(),s.hasClass(i.modalTarget+"-on")&&(s.removeClass(i.modalTarget+"-on"),s.addClass(i.modalTarget+"-off")),s.hasClass(i.modalTarget+"-off")&&(s.removeClass(i.animatedIn),s.addClass(i.animatedOut),s.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",n))})}}(jQuery);