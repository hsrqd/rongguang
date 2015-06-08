define('bigba:widget/common/nav/nav.js', function(require, exports, module){ /**
 * 导航widget
 * @author jason
 * @createDate 2014-01-24
 */
var util = require('bigba:static/util.js'),
    CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js"),
    CityBar = require("bigba:widget/common/ui/citybar/citybar.js"),
    Search = require("bigba:widget/common/ui/search/search.js"),
    navList = $('.header .nav .nav-item');
var resultTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="search-title">    <div class="search-desc">请确定您的地址</div></div><div class="search-list s-list">    <ul>        ');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('            <li data-uid = "',typeof(item.uid) === 'undefined'?'':baidu.template._encodeHTML(item.uid),'" data-link = "/waimai?qt=shoplist&lat=',typeof(item.latitude) === 'undefined'?'':baidu.template._encodeHTML(item.latitude),'&lng=',typeof(item.longitude) === 'undefined'?'':baidu.template._encodeHTML(item.longitude),'&address=',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'&city_id=',typeof(city_id) === 'undefined'?'':baidu.template._encodeHTML(city_id),'" data-msg = "',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'$',typeof((item.address?item.address:"")) === 'undefined'?'':baidu.template._encodeHTML((item.address?item.address:"")),'$',typeof(item.latitude) === 'undefined'?'':baidu.template._encodeHTML(item.latitude),'$',typeof(item.longitude) === 'undefined'?'':baidu.template._encodeHTML(item.longitude),'$',typeof(item.shopnum) === 'undefined'?'':baidu.template._encodeHTML(item.shopnum),'$',typeof(city_id) === 'undefined'?'':baidu.template._encodeHTML(city_id),'" data-name="',typeof(decodeURIComponent(item.name)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.name)),'">                <div class="addr addr-icon"></div>                <div class="addr addr-content">                    <p class="addr-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</p>                    <p class="addr-desc">',typeof((item.address?item.address:"")) === 'undefined'?'':baidu.template._encodeHTML((item.address?item.address:"")),'</p>                    ');if(!item.shopnum || parseInt(item.shopnum,10) === 0){_template_fun_array.push('                        <p class="addr-shop-num addr-no-open">暂无开通</p>                    ');}else{_template_fun_array.push('                        <p class="addr-shop-num">',typeof(item.shopnum) === 'undefined'?'':baidu.template._encodeHTML(item.shopnum),'家餐厅</p>                    ');}_template_fun_array.push('                </div>            </li>        ');}_template_fun_array.push('    </ul></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var historyTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="s-list search-list">    <ul>        ');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('        <li data-link = "/waimai?qt=shoplist&lat=',typeof(item.lat) === 'undefined'?'':baidu.template._encodeHTML(item.lat),'&lng=',typeof(item.lng) === 'undefined'?'':baidu.template._encodeHTML(item.lng),'&address=',typeof(decodeURIComponent(item.name)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.name)),'&city_id=',typeof(decodeURIComponent(item.city_id)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.city_id)),'" data-name="',typeof(decodeURIComponent(item.name)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.name)),'">                <div class="addr his-icon"></div>                <div class="addr addr-content">                    <p class="addr-name">',typeof(decodeURIComponent(item.name)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.name)),'</p>                    <p class="addr-desc">',typeof(decodeURIComponent(item.address)) === 'undefined'?'':baidu.template._encodeHTML(decodeURIComponent(item.address)),'</p>                    ');if(!item.shopnum || parseInt(item.shopnum,10) === 0){_template_fun_array.push('                        <p class="addr-shop-num addr-no-open">暂无开通</p>                    ');}else{_template_fun_array.push('                        <p class="addr-shop-num">',typeof(item.shopnum) === 'undefined'?'':baidu.template._encodeHTML(item.shopnum),'家外卖餐厅</p>                    ');}_template_fun_array.push('                </div>            </li>        ');}_template_fun_array.push('    </ul></div><div class="search-history-clear">    <a class="clear-btn">清空历史记录</a></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var $el = $(".header");
var $searchEl = $("#nav-search-section");
var cityBarObj;
function hideSearch(){
    $searchEl.removeClass('s-active');
}
function showSearch(){
    $searchEl.addClass('s-active');
    $searchEl.find(".s-second .s-con").val("");
    $searchEl.find(".s-second .s-con").focus();
    $(Search).trigger('show.history');
    $(Search).trigger('address.hide.history');
}
function showCircle(e) {
    var city = CookieDataCenter.getCity(city);
    if (city.hasaoi) {
        $searchEl.addClass('s-active');
        $searchEl.find(".s-second .s-con").val("");
        $searchEl.find(".s-second .s-con").focus();
        listener.trigger("city", "hasaoi", city);
        $(Search).trigger('hide.history');
    } else {
        showSearch();
    }
    e && e.stopPropagation();
}
function initEvent(){
    // 导航菜单事件添加
    navList.on('click.nav', function(e) {
        var navId = $(this).attr('id'),
            self = this;
        if (navId === 'order') {
            e.preventDefault();// 取消菜单默认事件
            require.async('bigba:widget/common/userinfo/UserMgr.js', function(user) {
                user.login({
                    url : $(self).find('.nav-item-link').prop('href')
                });
            });
            return;
        }
        $(this).addClass('nav-item-active');
    });
    $searchEl.find(".switch-action").on("click",showCircle);
    $searchEl.find(".s-first .s-con").on("click",showCircle);
    $searchEl.find(".s-second .s-con").on("click",showCircle);

    $searchEl.find('#s-con').on('keyup focus', function(e) {
        var $target = $(e.currentTarget),
            val = $target.val(),
            city = CookieDataCenter.getCity();
        if (city.hasaoi) {
            if (val === '') {
                setTimeout(function() {
                    listener.trigger("city", "hasaoi", city);
                    $(Search).trigger('hide.history');
                }, 0);
            } else {
                listener.trigger("city", "hide");
            }
        } else {
            listener.trigger("city", "hide");
        }
    });

    listener.on('muticities', 'selected', function() {
        showCircle();
    });

    // $searchEl.find('.s-con').on('focus', function(e){
    //     var $target = $(e.currentTarget),
    //         val = $target.val(),
    //         city = CookieDataCenter.getCity(city);
    //     if (city.hasaoi) {
    //         if (val === '') {
    //             setTimeout(function() {
    //                 listener.trigger("city", "hasaoi", city);
    //                 $(Search).trigger('hide.history');
    //             }, 0);
    //         }
    //     }
    // });

    // $searchEl.find('#s-con').on('blur', function() {
        // listener.trigger("city", "hide");
    // });

    $(document).on("click",hideSearch);
    $searchEl.hover(function(){
        $(document).unbind('click', hideSearch);
    },function(){
        $(document).on("click",hideSearch);
    });
    //打开城市选择浮层时，关闭历史记录
    listener.on('city', 'select', function() {
        // hideSearch();
        $(Search).trigger('hide.history');
    });

    // listener.on('mutiaois', 'selected', function(status, opt) {
    //     $(Search).trigger('go.search', opt);
    // });

    // listener.on('muticities', 'show', function(status, opt) {
    //     $(Search).trigger('clear.search');
    // });
}
function initCityBar(){
    // listener.trigger('city', 'select');
    // debugger;
    // var cityList;
    // $.ajax({
    //     url: "/waimai?qt=getcitylist",
    //     type: "GET",
    //     dataType: "json",
    //     success: function(rs){
    //         cityList = rs.result.city_list;
    //         cityList && cityBarObj.updateCityList(cityList);
    //     }
    // });
}
module.exports = {
    /**
     * widget js 入口函数
     */
    init : function() {
        cityBarObj = new CityBar({
            $el: $searchEl.find(".s-citybar"),
            init: initCityBar
        });
        //initCityBar();
        Search.init({
            $resultEl : $searchEl.find(".s-search-container1"),
            $searchConEl : $searchEl.find(".s-second .s-con")
        });
        initEvent();
    },
    /**
     * 设置切换地址
     */
    initSwitchaddr : function() {
        var caddr = CookieDataCenter.getAddr() || {},
            addr;
        addr = caddr.address || '';
        $('#nav-search-section input.s-con').val(util.encodeHTML(decodeURIComponent(addr)));
    }
}
 
});