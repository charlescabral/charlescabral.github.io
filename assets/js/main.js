!function(e){e(function(){lazySizes.init();var a=new Slideout({panel:document.getElementById("panel"),menu:document.getElementById("menu-mobile"),padding:256,tolerance:70,side:"right",touch:!1});e(".menu-control").on("click",function(){a.toggle(),e(this).toggleClass("active"),e("#menu-mobile").toggleClass("active"),e("#panel").toggleClass("active")}),e("#page_holder").pagify({pages:[],animation:"fadeIn",animationSpeed:"slow",cache:!1}),e(".open-project").animatedModal({modalTarget:"modal-projects",animatedIn:"slideInUp",animatedOut:"slideOutDown",color:"#FFF",animationDuration:".5s"}),e(".open-search").animatedModal({modalTarget:"modal-search",animatedIn:"slideInDown",animatedOut:"slideOutUp",color:"#FFF",animationDuration:".5s"}),e(document).on("click",".share a.popup",{},function(a){var t=e(this);popupCenter(t.attr("href"),t.text(),580,470),a.preventDefault()}),e(".article-entry img").materialbox()})}(jQuery);