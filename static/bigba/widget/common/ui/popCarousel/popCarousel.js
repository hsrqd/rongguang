define('bigba:widget/common/ui/popCarousel/popCarousel.js', function(require, exports, module){ /**
 * @file Address.
 * @author lide.li
 * @date 2015.01.04
 */
var Dialog = require("jsmod/ui/dialog");
var Carousel = require("jsmod/ui/carousel");
var detailTeml = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="pop-con">    <div class="closeBtn"></div><div class="side"><div class="icon-con" data-node="prev"><span class="icon-prev"></span></div></div>    <div class="big-pic" data-node="popContent">        </div>    <div class="side">    <div class="icon-con" data-node="next">    <span class="icon-next"></span>    </div>    </div>    <div class="clearfix"></div>    <div class="pic-list">    <div class="icons-con"  data-node="prevp">    <span class="icon-prev"></span>    </div>    <div class="list-con" data-node="listContent">    </div>    <div class="icons-con" data-node="nextp">    <span class="icon-next"></span>    </div>    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var cacheDialog;
var bigPic;
var listPic;
//当前位置默认为0
var currentIndex=0;
//list显示3个图片
var listCount = 3;
/*
* AJAX请求URL
*/
var ADD_AJAX = "/waimai?qt=addressmanage&type=add&display=json";
var UPDATE_AJAX = "/waimai?qt=addressmanage&type=update&display=json";
var REMOVE_AJAX = "/waimai?qt=addressmanage&type=del&display=json";
var SETDEFAULT_AJAX = "/waimai?qt=addressmanage&type=set&display=json";
/*
* _opt = {
*   data : data
*   $listEl : 列表父级DOM
*   $addBtn : 新增DOM
*   $detailEl : 对话框DOM 无需传入
*   listComplete : 列表初始化完成触发事件 
*   dialogShow: 对话框弹出触发,
*   saveSuccess: 保存成功触发,
*   reForm:true //data 为空返回表单
*}
*/
var _opt = {
    data : [
    ],
    $bigPicEl : null,
    $addBtn : null,
    $detailEl : null,
    listComplete : null,
    itemRemove : null,
    dialogShow: null,
    saveSuccess: null,
    reForm:true
}
function popCarousel(opt){
    this.opt = $.extend({},_opt,opt);
    currentIndex = opt.index || 0;
    this.initBigPic();
    this.bindEvent();
}
$.extend(popCarousel.prototype,{
    bindEvent : function(){
        var $me = cacheDialog.getElement();
        var self = this;
        $me.on("click","[data-node=next]",function () {
            bigPic.next();
        });

        $me.on("click","[data-node=prev]",function () {
            bigPic.pre();
        });

        $me.on("click","[data-node=nextp]",function () {
            listPic.cur(currentIndex + listCount,undefined,true);
        });

        $me.on("click","[data-node=prevp]",function () {
            listPic.cur(currentIndex - listCount,undefined,true);
        });
    },
    initBigPic: function(){
        var data = this.opt.data;
        var _htmls = [];
        var _listhtmls = [];
        cacheDialog = new Dialog({
            html: detailTeml()
        });
        var _el = cacheDialog.getElement();
        for(var i=0,len=data.length;i<len;i++){
            _htmls.push('<div class="image-content"><img onerror="util.errorImg(this);" data-src="'+data[i].rsrc+'"></div>');
            _listhtmls.push('<div class="image-content"><img onerror="util.errorImg(this);" src="'+data[i].src+'" width="167" height="100"></div>');
        }
        bigPic = new Carousel(_el.find('[data-node="popContent"]'), {
            count: 1,
            htmls: _htmls
        });
        cacheDialog.show();
        $(bigPic).on("active", function (e) {
            currentIndex = e.index;
            var img = this.getItem(e.index).find("img");
            img.prop("src", img.data("src"));
            listPic.cur(currentIndex);
        });
        //底部listcarousel
        listPic = new Carousel(_el.find('[data-node="listContent"]'), {
            count: 3,
            htmls: _listhtmls
        });
        $('[data-node="listContent"]').on("click",".mod-carousel-item", function (e) {
            var _index = $(this).data("index");
            bigPic.cur(_index);
            listPic.cur(_index);
        });
        // 为了触发 active 事件
        bigPic.cur(currentIndex);
        //$(this).trigger('listComplete');
    },
    successTip: function(msg){
        GlobalTips.tip(msg);
    },
    errorTip: function(msg){
        GlobalTips.tip(msg);
    },
    updateOpt : function(data){
        this.opt = $.extend({},this.opt,data);
    }
});
module.exports = popCarousel; 
});