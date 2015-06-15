define("bigba:widget/common/nav/nav.js",function(require,exports,module){function hideSearch(){$searchEl.removeClass("s-active")}function showSearch(){$searchEl.addClass("s-active"),$searchEl.find(".s-second .s-con").val(""),$searchEl.find(".s-second .s-con").focus(),$(Search).trigger("show.history"),$(Search).trigger("address.hide.history")}function showCircle(e){var t=CookieDataCenter.getCity(t);t.hasaoi?($searchEl.addClass("s-active"),$searchEl.find(".s-second .s-con").val(""),$searchEl.find(".s-second .s-con").focus(),listener.trigger("city","hasaoi",t),$(Search).trigger("hide.history")):showSearch(),e&&e.stopPropagation()}function initEvent(){navList.on("click.nav",function(e){var t=$(this).attr("id"),a=this;return"order"===t?(e.preventDefault(),void require.async("bigba:widget/common/userinfo/UserMgr.js",function(e){e.login({url:$(a).find(".nav-item-link").prop("href")})})):void $(this).addClass("nav-item-active")}),$searchEl.find(".switch-action").on("click",showCircle),$searchEl.find(".s-first .s-con").on("click",showCircle),$searchEl.find(".s-second .s-con").on("click",showCircle),$searchEl.find("#s-con").on("keyup focus",function(e){var t=$(e.currentTarget),a=t.val(),i=CookieDataCenter.getCity();i.hasaoi&&""===a?setTimeout(function(){listener.trigger("city","hasaoi",i),$(Search).trigger("hide.history")},0):listener.trigger("city","hide")}),listener.on("muticities","selected",function(){showCircle()}),$(document).on("click",hideSearch),$searchEl.hover(function(){$(document).unbind("click",hideSearch)},function(){$(document).on("click",hideSearch)}),listener.on("city","select",function(){$(Search).trigger("hide.history")})}function initCityBar(){}var util=require("bigba:static/util.js"),CookieDataCenter=require("bigba:static/utils/CookieDataCenter.js"),CityBar=require("bigba:widget/common/ui/citybar/citybar.js"),Search=require("bigba:widget/common/ui/search/search.js"),navList=$(".header .nav .nav-item"),resultTpl=[function(_template_object){var _template_fun_array=[],fn=function(__data__){var _template_varName="";for(var name in __data__)_template_varName+="var "+name+'=__data__["'+name+'"];';eval(_template_varName),_template_fun_array.push('<div class="search-title">    <div class="search-desc">请确定您的地址</div></div><div class="search-list s-list">    <ul>        ');for(var i=0,len=data.length;len>i;i++){var item=data[i];_template_fun_array.push('            <li data-uid = "',"undefined"==typeof item.uid?"":baidu.template._encodeHTML(item.uid),'" data-link = "/waimai?qt=shoplist&lat=',"undefined"==typeof item.latitude?"":baidu.template._encodeHTML(item.latitude),"&lng=","undefined"==typeof item.longitude?"":baidu.template._encodeHTML(item.longitude),"&address=","undefined"==typeof item.name?"":baidu.template._encodeHTML(item.name),"&city_id=","undefined"==typeof city_id?"":baidu.template._encodeHTML(city_id),'" data-msg = "',"undefined"==typeof item.name?"":baidu.template._encodeHTML(item.name),"$","undefined"==typeof(item.address?item.address:"")?"":baidu.template._encodeHTML(item.address?item.address:""),"$","undefined"==typeof item.latitude?"":baidu.template._encodeHTML(item.latitude),"$","undefined"==typeof item.longitude?"":baidu.template._encodeHTML(item.longitude),"$","undefined"==typeof item.shopnum?"":baidu.template._encodeHTML(item.shopnum),"$","undefined"==typeof city_id?"":baidu.template._encodeHTML(city_id),'" data-name="',"undefined"==typeof decodeURIComponent(item.name)?"":baidu.template._encodeHTML(decodeURIComponent(item.name)),'">                <div class="addr addr-icon"></div>                <div class="addr addr-content">                    <p class="addr-name">',"undefined"==typeof item.name?"":baidu.template._encodeHTML(item.name),'</p>                    <p class="addr-desc">',"undefined"==typeof(item.address?item.address:"")?"":baidu.template._encodeHTML(item.address?item.address:""),"</p>                    "),item.shopnum&&0!==parseInt(item.shopnum,10)?_template_fun_array.push('                        <p class="addr-shop-num">',"undefined"==typeof item.shopnum?"":baidu.template._encodeHTML(item.shopnum),"家餐厅</p>                    "):_template_fun_array.push('                        <p class="addr-shop-num addr-no-open">暂无开通</p>                    '),_template_fun_array.push("                </div>            </li>        ")}_template_fun_array.push("    </ul></div>"),_template_varName=null}(_template_object);return fn=null,_template_fun_array.join("")}][0],historyTpl=[function(_template_object){var _template_fun_array=[],fn=function(__data__){var _template_varName="";for(var name in __data__)_template_varName+="var "+name+'=__data__["'+name+'"];';eval(_template_varName),_template_fun_array.push('<div class="s-list search-list">    <ul>        ');for(var i=0,len=data.length;len>i;i++){var item=data[i];_template_fun_array.push('        <li data-link = "/waimai?qt=shoplist&lat=',"undefined"==typeof item.lat?"":baidu.template._encodeHTML(item.lat),"&lng=","undefined"==typeof item.lng?"":baidu.template._encodeHTML(item.lng),"&address=","undefined"==typeof decodeURIComponent(item.name)?"":baidu.template._encodeHTML(decodeURIComponent(item.name)),"&city_id=","undefined"==typeof decodeURIComponent(item.city_id)?"":baidu.template._encodeHTML(decodeURIComponent(item.city_id)),'" data-name="',"undefined"==typeof decodeURIComponent(item.name)?"":baidu.template._encodeHTML(decodeURIComponent(item.name)),'">                <div class="addr his-icon"></div>                <div class="addr addr-content">                    <p class="addr-name">',"undefined"==typeof decodeURIComponent(item.name)?"":baidu.template._encodeHTML(decodeURIComponent(item.name)),'</p>                    <p class="addr-desc">',"undefined"==typeof decodeURIComponent(item.address)?"":baidu.template._encodeHTML(decodeURIComponent(item.address)),"</p>                    "),item.shopnum&&0!==parseInt(item.shopnum,10)?_template_fun_array.push('                        <p class="addr-shop-num">',"undefined"==typeof item.shopnum?"":baidu.template._encodeHTML(item.shopnum),"家外卖餐厅</p>                    "):_template_fun_array.push('                        <p class="addr-shop-num addr-no-open">暂无开通</p>                    '),_template_fun_array.push("                </div>            </li>        ")}_template_fun_array.push('    </ul></div><div class="search-history-clear">    <a class="clear-btn">清空历史记录</a></div>'),_template_varName=null}(_template_object);return fn=null,_template_fun_array.join("")}][0],$el=$(".header"),$searchEl=$("#nav-search-section"),cityBarObj;module.exports={init:function(){cityBarObj=new CityBar({$el:$searchEl.find(".s-citybar"),init:initCityBar}),Search.init({$resultEl:$searchEl.find(".s-search-container1"),$searchConEl:$searchEl.find(".s-second .s-con")}),initEvent()},initSwitchaddr:function(){var e,t=CookieDataCenter.getAddr()||{};e=t.address||"",$("#nav-search-section input.s-con").val(util.encodeHTML(decodeURIComponent(e)))}}});