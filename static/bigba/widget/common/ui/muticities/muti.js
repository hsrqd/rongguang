define('bigba:widget/common/ui/muticities/muti.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");

var citiesTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="cities" data-node="cities">    ');if(maybe_city.name){_template_fun_array.push('    <div class="guess-city">        <dl>            <dt>猜你在</dt>            <dd>                <a data-node="nav_city" href="javascript:void(0);" data-cityid="',typeof(maybe_city.code) === 'undefined'?'':baidu.template._encodeHTML(maybe_city.code),'" data-hasAoi="',typeof(maybe_city.isHaveAoi) === 'undefined'?'':baidu.template._encodeHTML(maybe_city.isHaveAoi),'">',typeof(maybe_city.name) === 'undefined'?'':baidu.template._encodeHTML(maybe_city.name),'</a>            </dd>        </dl>    </div>    ');}_template_fun_array.push('    ');for(var i in city_list){_template_fun_array.push('    <dl class="cities-group">        <dt>            ',typeof(i) === 'undefined'?'':baidu.template._encodeHTML(i),'        </dt>        <dd>            <ul>            ');for(var j in city_list[i]){_template_fun_array.push('                <li>                    <a data-node="nav_city" href="javascript:void(0);" data-cityid="',typeof(city_list[i][j].code) === 'undefined'?'':baidu.template._encodeHTML(city_list[i][j].code),'" data-hasAoi="',typeof(city_list[i][j].isHaveAoi) === 'undefined'?'':baidu.template._encodeHTML(city_list[i][j].isHaveAoi),'">                        ',typeof(city_list[i][j].name) === 'undefined'?'':baidu.template._encodeHTML(city_list[i][j].name),'                    </a>                </li>            ');}_template_fun_array.push('            </ul>        </dd>    </dl>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var aoisTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="aois" data-node="aois">    ');for(var i in aois){_template_fun_array.push('    <dl class="aoi-group">        <dt>',typeof(i) === 'undefined'?'':baidu.template._encodeHTML(i),'</dt>        <dd>            <ul>            ');for(var j in aois[i]){_template_fun_array.push('                <li>                    <a title="',typeof(aois[i][j].name) === 'undefined'?'':baidu.template._encodeHTML(aois[i][j].name),'" data-node="nav_aoi" href="/waimai?qt=shoplist&lat=',typeof(aois[i][j].lat) === 'undefined'?'':baidu.template._encodeHTML(aois[i][j].lat),'&lng=',typeof(aois[i][j].lng) === 'undefined'?'':baidu.template._encodeHTML(aois[i][j].lng),'&address=',typeof(aois[i][j].name) === 'undefined'?'':baidu.template._encodeHTML(aois[i][j].name),'&city_id=',typeof(city_id) === 'undefined'?'':baidu.template._encodeHTML(city_id),'">                        ',typeof(aois[i][j].name) === 'undefined'?'':baidu.template._encodeHTML(aois[i][j].name),'                    </a>                </li>            ');}_template_fun_array.push('            </ul>        </dd>    </dl>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

function Muti () {
    this.$el = $('#muti-aois');
    this.aois = {};
}

$.extend(Muti.prototype, {
    init: function() {
        var me = this;
        // me.initCities();
        me.initEvents();
    },
    initCities: function() {
        var me = this;
        me.showCities();
    },
    initEvents: function() {
        var me = this;
        me.$el.on('click', function(e) {
            e.stopPropagation();
        });
        me.$el.delegate('[data-node="nav_city"]', 'click', function(e) {
            var $target = $(e.currentTarget),
                cityid = $target.data('cityid'),
                cityname = $.trim($target.html()),
                hasAoi = $target.data('hasaoi');
            var city = {name: cityname, code: cityid, hasaoi: hasAoi};
            CookieDataCenter.setCity(city);
            listener.trigger('muticities', 'selected', city);
            e.stopPropagation();
            // console.log({i: cityid, n: cityname, h:hasAoi});
        });
        me.$el.delegate('[data-node="nav_aoi"]', 'click', function(e) {
            var $target = $(e.currentTarget),
                aoiname = $.trim($target.html());
            listener.trigger('mutiaois', 'selected', {aoiname: aoiname});
            e.stopPropagation();
        });
        //选择城市
        listener.on("city", "select", function(status, opt) {
            me.hide();
            me.showCities();
            listener.trigger('muticities', 'show');
        });
        //隐藏
        listener.on("city", "hide", function() {
            me.hide();
        });
        listener.on("city", "hasaoi", function(status, opt) {
            me.showAoi(opt);
        });
    },
    showCities: function() {
        var me = this;
        if (me.cities) {
            me._htmlCities(me.cities);
            return;
        }
        $.ajax({
            url: '/waimai?qt=getcitylist&format=1',
            data: {
                t: new Date().getTime()
            },
            dataType: 'json',
            beforeSend: function() {
                me.$el.empty().addClass('loading').show();
            },
            success: function(data) {
                if (data.result) {
                    var result = data.result;
                    me.cities = result;
                    setTimeout(function() {
                        me._htmlCities(result);
                    }, 0);
                }
            },
            error: function () {

            }
        });
    },
    _htmlCities: function(result) {
        var me = this,
            cities = citiesTpl(result);
        me.$el.removeClass('loading').html(cities).show();
    },
    _htmlAois: function(result) {
        var me = this,
            aois = aoisTpl(result);
        me.$el.html(aois).removeClass('loading').show();
        listener.trigger('mask','show');
    },
    hide: function() {
        var me = this;
        me.$el.hide().empty();
    },
    showAoi: function(city) {
        var me = this;
        if (me.aois[city.code]) {
            me._htmlAois(me.aois[city.code]);
            return;
        }
        $.ajax({
            url: '/waimai?qt=getcitylist',
            data: {
                city_id: city.code,
                t: new Date().getTime()
            },
            dataType: 'json',
            beforeSend: function() {
                // me.$el.empty().addClass('loading').show();
            },
            success: function(data) {
                if (data.result) {
                    var result = data.result;
                    me.aois[city.code] = result;
                    setTimeout(function() {
                        me._htmlAois(result);
                    }, 0);
                }
            },
            error: function () {

            }
        })
    }
});

module.exports = new Muti(); 
});