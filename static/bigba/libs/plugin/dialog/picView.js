!function(){{var i,t=require("jsmod/ui/dialog"),e=require("jsmod/ui/carousel");require("bigba:static/utils/Template.js")}i={html:['<div class="pic-view">','<a class="pic-view-close" href="javascript:void(0);"></a>','<div class="pic-view-panel">','<div class="pic-view-control">','<a class="pre" href="javascript:void(0);"></a>','<a class="next" href="javascript:void(0);"></a>',"</div>",'<div class="pic-view-image"></div>',"</div>",'<div class="pic-view-desc desc"></div>','<div class="pic-view-bottom">','<a class="next" href="javascript:void(0);"></a>','<a class="pre" href="javascript:void(0);"></a>','<div class="pic-view-carousel"></div>',"</div>","</div>"].join(""),height:600,width:800,count:6},Class.define("PicView",{extend:plugin.Base,initialize:function(e){var a=this,e=e||{};a.dialog=new t({html:i.html,height:i.height,width:e.width||i.width,offset:{top:-a.getOffset()}}),a.dialog.getElement().find(".pic-view-close").click(function(){a.dialog.hide({fade:!0})}),a.desc=a.dialog.getElement().find(".pic-view-desc"),a.$root=a.dialog.getElement().find(".pic-view")},getOffset:function(){return $(window).height()-i.height>100?($(window).height()-i.height)/2-100:0},setDesc:function(){this.desc.html('<div class="page"><span class="curPage">'+this.index+"</span>/"+this.dataLength+"</div>")},setData:function(i){this.data=i,this.dataLength=this.data.length},createJscroll:function(t){var a=this,s=a.dialog.getElement(),c=[],n=[];a.jscroll||($.each(a.data,function(i,t){var e=t.url?t.url:this.imgUrl?util.thumbnails({src:this.imgUrl,width:314,height:220}):util.getNoPicUrl();c.push(['<div class="item">','<img src="'+e+'" onload="util.stretchImg(this,100,70,true)" onerror="util.errorImg(this)" />',"</div>"].join("")),n.push(['<div class="item">','<div class="item-inner"><img data-src="'+this.imgUrl+'" onerror="util.errorImg(this)" /></div>',"</div>"].join(""))}),a.jscroll=new e(s.find(".pic-view-carousel"),{htmls:c,count:i.count,current:t}),a.currentIndex=t,a.index=t+1,a.changeBtnStat(a.currentIndex),$(a.jscroll).on("active",function(i){var t;a.currentIndex=i.index,a.index=i.index+1,a.changeBtnStat(a.currentIndex),t=a.banner.getCurIndex(),t!=a.jscroll.getCurIndex()&&a.banner.cur(a.jscroll.getCurIndex())}),a.$root.delegate(".pic-view-bottom .next","click",function(){a.jscroll.cur(a.currentIndex+i.count,void 0,!0)}),a.$root.delegate(".pic-view-bottom .pre","click",function(){a.jscroll.cur(a.currentIndex-i.count,void 0,!0)}),a.$root.delegate(".pic-view-bottom .mod-carousel-item","click",function(){a.jscroll.cur($(this).data("index"))}),a.banner=new e(s.find(".pic-view-image"),{htmls:n,count:1,current:t}),$(a.banner).on("active",function(){var i,t;i=a.jscroll.getCurIndex(),t=this.getItem(this.getCurIndex()).find("img"),i!=this.getCurIndex()&&a.jscroll.cur(this.getCurIndex()),t.data("loaded")||(t.one("load.img",function(){t.data("loaded",!0)}),t.one("error.img",function(){t.data("loaded",!1),t.off("load.img")}),t.prop("src",t.attr("data-src"))),a.setDesc()}),$(a.banner).trigger("active"),a.banner.total<=1||(a.$root.on("mousemove",".pic-view-image",function(i){var t;t=$(i.target).hasClass("mod-carousel-item")?i.offsetX||i.originalEvent.layerX:(i.offsetX||i.originalEvent.layerX)+i.target.offsetLeft,t>$(this).width()/2?$(this).removeClass("pic-view-image-left").addClass("pic-view-image-right"):$(this).removeClass("pic-view-image-right").addClass("pic-view-image-left")}),a.$root.on("click",".pic-view-image",function(i){var t;t=$(i.target).hasClass("mod-carousel-item")?i.offsetX||i.originalEvent.layerX:(i.offsetX||i.originalEvent.layerX)+i.target.offsetLeft,t>$(this).width()/2?a.banner.next():a.banner.pre()})))},changeBtnStat:function(){var t=this;t.currentIndex+2>=t.jscroll.total-1||i.count>=t.jscroll.total?t.$root.find(".pic-view-bottom .next").animate({opacity:0},200,function(){$(this).css("opacity",1).css("visibility","hidden")}):t.$root.find(".pic-view-bottom .next").css("visibility","visible"),t.currentIndex-3<=0||i.count>=t.jscroll.total?t.$root.find(".pic-view-bottom .pre").animate({opacity:0},200,function(){$(this).css("opacity",1).css("visibility","hidden")}):t.$root.find(".pic-view-bottom .pre").css("visibility","visible")},scrollTo:function(i){var t=this;t.dialog.show({fade:!0}),t.jscroll?t.jscroll.cur(i-1):t.createJscroll(i-1),t.setDesc()}})}();