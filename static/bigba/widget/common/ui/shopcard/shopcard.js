define('bigba:widget/common/ui/shopcard/shopcard.js', function(require, exports, module){ /**
 * 商户列表&商户卡片
 * @author boye.liu
 */
var shopCardTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('    ');var __default_src = '/static/images/shopcard_loading.png';_template_fun_array.push('    ');for(var i = 0, len = data.length; i < len; i++){ var shop = data[i];_template_fun_array.push('    <li class="list-item shopcard ');if(shop.is_online == 0){;_template_fun_array.push(' offline ');}else{_template_fun_array.push(' online ');}_template_fun_array.push('" data="',typeof(shop.release_id) === 'undefined'?'':baidu.template._encodeHTML(shop.release_id),'" > ');if(shop.is_online == 0){_template_fun_array.push('');if(shop.bussiness_status==1){_template_fun_array.push('            <figure class="shop-rest-icon">            </figure>');}else if(shop.bussiness_status ==4){_template_fun_array.push('<figure class="shop-closed-icon">            </figure>        ');}_template_fun_array.push('');}_template_fun_array.push('');var is_new = shop.is_new;_template_fun_array.push('');if (!!display_new_shop && shop.is_online != 0){_template_fun_array.push('');if (is_new){_template_fun_array.push('<div class="newshop"><span>新店</span></div>');}_template_fun_array.push('');}_template_fun_array.push('        <div class="shopimg">            ');var url = shop.shop_logo ? shop.shop_logo : shop.logo_url;_template_fun_array.push('');var is_collected = shop.is_collected;_template_fun_array.push('            ');if (url){_template_fun_array.push('                <img width="228" height="140" data-src="http://webmap',typeof(parseInt(Math.random()*3)) === 'undefined'?'':baidu.template._encodeHTML(parseInt(Math.random()*3)),'.map.bdimg.com/maps/services/thumbnails?width=228&height=140&align=center,center&quality=100&src=',typeof(encodeURI(url)) === 'undefined'?'':baidu.template._encodeHTML(encodeURI(url)),'" alt="',typeof(shop.shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop.shop_name),'" onerror="this.src=&#39;',typeof(__default_src) === 'undefined'?'':baidu.template._encodeHTML(__default_src),'&#39;" src="',typeof('/static/images/shopcard_loading.png') === 'undefined'?'':baidu.template._encodeHTML('/static/images/shopcard_loading.png'),'"/>            ');}else{_template_fun_array.push('                <img width="228" height="140" src="',typeof('/static/images/shopcard_default_bg.png') === 'undefined'?'':baidu.template._encodeHTML('/static/images/shopcard_default_bg.png'),'"/>            ');}_template_fun_array.push('');if (is_collected){_template_fun_array.push('<div class="collected">&nbsp; </div>');}_template_fun_array.push('            ');if(shop.start_time){_template_fun_array.push('                <div class="shopdesc">');if (shop.bussiness_status ==2){_template_fun_array.push('<span>接受预订&nbsp;</span>',typeof(shop.start_time) === 'undefined'?'':baidu.template._encodeHTML(shop.start_time),'开始配送');}else if(shop.bussiness_status ==3){_template_fun_array.push('',typeof(shop.start_time) === 'undefined'?'':baidu.template._encodeHTML(shop.start_time),'开始营业');}_template_fun_array.push('</div>            ');}_template_fun_array.push('        </div>        <div class="title" title="',typeof(shop.shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop.shop_name),'">            ');if(shop.shop_name){_template_fun_array.push('',typeof(shop.shop_name.length<=11?(shop.shop_name):(shop.shop_name.slice(0,11)+"...")) === 'undefined'?'':baidu.template._encodeHTML(shop.shop_name.length<=11?(shop.shop_name):(shop.shop_name.slice(0,11)+"...")),'');}_template_fun_array.push('');if(shop.is_certificated){_template_fun_array.push('<span class="cert-icon"><img src="http://waimai.baidu.com/static/forpc/certificated_s.png"/></span>');}_template_fun_array.push('        </div>        ');var score = shop.comment_num ? (shop.comment_num >= 10 ? shop.average_score : 0):shop.average_score;_template_fun_array.push('        <div class="info s-info clearfix">            <div class="f-col f-star star-control" data-star="',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'">                <span class="rate">                    <span class="rate-inner" style="width:',typeof(score*(72/5)) === 'undefined'?'':baidu.template._encodeHTML(score*(72/5)),'px"></span>                </span>            </div>            <div class="f-col f-sale">                已售<span>',typeof(shop.saled) === 'undefined'?'':baidu.template._encodeHTML(shop.saled),'</span>份            </div>        </div>        <div class="info f-info clearfix">            <div class="f-col f-price">                <span class="item-label">起送:</span>                <span class="item-value">&#165;',typeof(shop.takeout_price) === 'undefined'?'':baidu.template._encodeHTML(shop.takeout_price),'</span>            </div>            <div class="f-col f-cost">                <span class="item-label">配送:</span>                <span class="item-value">                    &#165;',typeof(shop.takeout_cost) === 'undefined'?'':baidu.template._encodeHTML(shop.takeout_cost),'                    ');for(var j = 0,welfareLen=shop.welfare_info.length;j<welfareLen;j++){var welfareItem = shop.welfare_info[j];_template_fun_array.push('                        ');if(welfareItem.type == "mian"){_template_fun_array.push('                        <i class="item-line"></i>                        ');}_template_fun_array.push('                    ');}_template_fun_array.push('                </span>            </div>            <div class="f-col f-time">                ');if (!shop.delivery_time || shop.delivery_time=="" || shop.delivery_time=="0"){_template_fun_array.push('                    暂无                ');}else{_template_fun_array.push(''); if(shop.delivery_time>=60*24){_template_fun_array.push('',typeof(Math.floor(shop.delivery_time/(60*24))) === 'undefined'?'':baidu.template._encodeHTML(Math.floor(shop.delivery_time/(60*24))),'天');}else if(shop.delivery_time>=60){_template_fun_array.push(''); if(shop.delivery_time%60==0){_template_fun_array.push('',typeof((shop.delivery_time/60)) === 'undefined'?'':baidu.template._encodeHTML((shop.delivery_time/60)),'小时');}else{_template_fun_array.push('',typeof(Math.floor(shop.delivery_time/60)) === 'undefined'?'':baidu.template._encodeHTML(Math.floor(shop.delivery_time/60)),'小时',typeof((shop.delivery_time%60)) === 'undefined'?'':baidu.template._encodeHTML((shop.delivery_time%60)),'分钟');}_template_fun_array.push(''); }else{_template_fun_array.push('',typeof(shop.delivery_time) === 'undefined'?'':baidu.template._encodeHTML(shop.delivery_time),'分钟');}_template_fun_array.push('                                    ');}_template_fun_array.push('            </div>        </div>        <div class="feature">            ');for(var j = 0,welfareLen=shop.welfare_info.length;j<welfareLen;j++){var welfareItem = shop.welfare_info[j];_template_fun_array.push('                <em class="',typeof(welfareItem.type) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.type),'-min-icon premium-icon" data-msg="',typeof(welfareItem.msg) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.msg),'"><img src="http://waimai.baidu.com/static/forpc/',typeof(welfareItem.type) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.type),'_s.png" /></em>            ');}_template_fun_array.push('        </div>        <div class="overlay">            <div class="o-con">                <div class="shop-title">                    <p>',typeof(shop.shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop.shop_name),'');if(shop.is_certificated){_template_fun_array.push('<span class="cert-icon"><img src="http://waimai.baidu.com/static/forpc/certificated_s.png"/></span>');}_template_fun_array.push('</p>                    ');if(shop.is_certificated){_template_fun_array.push('<p class="cert-pah">支持查看政府认可的资质证照</p>');}_template_fun_array.push('                </div>                ');if (shop.welfare_info.length){_template_fun_array.push('                <div class="shop-feature">                    <ul>                        ');for(var j = 0,welfareLen=shop.welfare_info.length;j<welfareLen;j++){var welfareItem = shop.welfare_info[j];_template_fun_array.push('                            <li>                                <em class="',typeof(welfareItem.type) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.type),'-min-icon premium-icon"><img src="http://waimai.baidu.com/static/forpc/',typeof(welfareItem.type) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.type),'_s.png"  /></em>                                <p ');if(welfareItem.type=="pay"){_template_fun_array.push(' style="width:150px;"');}_template_fun_array.push('>',typeof(welfareItem.msg) === 'undefined'?'':baidu.template._encodeHTML(welfareItem.msg),'</p>                            </li>                        ');}_template_fun_array.push('                    </ul>                </div>                ');}_template_fun_array.push('                <div class="shop-notice">                    <h2>商家公告</h2>                    <p>                        ');if(shop.shop_announcement){_template_fun_array.push('                            ',typeof(shop.shop_announcement)==='undefined'?'':shop.shop_announcement,'                        ');}else{_template_fun_array.push('                            本店欢迎您下单，用餐高峰请提前下单，谢谢！                        ');}_template_fun_array.push('                    </p>                </div>            </div>            <div class="o-arrow"></div>        </div>    </li>    ');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
/*
* opt = {
*   data : data
*   $el : 列表父元素 必须是ul
*}
*/
var _opt = {
    data : [],
    $el : null,
    listComplete : null
}
function ShopCard(opt){
    this.opt = $.extend(_opt,opt);
    this.bindEvent();
    this.renderList(this.opt.data,this.opt.display_new_shop,this.opt.server_time);
}
$.extend(ShopCard.prototype, {
    renderList: function(data,display_new_shop,server_time){
        var _$el = this.opt.$el;
        if(data && data.length > 0){
            var _html = shopCardTmpl({data:data,display_new_shop:display_new_shop,server_time:server_time});
            if(_$el.get(0).tagName.toLowerCase() == "ul"){//本身是ul
                _$el.addClass('shopcards-list');
                _$el.append(_html);
            }else if(_$el.find("ul.shopcards-list").length){//本身不是ul，但包含ul.shopcards-list
                _$el.find("ul.shopcards-list").append(_html);
            }else{
                _$el.append("<ul class='shopcards-list'></ul>");
                _$el.find("ul.shopcards-list").append(_html);
            }
            $(this).trigger('list.complete');
        }
    },
    bindEvent: function(){
        var $me = this.opt.$el;
        var self = this;
        $me.on("click","li.list-item",function(){
            //统计功能
            addNStat({da_src:'ShopListBk.ShopItemBtn',da_act:'click',da_trd:'waimai'});
            var shopId = $(this).attr("data");
            /*var refStr = [];
            if(self.opt.refInfo){
                var refStr = $.map(self.opt.refInfo,function(val,key){return key+"="+(val || "")});
            }else{}
            
            stat.trackEvent("shoplist", "click", shopId);
            window.open("/waimai/shop/" + shopId + (refStr.length?"?"+refStr.join("&"):""));*/
            stat.trackEvent("shoplist", "click", shopId);
            window.open("/waimai/shop/" + shopId);
        });
        $(this).on("list.complete",function(){
            this.opt.listComplete && this.opt.listComplete(this.opt);
        });
    }
});

module.exports = ShopCard;
 
});