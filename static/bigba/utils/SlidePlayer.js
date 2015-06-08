define('bigba:static/utils/SlidePlayer.js', function(require, exports, module){ /**
 * banner图片轮播
 * @author liuboye
 * @date 2014-07-01
 */
 /*
 * _option  默认配置
 * timer 循环自动播放timer
 */
var _option = {
    autoPlay : true,
    current : 0,
    duration : 3000,
    width : "100%",
    height : "100%",
    autoAdaptive : false
};
var timer;
var SlidePlayer = function(element,option){
    var self = this;
    if($(element).length == 0){
        return;
    }
    self.$el = $(element);
    self.option = $.extend({}, _option, option);
    self.init();
}

$.extend(SlidePlayer.prototype, {
    init: function(){
        var self = this;
        var imgCount=0;
        self.$el.css({"position":"relative","overflow":"hidden"});
        self.$imgList = self.$el.find(".slide-container li");
        self.$navContainer = self.$el.find(".slide-indicators");
        self.imgCount = self.$imgList.size();
        self.cur = self.option.current;
        if(self.imgCount == 0){
            self.$el.hide();
            return;
        }
        if(self.option.autoAdaptive){
            self.option.height = "100%";
            self.option.width = "100%";
        }
        /*初始化样式*/
        self.$imgList.css({"position":"relative","float":"left","margin-right":"-100%"});
        self.$imgList.find("img").css({"height":self.option.height,"width":self.option.width});
        self.$imgList.hide();
        self.$imgList.eq(self.cur).show();
        /*添加圆点指示器*/
        if(self.imgCount > 1){
            self.addNav();
            self.$navContainer.find("li").removeClass('active');
            self.$navContainer.find("li").eq(self.cur).addClass('active');
        }
    },
    addNav: function(){
        var self = this;
        var tmp = "";
        for (var i = 0; i < self.imgCount; i++) {
            i == self.cur ? tmp += "<li class='active'></li>" : tmp += "<li></li>";
        };
        self.$navContainer.append(tmp);

        self.bindEvent();
        if(self.option.autoPlay){
            self.startAutoPlay();
        }
    },
    showCur: function(){
        var self = this;
        self.$imgList.fadeOut(1000);
        self.$imgList.eq(self.cur).fadeIn(1000);
        self.$navContainer.find("li").removeClass('active');
        self.$navContainer.find("li").eq(self.cur).addClass('active');
    },
    autoPlay: function(me){
        var self = me || this;
        if(self.cur >= (self.imgCount-1)){
            self.cur = 0;
        }else{
            self.cur++;
        }
        self.showCur();
    },
    startAutoPlay: function(){
        var self = this;
        timer = setInterval(function(){self.autoPlay(self)},self.option.duration);
    },
    stopAutoPlay: function(){
        clearInterval(timer);
    },
    bindEvent: function(){
        var self = this;
        if(self.option.autoPlay){
            self.$navContainer.hover(function(){
                self.stopAutoPlay();
            },function(){
                self.startAutoPlay();
            });
        }
        self.$navContainer.on("click","li",function(e){
            e.stopPropagation();
            e.preventDefault();
            var $me = $(e.currentTarget);
            if($me.hasClass('active')){
                return;
            }
            self.stopAutoPlay();
            self.cur = $me.index();
            self.showCur();
        });
    }
});
module.exports = SlidePlayer; 
});