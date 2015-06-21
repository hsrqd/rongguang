define('bigba:widget/common/ui/search/search.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
var AddressDataCenter = require("bigba:static/utils/AddressDataCenter.js");


var resultTmpl = [function(_template_object
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
var historyTmpl = [function(_template_object
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
var sugTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="search-list s-list">    <ul>        ');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('            <li data-name="',typeof(item.name3) === 'undefined'?'':baidu.template._encodeHTML(item.name3),'">                <div class="addr addr-icon"></div>                <div class="addr addr-content">                    <p class="addr-name">',typeof(item.name3) === 'undefined'?'':baidu.template._encodeHTML(item.name3),'</p>                    <p class="addr-desc">',typeof(item.name1) === 'undefined'?'':baidu.template._encodeHTML(item.name1),'',typeof(item.name2) === 'undefined'?'':baidu.template._encodeHTML(item.name2),'',typeof(item.name3) === 'undefined'?'':baidu.template._encodeHTML(item.name3),'</p>                </div>            </li>        ');}_template_fun_array.push('    </ul></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var emptyTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<p>此地点附近暂时没有外卖餐厅，努力覆盖中...</p>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var _historyHtml; //历史记录dom



var Search = function(context, arg) {
    var searchList = (function() {
        var opt = {
            $resultEl: null,
            $searchConEl: null,
            $searchBtn: null,
            showHistoryTrg: null,
            hideHistoryTrg: null,
            NOListLiJump: null,
            $hiddenSearchPOI: null
        }

        function initOption(arg) {
            $.extend(opt, arg);
        }

        function initHtml() {
            opt.$resultEl.addClass('mod-search-hide mod-search-container');
        }

        function hideResult(e) {
            opt.$resultEl.addClass('mod-search-hide');
        }

        function setItemTopAttr() {
            var $list = opt.$resultEl.find(".s-list li");
            var cTop = opt.$resultEl.offset()["top"];
            for (var i = 0, len = $list.length; i < len; i++) {
                var _top = $list.eq(i).offset()["top"];
                var _height = $list.eq(i).outerHeight(true);
                var _val = _top - _height - cTop;
                $list.eq(i).attr("data-top", _val);
            }
        }

        function showHistory() {
            var html;
            opt.$resultEl.empty()
                .removeClass('mod-search-result mod-search-sug mod-search-empty')
                .addClass('mod-search-history');
            html = getHistoryTemplate();
            if (html) {
                opt.$resultEl.removeClass('mod-search-hide').append(html).show();
                setItemTopAttr();
            } else {
                opt.$resultEl.addClass('mod-search-hide');
            }
        }

        function hideHistory() {
            opt.$resultEl.hide().empty().removeClass('mod-search-history').addClass('mod-search-hide');
        }

        function showSug(html) {
            opt.$resultEl.empty()
                .removeClass('mod-search-hide mod-search-result mod-search-history mod-search-empty')
                .addClass('mod-search-sug')
                .append(html).show();
            setItemTopAttr();
            hideLoading();
        }

        function showResult(html) {
            opt.$resultEl.empty();
            opt.$resultEl.removeClass('mod-search-hide mod-search-sug mod-search-history mod-search-empty');
            opt.$resultEl.addClass('mod-search-result');
            opt.$resultEl.append(html).show();
            setItemTopAttr();
            hideLoading();

        }

        function showEmpty() {
            if (opt.NOListLiJump) { //如果是确认订单页的填写地址
                opt.$hiddenSearchPOI.val("0-0");
                hideResult();
            } else {
                var html = emptyTmpl();
                opt.$resultEl.empty();
                opt.$resultEl.removeClass('mod-search-hide mod-search-sug mod-search-history mod-search-result');
                opt.$resultEl.addClass('mod-search-empty');
                opt.$resultEl.append(html).show();
                hideLoading();
            }
        }

        function showLoading() {
            $(".s-loading").removeClass('mod-search-hide');
        }

        function hideLoading() {
            $(".s-loading").addClass('mod-search-hide');
        }

        function stopBubble(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function getHistoryTemplate() {
            if (_historyHtml) {
                return _historyHtml;
            }
            var history = AddressDataCenter.getAll();
            if (history && history.length) {
                return _historyHtml = historyTmpl({
                    data: history
                });
            }
            return null;
        }

        function getSug(wd) {
            var _cid = CookieDataCenter.getCity()["code"];
            var wd = wd ? wd : opt.$searchConEl.val();
            var html = '';
            $.ajax({
                url: "http://map.baidu.com/su?wd=" + wd, //rp_format=pb&if_poi_xy=1
                type: "GET",
                dataType: "jsonp",
                data: {
                    cid: _cid,
                    type: 0
                },
                success: function(json) {
                    var rs = json.s || [];
                    if (rs.length > 0) {
                        if (opt.NOListLiJump) {
                            html = '';
                            var data = [];
                            $.each(rs, function(index, item) {
                                var _name = item.split("$")[3];
                                var _nameStr = _name.replace(wd, '<b>' + wd + '</b>');
                                data.push({
                                    name1: item.split("$")[0],
                                    name2: item.split("$")[1],
                                    name3: item.split("$")[3],
                                });
                            });
                            html = sugTmpl({
                                data: data
                            });

                        } else {
                            html = "<div class='search-list s-list'><ul>";
                            $.each(rs, function(index, item) {
                                var _name = item.split("$")[3];
                                var _nameStr = "<i></i><span>" + _name.replace(wd, '<b>' + wd + '</b>') + "</span>";
                                html += "<li data-name='" + _name + "'>" + _nameStr + "</li>";
                            });
                            html += "</ul></div>";
                        }
                        showSug(html);
                    }
                }
            });
        }

        function goSearch(wd) {
            showLoading();
            var wd = wd ? wd : opt.$searchConEl.val();
            var _html = "";
            //添加统计
            statis && statis.trackEvent("find", "poisearch", wd);
            addNStat({
                da_src: 'findBk.searchBtn',
                da_act: 'click',
                da_trd: 'waimai'
            });
            var url = '/waimai?qt=poisearch&from=pc&ie=utf-8&sug=0&tn=B_NORMAL_MAP&oue=1&res=1&c=' + CookieDataCenter.getCity()["code"];
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                data: {
                    wd: wd,
                    _t: +new Date
                },
                timeout: 10000,
                success: function(json) {
                    if (json.error_no == 0) {
                        if (json.result.url == '') {//表示检索出多个地址，需要用户进行二次点击
                            if (opt.NOListLiJump && json.result.content.length ==1 ) { //如果只是填写地址，且检索数目只有一个
                                var name = json.result.content[0].name || '';
                                var lat = json.result.content[0].latitude || '0';
                                var lng = json.result.content[0].longitude || '0';
                                opt.$searchConEl.val(name);
                                opt.$hiddenSearchPOI.val(lat + "-" + lng);
                                hideResult();
                            } else {
                                var _html = resultTmpl({
                                    data: json.result.content,
                                    city_id: json.result.city_id
                                });
                                showResult(_html);
                            }
                        } else {//表示只检索出一个地址，只需点击一次
                            var cacheData = json.result.content[0] || {
                                shopnum: 0
                            };
                            if (!!cacheData.shopnum) {
                                var data = {};
                                data.name = cacheData.name;
                                data.address = cacheData.address;
                                data.lat = cacheData.latitude;
                                data.lng = cacheData.longitude;
                                data.shopnum = cacheData.shopnum;
                                data.city_id = json.result.city_id;
                                AddressDataCenter.add(data);
                                if (opt.NOListLiJump) { //如果只是填写地址
                                    opt.$searchConEl.val(data.name);
                                    opt.$hiddenSearchPOI.val(data.lat + "-" + data.lng);
                                    hideResult();
                                } else {
                                    window.location.href = json.result.url;
                                }

                            } else {
                                showEmpty();
                            }

                        }
                    } else {
                        showEmpty();
                    }
                },
                error: function() {
                    showEmpty();
                }
            });
        }

        function enterOption() {
            var $sList = opt.$resultEl.find(".s-list");
            if ($sList.length > 0) {
                var $liOn = $sList.find("li.s-on");
                if ($liOn.length > 0) {
                    $liOn.click();
                    return;
                }
            }
            if (opt.$searchConEl.val()) {
                goSearch(opt.$searchConEl.val());
            }
        }

        function listScroll() {
            var $liArr = opt.$resultEl.find(".s-list li");
            var _top;
            if ($liArr.length > 0) {
                if (opt.$resultEl.hasClass('mod-search-result')) {
                    if ($liArr.size() < 5) {
                        return;
                    }
                } else {
                    if ($liArr.size() < 7) {
                        return;
                    }
                }
                _top = opt.$resultEl.find(".s-list li.s-on").attr("data-top");
                opt.$resultEl.scrollTop(_top);
            }
        }

        function bindEvent(e) {

            var _$con = opt.$searchConEl;
            var _$el = opt.$resultEl;

            var showhis = 'show.history';
            if (opt.showHistoryTrg) {
                showhis = opt.showHistoryTrg;
            }

            var hidehis = 'hide.history';
            if (opt.hideHistoryTrg) {
                hidehis = opt.hideHistoryTrg;
            }

            $(e).on(showhis, function(e) {
                setTimeout(function() {
                    showHistory();
                }, 0);
            });
            $(e).on(hidehis, function(e) {
                setTimeout(function() {
                    hideHistory();
                }, 0);
            });


            // $(e).on('go.search', function(e, opt) {
            //     setTimeout(function() {
            //         _$con.val(opt.aoiname);
            //         getSug(opt.aoiname);
            //         listener.trigger("city", "hide");
            //     }, 0);
            // });
            // $(e).on('clear.search', function() {
            //     setTimeout(function() {
            //         _$con.val('');
            //     }, 0);
            // });
            _$el.on('blur', function() {
                this.hide();
            });

            _$con.on("click", function(e) {
                var _val = _$con.val();
                var city = CookieDataCenter.getCity();

                if (_val.length == 0) {
                    if (!city.hasaoi) {
                        showHistory();
                    }
                } else {
                    getSug(_val);
                }
                e.stopPropagation();
            });

            _$con.on("keydown", function(e) {
                window.NOBLUR = "NOPE";
                if(opt.$hiddenSearchPOI){
                    opt.$hiddenSearchPOI.val("");
                }
                

                if (e.which == 13) {
                    enterOption();
                    return;
                }
                //上键
                if (e.which == 38) {
                    var $list = _$el.find(".s-list");
                    if ($list.length > 0) {
                        var $target = $list.find("li.s-on");
                        //没有选中或者已经是第一个，选中最后一个
                        if ($target.length == 0 || $target.index() == 0) {
                            $list.find("li:last").addClass('s-on');
                            $target.removeClass('s-on');
                        } else {
                            $target.prev("li").addClass('s-on');
                            $target.removeClass('s-on');
                        }
                        var $tmp = $list.find("li.s-on");
                        var value = $tmp.attr("data-name");
                        listScroll();
                        value && _$con.val(value);
                    }
                    return;
                }
                //下键
                if (e.which == 40) {
                    var $list = _$el.find(".s-list");
                    if ($list.length > 0) {
                        var $target = $list.find("li.s-on");
                        //没有选中或者已经是最后一个，选中第一个
                        if ($target.length == 0 || $target.index() == ($list.find("li").length - 1)) {
                            $list.find("li:first").addClass('s-on');
                            $target.removeClass('s-on');
                        } else {
                            $target.next("li").addClass('s-on');
                            $target.removeClass('s-on');
                        }
                        var $tmp = $list.find("li.s-on");
                        var value = $tmp.attr("data-name");
                        listScroll();
                        value && _$con.val(value);
                    }
                    return;
                }
                var city = CookieDataCenter.getCity();
                setTimeout(function() {
                    var _val = _$con.val();
                    if (_val.length == 0) {
                        if (!city.hasaoi) {
                            showHistory();
                        }
                    } else {
                        getSug(_val);
                    }
                }, 0);
            });
            /*点击结果、历史记录跳转或者点击sug搜索*/
            _$el.on("click", ".s-list li", function(e) {
                stopBubble(e);
                //sug点击搜索
                if (_$el.hasClass('mod-search-sug')) {
                    var wd = $(e.currentTarget).data('name');
                    wd && opt.$searchConEl.val(wd);
                    goSearch();
                    return;
                }

                var data = {};
                var msg = $(this).attr("data-msg");
                var link = $(this).attr("data-link");

                //结果点击判断是否开通，计入Cookie
                if (_$el.hasClass('mod-search-result')) {
                    if (opt.NOListLiJump) {

                    } else {
                        if ($(this).find(".addr-shop-num").hasClass('addr-no-open')) {
                            return;
                        }
                    }


                    var arr = msg.split("$");
                    data.name = arr[0];
                    data.address = arr[1];
                    data.lat = arr[2];
                    data.lng = arr[3];
                    data.shopnum = arr[4];
                    data.city_id = arr[5];
                    AddressDataCenter.add(data);
                }



                if (opt.NOListLiJump) {
                    var arr = link.split("&");
                    var myVal = [];
                    for (var i = 0; i < arr.length; i++) {
                        var leftKey = arr[i].split("=")[0];
                        var rightValue = arr[i].split("=")[1];
                        myVal[leftKey] = rightValue;
                    }
                    data.name = myVal['address'];
                    data.lat = myVal['lat'];
                    data.lng = myVal['lng'];
                    data.city_id = myVal['city_id'];
                    AddressDataCenter.add(data);

                    opt.$searchConEl.val(myVal['address']);
                    opt.$hiddenSearchPOI.val(data.lat + "-" + data.lng);
                    hideHistory()

                } else {

                    window.location.href = link;
                }
            });

            _$el.on("mousedown", ".s-list li", function(e) {
                window.NOBLUR = "YES";
            });
            //清空历史记录
            _$el.on("click", ".clear-btn", function(e) {
                stopBubble(e);
                AddressDataCenter.clearAll();
                _historyHtml = null;
                hideResult();
                _$el.empty();
            });
            /*处理隐藏事件*/
            $(document).on("click", hideResult);

            _$el.hover(function() {
                $(document).unbind('click', hideResult);
            }, function() {
                $(document).on("click", hideResult);
            });

            _$con.hover(function() {
                $(document).unbind('click', hideResult);
            }, function() {
                $(document).on("click", hideResult);
            });
        }

        return {
            initOption: initOption,
            initHtml: initHtml,
            bindEvent: bindEvent,

        };
    })();
    searchList.initOption(arg);
    searchList.initHtml();
    searchList.bindEvent(context);
    searchList = null;
}


module.exports = {
    init: function(arg) {
        // var context = this;
        // initOption(arg);
        // initHtml();
        // bindEvent(context);
        var search = new Search(this, arg);
    }
}; 
});