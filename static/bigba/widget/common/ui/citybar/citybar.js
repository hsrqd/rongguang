define('bigba:widget/common/ui/citybar/citybar.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
var cityBarTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="city-dropdown">    <div class="city-locate dropdown-toggle">        <a class="current-city" data-name="',typeof(current_city.name) === 'undefined'?'':baidu.template._encodeHTML(current_city.name),'" data-code="',typeof(current_city.code) === 'undefined'?'':baidu.template._encodeHTML(current_city.code),'">',typeof(current_city.name) === 'undefined'?'':baidu.template._encodeHTML(current_city.name),'</a>        <b class="arrow"></b>    </div>    <div class="dropdown-menu hide">        <!-- <div class="city-disabled">已开通城市</div>        <ul class="city-list">            ');for(var i = 0,len = city_list.length; i < len ; i++){var item = city_list[i];_template_fun_array.push('                <li class="city-item" data-name = "',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-code = "',typeof(item.code) === 'undefined'?'':baidu.template._encodeHTML(item.code),'">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</li>            ');}_template_fun_array.push('        </ul> -->    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var exports;
/*
* data = {
    city_list:[
     {
        code : "131",
        name : "北京"
     },
     ......
    ],
    current_city:{
        code : "131",
        name : "北京"
    }
}
* 
*/
var opt = {
    $el: null,
    cityList: [],
    currentCity:null,
    init: null
}
function Citybar(arg){
    $.extend(opt,arg);
    //绑定事件要在DOM插入之前
    bindEvent();
    initHtml();
}
// function hideList(){
//     var _$el = opt.$el;
//     _$el.find(".dropdown-menu").addClass('hide');
//     _$el.find(".city-dropdown").removeClass('open');
// }
// function showList(){
//     var _$el = opt.$el;
//     _$el.find(".dropdown-menu").removeClass('hide');
//     _$el.find(".city-dropdown").addClass('open');
// }
// function switchCity(city){
    // var _$currentCity = opt.$el.find(".current-city");
    // _$currentCity.text(city.name);
    // _$currentCity.attr("data-name",city.name);
    // _$currentCity.attr("data-code",city.code);
   // _$currentCity.attr({"data-name":city.cityName,"data-code":city.cityCode});
    // CookieDataCenter.setCity(city);
// }
function bindEvent(){
    var _$el = opt.$el;
    //显示、隐藏下拉框
    // _$el.on("click",".dropdown-toggle",function(e){
    //     $(this).parent().hasClass('open') ? hideList() : showList();
    // });
    //切换地址
    // _$el.on('click', '.city-list li', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     var _cityCode = $(this).attr("data-code");
    //     var _cityName = $(this).attr("data-name");
    //     var _city = {
    //         "code": _cityCode,
    //         "name": _cityName
    //     }
    //     switchCity(_city);
    //     hideList();
    // });
    var toggle = 0;

    _$el.on('click', function(e) {
        toggle = ! toggle;
        listener.trigger('city', 'select', {toggle: toggle});
        e.stopPropagation();
    });
    
    listener.on('muticities', 'selected', function(status, opt) {
        setCity(opt);
        if (opt.hasaoi) {
            listener.trigger('city', 'hasaoi', opt);
        } else {
            listener.trigger('city', 'hide');
        }
    });
    //隐藏下拉框事件
    $(document).on("click", function() {
        listener.trigger('city', 'hide');
    });
    // _$el.hover(function(){
    //     $(document).unbind('click', hideList);
    // },function(){
    //     $(document).on("click",hideList);
    // });
}

function setCity(city) {
    var _$el = opt.$el;
    _$el.find('.current-city')
        .html(city.name)
        .attr('data-name', city.name)
        .attr('data-code', city.code)
        .attr('data-hasaoi', city.hasaoi);
}

function initHtml(){
    var _cityList = opt.cityList;
    var _currentCity = opt.currentCity;
    var _html;
    if(!_currentCity || !_currentCity.name){
        _currentCity = CookieDataCenter.getCity();
        opt.currentCity = _currentCity;
    }else{
        CookieDataCenter.setCity(opt.currentCity);
    }
    _html = cityBarTmpl({city_list:_cityList,current_city:_currentCity});
    opt.$el.append(_html);
    opt.init && opt.init(opt);
}
// $.extend(Citybar.prototype,{
    // updateCityList : function(cityList){
    //     var _html = cityBarTmpl({city_list:cityList,current_city:opt.currentCity});
    //     opt.$el.html(_html);
    // }
// });
exports = module.exports = Citybar; 
});