define('bigba:static/utils/GlobalErrorMonitor.js', function(require, exports, module){ /**
 * 全局错误信息监控
 * @author jason.zhou
 * @date 2014-02-25
 */
var URL = '/waimai?qt=feerror&msg=';
/**
 * 私有方法，真正提交错误的方法，参数是异常类，或者是自定义的json错误信息
 * @param {Object|Error} e 错误
 */
function err(e) {
	var errMsg = {},
		stack;
	if (typeof e !== 'object') {
		return;
	}
	//记录客户端环境
    errMsg.ua = window.navigator.userAgent;
    // 记录当前url
    errMsg.page_url = window.location.href;
    // 支持stack的浏览
    if (stack = e.stack) {
    	errMsg.stack = stack;
    } else {
    	for (var i in e) {
			if(e.hasOwnProperty(i) && typeof e[i] === 'string') {
				errMsg[i] = e[i];
			}
		}
    }

    //这里是用增加标签的方法调用日志收集接口，优点是比较简洁。
    new Image().src = URL + encodeURIComponent(JSON.stringify(errMsg)); 
}
module.exports = {
    error : function(message, url, line) {
    	if (arguments.length === 1) {
    		err(message);
    		return;
    	}
        if (!url) return;
        var errMsg = {};

        errMsg.message = message;
        errMsg.url = url;
        errMsg.line = line;
   		err(errMsg);
    }
} 
});
;define('bigba:static/utils/Cookie.js', function(require, exports, module){ /**
 * @file Cookie.
 * @author lide
 * @date 2013.07.31
 */

/**
 * @module static/utils/Cookie
 * copy from tangram
 */
var _isValidKey = function (key) {
    // http://www.w3.org/Protocols/rfc2109/rfc2109
    // Syntax:  General
    // The two state management headers, Set-Cookie and Cookie, have common
    // syntactic properties involving attribute-value pairs.  The following
    // grammar uses the notation, and tokens DIGIT (decimal digits) and
    // token (informally, a sequence of non-special, non-white space
    // characters) from the HTTP/1.1 specification [RFC 2068] to describe
    // their syntax.
    // av-pairs   = av-pair *(";" av-pair)
    // av-pair    = attr ["=" value] ; optional value
    // attr       = token
    // value      = word
    // word       = token | quoted-string
    
    // http://www.ietf.org/rfc/rfc2068.txt
    // token      = 1*<any CHAR except CTLs or tspecials>
    // CHAR       = <any US-ASCII character (octets 0 - 127)>
    // CTL        = <any US-ASCII control character
    //              (octets 0 - 31) and DEL (127)>
    // tspecials  = "(" | ")" | "<" | ">" | "@"
    //              | "," | ";" | ":" | "\" | <">
    //              | "/" | "[" | "]" | "?" | "="
    //              | "{" | "}" | SP | HT
    // SP         = <US-ASCII SP, space (32)>
    // HT         = <US-ASCII HT, horizontal-tab (9)>
        
    return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
};

var getRaw = function (key) {
    if (_isValidKey(key)) {
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);
            
        if (result) {
            return result[2] || null;
        }
    }

    return null;
};

 
var get = function (key) {
    var value = getRaw(key);
    if ('string' == typeof value) {
        value = decodeURIComponent(value);
        return value;
    }
    return null;
};

var setRaw = function (key, value, options) {
    if (!_isValidKey(key)) {
        return;
    }
    
    options = options || {};
    //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
    //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的
    
    // 计算cookie过期时间
    var expires = options.expires;
    if ('number' == typeof options.expires) {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
    }
    
    document.cookie =
        key + "=" + value
        + (options.path ? "; path=" + options.path : "")
        + (expires ? "; expires=" + expires.toGMTString() : "")
        + (options.domain ? "; domain=" + options.domain : "")
        + (options.secure ? "; secure" : ''); 
};

var remove = function (key, options) {
    options = options || {};
    options.expires = new Date(0);
    setRaw(key, '', options);
};

var set = function (key, value, options) {
    setRaw(key, encodeURIComponent(value), options);
};
module.exports = {
    getRaw:getRaw,
    get:get,
    remove:remove,
    setRaw:setRaw,
    set:set
};
 
});
;define('bigba:static/utils/AddressDataCenter.js', function(require, exports, module){ /**
 * @require bigba:static/plugin/json-2.3.js
 */
var cookie = require("bigba:static/utils/Cookie.js"),
    util = require("bigba:static/util.js"),
    dayTime = 24 * 60 * 60 * 1000, // 一天的毫秒数
    todayTime = new Date().getTime(), // 截止今天的毫秒数
    maxLength = 5,
    schema = ["name", "lat", "lng", "address","shopnum","city_id"],
    Const;
Const = {
    COOKIE_ADDR_KEY: 'wm_search_addr', // addr 存储的key值
    COOKIE_ADDR_EXPIRES: todayTime + dayTime * 365, // addr过期时间
    DEFAULT_PATH: '/'
};
/*
* 删除大于maxLength的记录
*/
function cut(data){
    while(data && data.length > maxLength){
        data.pop();
    }
    return data;
}
/*
* 检测两个对象是否相等，是否重复搜索
*/
function equal(a,b){
    return a && b && serialize(a) === serialize(b);
}
/*
* 序列化对象
*/
function serialize(data) {
    var result = '';
    for (var i in data) {
        if (data.hasOwnProperty(i) && i != "shopnum" && i != "city_id") {
            result += data[i];
        }
    }
    return result;
}
/*
* 检验对象合法性
*/
function validate(data){
    var flag = true;
    for(var i = 0,len = schema.length; i< len; i++){
        //address'有可能会出现空
        if(schema[i] != "address"){
            flag = flag && data[schema[i]];
        }
    }
    return flag;
}
module.exports = {
    /**
     * 设置地址到cookie
     */
    add: function(data) {
        if(!validate(data)){
            return;
        }
        var tmpData = {};
        var newData = [];
        var value;
        var oldData = this.getAll();
        tmpData.name = encodeURIComponent(data.name);
        tmpData.address = encodeURIComponent(data.address);
        tmpData.lat = data.lat;
        tmpData.lng = data.lng;
        tmpData.shopnum = data.shopnum;
        tmpData.city_id = data.city_id;

        for(var i = 0,len = oldData.length; i < len; i++) {
            var el = oldData[i];
            if(equal(el,tmpData)){
                oldData.splice(i,1);
            }
        }
        oldData.unshift(tmpData);
        newData = cut(oldData);

        value = JSON.stringify(newData);
        //value = encodeURIComponent(JSON.stringify(newData));
        cookie.setRaw(Const.COOKIE_ADDR_KEY, value, {
            expires: Const.COOKIE_ADDR_EXPIRES,
            path: Const.DEFAULT_PATH
        });
    },
    /**
     * cookie中获取搜索记录
     */
    getAll: function() {
        var value = cookie.getRaw(Const.COOKIE_ADDR_KEY);
        //var value = decodeURIComponent(cookie.getRaw(Const.COOKIE_ADDR_KEY));
        return value ? JSON.parse(value) : [];
    },
    /**
    * 清空历史记录
    */
    clearAll: function(){
        cookie.setRaw(Const.COOKIE_ADDR_KEY, [], {
            expires: todayTime,
            path: Const.DEFAULT_PATH
        });
        return true;
    }
}; 
});
;define('bigba:static/utils/Browser.js', function(require, exports, module){ /**
 * @file Browser.
 * @author lide
 * @date 2013.07.31
 */

/**
 * @module static/utils/Browser
 */
var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
var uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}

// Deprecated, use jQuery.browser.webkit instead
// Maintained for back-compat only
if ( browser.webkit ) {
    browser.safari = true;
}

module.exports = browser;
 
});
;define('bigba:static/utils/store.js', function(require, exports, module){ /* Copyright (c) 2010-2012 Marcus Westin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * https://github.com/marcuswestin/store.js/blob/master/store.js
 */

;(function(){
    var store = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        namespace = '__storejs__',
        storage;

    store.disabled = false;
    store.set = function(key, value) {}
    store.get = function(key) {}
    store.remove = function(key) {}
    store.clear = function() {}
    store.transact = function(key, defaultVal, transactionFn) {
        var val = store.get(key)
        if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
        }
        if (typeof val == 'undefined') { val = defaultVal || {} }
        transactionFn(val)
        store.set(key, val)
    }
    store.getAll = function() {}

    store.serialize = function(value) {
        return JSON.stringify(value)
    }
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        return JSON.parse(value)
    }

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    function isGlobalStorageNameSupported() {
        try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
        catch(err) { return false }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName];
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val));
        }
        store.get = function(key) { return store.deserialize(storage.getItem(key)) }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i);
                ret[key] = store.get(key);
            }
            return ret
        }
    } else if (isGlobalStorageNameSupported()) {
        storage = win[globalStorageName][win.location.hostname]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage[key] = store.serialize(val);
        }
        store.get = function(key) { return store.deserialize(storage[key] && storage[key].value) }
        store.remove = function(key) { delete storage[key] }
        store.clear = function() { for (var key in storage ) { delete storage[key] } }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i);
                ret[key] = store.get(key);
            }
            return ret
        }

    } else if (doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer;
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile');
            storageContainer.open();
            storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>');
            storageContainer.close();
            storageOwner = storageContainer.w.frames[0].document;
            storage = storageOwner.createElement('div');
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div');
            storageOwner = doc.body;
        }
        function withIEStorage(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift(storage);
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage);
                storage.addBehavior('#default#userData');
                storage.load(localStorageName);
                var result = storeFunction.apply(store, args);
                storageOwner.removeChild(storage);
                return result;
            }
        }

        // In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
        function ieKeyFix(key) {
            return key.replace(forbiddenCharsRegex, '___');
        }
        store.set = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key);
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val));
            storage.save(localStorageName);
        })
        store.get = withIEStorage(function(storage, key) {
            key = ieKeyFix(key);
            return store.deserialize(storage.getAttribute(key));
        })
        store.remove = withIEStorage(function(storage, key) {
            key = ieKeyFix(key);
            storage.removeAttribute(key);
            storage.save(localStorageName);
        })
        store.clear = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var i=0, attr; attr=attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        })
        store.getAll = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            var ret = {}
            for (var i=0, attr; attr=attributes[i]; ++i) {
                ret[attr] = store.get(attr);
            }
            return ret
        })
    }

    try {
        store.set(namespace, namespace);
        if (store.get(namespace) != namespace) { store.disabled = true }
        store.remove(namespace);
    } catch(e) {
        store.disabled = true
    }
    store.enabled = !store.disabled;

    if (typeof module != 'undefined' && typeof module != 'function') { module.exports = store }
    else if (typeof define === 'function' && define.amd) { define(store) }
    else { this.store = store }
})(); 
});
;define('bigba:static/utils/CartDataCenter.js', function(require, exports, module){ /**
 * Created with IntelliJ IDEA.
 * User: asheng
 * Date: 14-2-8
 * Time: 上午9:51
 * To change this template use File | Settings | File Templates.
 */
/**
 * 购物车数据格式
 * shopItem 表示 添加的菜品
 * itemId : 菜品id itemCount: 用户选择数量 itemName: 菜品名称 itemPrice:菜品单价 
 * itemStock: 菜品库存 packCount 餐盒数量 packPrice 餐盒单价 minOrderNumber:起订份数
 * itemDishType:菜品分类，主要用来区分套餐与多属性
 * {
 *     shopName:
 *     shopId:
 *     deliveryFee:
 *     takeOutPrice:
 *     shopItem:[
 *          {
 *              itemId:
 *              itemCount:
 *              itemName:
 *              itemPrice:
 *              packCount:
 *              packPrice:
 *              minOrderNumber：
 *              itemStock:
 *              itemDishType:
 *              itemStockId:
 *          }
 *     ]
 * }
 *
 * itemAttr,itemGrps拆出去，用菜品作为cookiekey；前提：用户端菜品id全局唯一
 * */
var cookie = require("bigba:static/utils/Cookie.js"),
    util = require("bigba:static/util.js"),
    exports,
    car,
    curShopId,
    delimiter = {
        shopToItem: "##",
        itemToItem: "$$",
        item: "^^"
    };
var featuresStock = {};//多规格库存量
var alertDialog = require("bigba:widget/common/ui/cartAlert/cartAlert.js");
var localStore = require("bigba:static/utils/store.js");
//格式化价格，保留一位小数
function formatPrice(price) {
    // return price;
    return (Math.round(price * 10) / 10).toFixed(1);
}
//保存数据
function saveData(key, value) {
    _value = encodeURIComponent(value);
    cookie.setRaw('s' + key + 's', _value, {
        path: '/'
    });
    localStore.set('s' + key + 's',value);
}
//获取数据
function getData(key) {
    return localStore.get('s' + key + 's') || cookie.get('s' + key + 's');
}
//获取数据
function clearData(key) {
    var _data =  unserialize(getData(key));
    //rd返回时已经充值cookie了，所以找不到关联套餐和多属性了，注释掉吧
    /*for (itemIdex = 0, len = _data.shopItem.length; itemIdex < len; itemIdex++) {
        localStore.remove('s' + _data.shopItem[itemIdex].itemId + 's');
        cookie.remove('s' + _data.shopItem[itemIdex].itemId + 's');
    }*/
    cookie.remove('s' + key + 's');
    localStore.remove('s' + key + 's');
    localStore.clear();
}

//序列化数据
function serialize(value) {
    var val, items = [];
    $.each(value.shopItem, function(i, item) {
        items.push([item.itemId, item.itemCount, item.itemName, item.itemPrice, item.packCount, item.packPrice, item.minOrderNumber,item.itemStock,item.itemDishType,item.itemStockId].join(delimiter.item));
    });
    val = [value.shopName, value.shopId, value.deliveryFee, value.takeOutPrice, items.join(delimiter.itemToItem)].join(delimiter.shopToItem);
    return val;
}
//反序列化数据
function unserialize(value) {
    if (!value) return {
        shopName: "",
        shopId: "",
        deliveryFee: 0,
        takeOutPrice: 0,
        shopItem: []
    };
    var vals = value.split(delimiter.shopToItem),
        val = {};
    if (vals.length >= 1)
        val.shopName = vals[0];
    if (vals.length >= 2)
        val.shopId = vals[1] + "";
    if (vals.length >= 3)
        val.deliveryFee = vals[2];
    if (vals.length >= 4)
        val.takeOutPrice = vals[3];

    val.shopItem = [];
    if (vals.length >= 5 && (vals = vals[4])) {
        vals = vals.split(delimiter.itemToItem);
        $.each(vals, function(i, item) {
            var v = item.split(delimiter.item);
            //套餐如果cookie不全，认为无相应菜品
            if(v[0] && v[8]==2){
                var cget = localStore.get("s"+v[0]+"s");
                if(!cget){return;}
            }

            val.shopItem.push({
                itemId: v[0],
                itemCount: parseInt(v[1]),
                itemName: v[2],
                itemPrice: v[3],
                packCount: v[4],
                packPrice: v[5],
                minOrderNumber: v[6],
                itemStock: parseInt(v[7]),
                itemDishType: v[8],
                itemStockId:v[9]
            });
        });
    }
    return val;
}
//保存当前购物车数据
function saveShopCar() {
    saveData(curShopId, serialize(car));
}
//初始化购物车数据
function initCar() {
    //获取当前商户ID
    car = unserialize(getData(curShopId));
    car.shopId = curShopId;
}
//针对多属性刷新库存量
//itemId: 菜品唯一id
//uid：规格id
//count：设置的新个数
//itemStock：规格现有库存总量
//stock"prodoct_id"s = {oriTotal:现有全部量，total：已经选择的量}
function setFeatureItemStock(itemId,uid,count,itemStock) {
    //var _uid = uid;//规格id
    //var localKey = "stock_" + _uid + "s";
    //var _oriData;
    var total = 0;
    var flag = false;
    itemStock = parseInt(itemStock);
    count = parseInt(count);
    /*if(!featuresStock[localKey] || !featuresStock[localKey].oriTotal) {
        featuresStock[localKey] = featuresStock[localKey] || {};
        featuresStock[localKey].oriTotal = itemStock;
        featuresStock[localKey].total = 0;
    } else {}*/
    for (itemIdex = 0, len = car.shopItem.length; itemIdex < len; itemIdex++) {
        if (car.shopItem[itemIdex].itemStockId == uid) {
            if(car.shopItem[itemIdex].itemId == itemId){
                total+=count;
                flag = true;
            }else{
                total += car.shopItem[itemIdex].itemCount;
            }
        }
    }
    if (!flag) {total+=count;}
    if(total>=itemStock) {
        $(exports).trigger('features.stockTight',{sid:uid,num:itemStock});
    } else if(total<itemStock){
        $(exports).trigger('features.stockNormal',uid);
    }
    if (total>itemStock) {
        return count+itemStock-total;
    }else{
        return count;
    }
    //localStore.set(localKey,_stock);
}
//针对多套餐刷新库存量
//stock"prodoct_id"s = 5
function setSetmealItemStock(count,selectD,stock) {
    var _uid = selectD.basic.id;
    var localKey = "stock_" + _uid + "s";
    var _stock = parseInt(localStore.get("stock_"+_uid+"s"));
    if(_stock == 0 || _stock) {
        _stock = _stock-count;
    } else {
        _stock = stock-count;
    }
    localStore.set(localKey,_stock);
}
//针对多属性转换
function adaptFeatureForServer(pid,pqa,selectD) {
    if(!selectD)return;
    var _data = {product_id:selectD.itemId, product_quantity:pqa,feature_id:[]};
    for(var i in selectD.select){
        if(i=="规格"){_data.product_id =selectD.select[i].id;continue;}
        _data.feature_id.push(selectD.select[i].id)
    }
    return $.extend({},_data);
}
//针对套餐转换
function adaptSetMealForServer(pid,pqa,selectD) {
    var me = this;
    if(!selectD)return;
    var _data = {product_id:selectD.basic.id, product_quantity:pqa,groupons:[]},
        tmpGrps,
        tmpDish,
        selectTmp;
    for(var i in selectD.data){
        if(!selectD.data[i].total || !selectD.data[i].total.count){continue;}
        tmpGrps = {"dish_group_id":i,"ids":[]};
        for(var ix in selectD.data[i]){
            if(ix=="total"){continue;}
            selectTmp = selectD.data[i][ix];
            if(!selectTmp.count){continue;}
            //如果有features，则认为是多属性
            if(selectTmp.features && selectTmp.features.length){
                var tmpArr = $.extend([],selectTmp.features);
                //有realId，处理一下多规格
                if(selectTmp.realId){
                    tmpArr.splice($.inArray(selectTmp.realId,tmpArr),1);
                    tmpDish = {product_id:selectTmp.realId,product_quantity:selectTmp.count,feature_id:tmpArr};
                }else{
                    //多属性的菜，移除与属性相连的id
                    tmpDish = {product_id:ix,product_quantity:selectTmp.count,feature_id:tmpArr};
                }
            }else{
                tmpDish = {product_id:ix,product_quantity:selectTmp.count};
            }
            tmpGrps.ids.push($.extend({},tmpDish));
        }
        _data.groupons.push($.extend({},tmpGrps));
    }
    return $.extend({},_data);
}
/**
 * 优惠信息
 */
var premium = {
    url: '/waimai/trade/getorderprice',
    timer: null,
    delay: 200,
    recount: 3,
    restore: function() {
        /**
         * 如果请求失败，触发失败事件
         */
        $(exports).trigger('failpremium.shopCar');
    },
    retry: function(ret) {
        var me = this;
        ret = ret || 0;
        if (ret < me.recount) {
            clearTimeout(me.timer);
            me.timer = setTimeout(function() {
                $.ajax({
                url: me.url,
                data: me.params,
                type:"post",
                dataType: 'json',
                success: function(data) {
                    if (data.error_no == 0) {
                        var prices = data.result.order_info,
                            discounts = data.result.discount_info;
                        $(exports).trigger('premium.shopCar', {prices: prices, discounts: discounts});
                    } else if(data.error_no){
                        if(!data.error_msg){
                            data.error_msg = "餐厅太忙，暂时不能接单";
                        }
                        alertDialog.alert(data);
                        me.restore();
                    } else {
                        //$(exports).trigger('failpremium.errorNo',data);
                        me.restore();
                    }
                },
                error: function() {
                    //alertDialog.alert({error_msg:"fuuuuuuuuckkkkkk"});
                    me.retry(++ret);
                }
            })
            }, me.delay);
        } else {
            me.restore();
        }
    },
    get: function(params) {
        var me = this;
        me.params = params;
        me.retry();
        // $(exports).trigger('resetpremium.shopCar');
    },
    JSONStringify: function(obj) {
        return JSON.stringify(obj);
    },
    adaptParam: function(shopid, products) {
        var me = this,
            pds = [];
        for (var i in products) {
            var pid = products[i].itemId,
                pqa = products[i].itemCount;
            //针对套餐进行扩展
            if(products[i].itemDishType && (products[i].itemDishType==2 || products[i].itemDishType=="attr")){
                // || cookie.get('s' + products[i].itemId + 's');
                // 把cookie存储变为localstorage
                var grpsData = localStore.get('s' + pid + 's') || JSON.parse(cookie.get('s' + pid + 's'));
                if(products[i].itemDishType==2){
                    //setSetmealItemStock(pqa,grpsData,products[i].itemStock);
                    pds.push(adaptSetMealForServer(pid,pqa,grpsData));
                }else{
                    //setFeatureItemStock(pid,pqa,grpsData,products[i].itemCount);
                    pds.push(adaptFeatureForServer(pid,pqa,grpsData));
                }
            }else{
                pds.push({product_id:pid, product_quantity:pqa});
            }
        }
        return {shop_id: shopid, products: me.JSONStringify(pds)};
        // return {shop_id: '4001211165899931825', products: '[{"product_id":"12247553446674325761","product_quantity":"5"}]'};
    }
};

exports = module.exports = {
    fetchPremium: function() {
         /**
         * 获取优惠信息
         */
         var params = premium.adaptParam(this.getCurShopId(), this.getCarItems());
         premium.get(params);
    },
    fetchItems: function() {
        return premium.adaptParam(this.getCurShopId(), this.getCarItems());
    },
    /**
     * 添加菜品或设置菜品数量
     * @param {
     *     itemId  菜品ID
     *     itemCount   菜品数量
     *     itemName    菜品名称    可以为空
     *     itemPrice   菜品价格    可以为空
     * }
     * */
    setCarItem: function(item) {
        var curItem, itemIdex;
        item.itemPrice && (item.itemPrice = formatPrice(item.itemPrice));
        for (itemIdex = 0, len = car.shopItem.length; itemIdex < len; itemIdex++) {
            if (car.shopItem[itemIdex].itemId == item.itemId) {
                curItem = car.shopItem[itemIdex];
                break;
            }
        }
        item.itemCount = parseInt(item.itemCount,10);
        if(item.type == "append" && curItem){
            item.itemCount += curItem.itemCount || 0;
        }
        //curItem && $.extend(item,curItem);
        /**
         * 如果item有selectFeatures属性，则判定为多规格;把相应数据存到cookie中
         */
        try{
           if(item.selectFeatures || (curItem && curItem.itemDishType=="attr")){
                item = $.extend(curItem || {},item);
                item.itemStockId = item.itemStockId || item.selectFeatures.itemId;
                //修改了库存，重置目前库存状态
                item.itemCount = setFeatureItemStock(item.itemId,item.itemStockId,item.itemCount,item.itemStock);
                if(item.itemCount<0)return;
                if(item.selectFeatures){
                    localStore.set('s' + item.itemId + 's',item.selectFeatures);
                    /*cookie.setRaw('s' + item.itemId + 's', JSON.stringify(item.selectFeatures), {
                        path: '/'
                    });*/
                }
            } 
        }catch(e){}
        
        /*
         * 如果是套餐，把库存信息存储
         */
        if(item.itemDishType=="2" || (curItem && curItem.itemDishType=="2")){
            item = $.extend(curItem || {},item);
            item.itemStockId = item.itemStockId || item.orignItemId;
            item.itemCount = setFeatureItemStock(item.itemId,item.itemStockId,item.itemCount,item.itemStock);
        }
        /*curItem 有值说明购物车已经存在 直接 +或者- ，否则 在购物车插入新的条目
          同时curItem 与 car.shopItem[itemIdex] 指向同一值
        */
        if (curItem) {
            $.extend(curItem, item);
            //如果剩余数量小于最低起订份数 删除菜品
            if (curItem.itemCount < curItem.minOrderNumber) {
                car.shopItem.splice(itemIdex, 1);
                $(exports).trigger("delete.shopCar", curItem);
                //多规格和套餐的cookie清理
                if(curItem.itemDishType==2 || curItem.selectFeatures){
                    var _date = new Date();
                    _date.setFullYear(_date.getFullYear() - 1);
                   
                    localStore.remove('s' + curItem.itemId + 's');
                    //cookie.remove('s' + curItem.itemId + 's');
                }
                
            } else {
                if($("#source_name").val() && $("#source_name").val() == "baidu"){
                    if(curItem.itemCount >= curItem.itemStock){
                        curItem.itemCount = curItem.itemStock;
                    }
                }
                $(exports).trigger("update.shopCar", curItem);
            }
        } else {
            if (!item.itemName) return;
            //多规格菜品在增加时 需要判断的逻辑
            if($("#source_name").val() && $("#source_name").val() == "baidu"){
                if(!item.itemStock || !item.itemCount)return;
                if(parseInt(item.itemStock) < parseInt(item.minOrderNumber))return;
                if(item.itemCount < item.minOrderNumber){
                    item.itemCount = item.minOrderNumber;
                }
                if(item.itemCount > item.itemStock){
                    item.itemCount = item.itemStock;
                }
            }
            car.shopItem.push(item);
            $(exports).trigger("add.shopCar", item);
        }
        //如果购物车shopItem为空 触发清空操作
        if (car.shopItem.length == 0) {
            $(exports).trigger("clear.shopCar");
        }

        saveShopCar();
    },
    /**
     * 设置当前商户信息
     * @shopName    商户名称
     * */
    setCurShopInfo: function(shopId, shopName, deliveryFee, takeOutPrice) {
        // 如果不存在，添加基本信息
        if (!car) {
            car = {};
        }
        car.shopId = shopId || car.shopId;
        car.shopName = shopName || car.shopName;
        car.deliveryFee = deliveryFee || car.deliveryFee;
        car.takeOutPrice = takeOutPrice || car.takeOutPrice;
    },
    /**
     * 获取当前商家的id以及名称
     * {
     *      shopId:
     *      shopName:
     * }
     * */
    getCurShopName: function() {
        return car.shopName;
    },
    /**
     * 获取商户ID
     * */
    getCurShopId: function() {
        return car.shopId;
    },
    /**
     * 获取当前商家的购物车明细
     * [
     *      {
     *          itemId:
     *          itemCount:
     *          itemName:
     *          itemPrice:
     *      }
     * ]
     * */
    getCarItems: function() {
        return car.shopItem;
    },
    /**
     * 清空购物车
     * */
    clearCar: function(isCommitOrder) {
        car.shopItem = [];
        saveShopCar(); !! !isCommitOrder && $(exports).trigger("clear.shopCar");
    },
    /**
     * 初始化购物车数据
     * */
    init: function(shopId) {
        curShopId = shopId + "";
        initCar();
        var me = this;
        // 增加延时，订单确认页面取不到菜品
        setTimeout(function() {
            $(exports).trigger("inited.shopCar", car);
            /**
             * 初始化时获取优惠信息
             */
        }, 0);
    },
    /**
     * 获取总金额
     * */
    getAmount: function() {
        var amount = 0,
            packFee = 0;

        $.each(car.shopItem, function(i, item) {
            packFee += item.packCount * item.packPrice * item.itemCount;
            amount += item.itemCount * item.itemPrice;
        });
        return {
            deliveryFee: formatPrice(car.deliveryFee),
            packFee: formatPrice(packFee),
            productAmount: formatPrice(amount),
            amount: formatPrice(amount + packFee + parseFloat(car.deliveryFee)),
            takeOutPrice: formatPrice(car.takeOutPrice),
            cha: formatPrice(car.takeOutPrice - amount - packFee),
            isEmpty: car.shopItem.length == 0
        }
    },
    /**
     * 购物车是否为空
     * */
    isEmpty: function() {
        if (car && car.shopItem.length > 0)
            return false;
        else
            return true;
    },
    /*
    * 重置购物车 发生于刷新选菜页面 确认订单页面
    */
    resetCar: function(shopItem){
        car.shopItem = shopItem;
        saveShopCar();
    },
    adaptSetMealForServer:adaptSetMealForServer,
    adaptFeatureForServer:adaptFeatureForServer,
    clearData:clearData
}; 
});
;define('bigba:static/utils/CookieDataCenter.js', function(require, exports, module){ /**
 * @require bigba:static/plugin/json-2.3.js
 */
var cookie = require("bigba:static/utils/Cookie.js"),
    util = require("bigba:static/util.js"),
    dayTime = 24 * 60 * 60 * 1000, // 一天的毫秒数
    todayTime = new Date().getTime(), // 截止今天的毫秒数
    Const;
Const = {
    COOKIE_CITY_KEY: 'wm_city', // city 存储的key值
    COOKIE_CITY_EXPIRES: todayTime + dayTime * 5000, // 过期时间
    COOKIE_ADDR_KEY: 'wm_addr', // addr 存储的key值
    COOKIE_ADDR_EXPIRES: todayTime + dayTime * 7, // addr过期时间
    // 城市默认值
    DEFAULT_CITY: {
        code: 131,
        name: '北京'
    },
    // 城市支持，定位到不支持的城市
    CITY_SUPPORT: {
        // 北京
        131: 1,
        // 天津
        // 332: 1,
        // 上海
        289: 1,
        // 杭州
        179: 1,
        // 南京
        315: 1,
        // 苏州
        224: 1
    },
    DEFAULT_PATH: '/'
};
module.exports = {
    /**
     * 初始化cookie city
     */
    initCity: function() {
        var c = this.getCity(Const.COOKIE_CITY_KEY);
        // if (!Const.CITY_SUPPORT[c.code]) {
        if (!c || !c.code) {
            this.setCity(Const.DEFAULT_CITY);
        }
    },
    /**
     * 设置city到cookie
     * @param {Object} city  city信息
     * @city.code {Number} 城市代码
     * @city.code {String} 城市名称
     */
    setCity: function(city) {
        if(!city || !city.name){
            return;
        }
        var v = encodeURIComponent(JSON.stringify(city));
        cookie.setRaw(Const.COOKIE_CITY_KEY, v, {
            expires: Const.COOKIE_CITY_EXPIRES,
            path: Const.DEFAULT_PATH
        });
    },
    /**
     * cookie中获取city, 默认返回北京
     */
    getCity: function() {
        var v = decodeURIComponent(cookie.getRaw(Const.COOKIE_CITY_KEY));
        //此处有bug，已经更正
        //return JSON.parse(v) || Const.DEFAULT_CITY;
        var rs = JSON.parse(v);
        return this.isEmpty(rs) ? Const.DEFAULT_CITY : rs;
    },
    /**
     * 设置地址到cookie
     * @param {Object} addr  addr信息
     * @addr.address {Number} 城市代码
     * @addr.lat {Number} 经度
     * @addr.lng {Number} 纬度
     */
    setAddr: function(addr) {
        if (!addr.address) {
            return;
        }
        var tempAddr = {};
        tempAddr.address = util.encodeHTML(decodeURIComponent(addr.address));
        tempAddr.lat = addr.lat;
        tempAddr.lng = addr.lng;
        var v = encodeURIComponent(JSON.stringify(tempAddr));
        cookie.setRaw(Const.COOKIE_ADDR_KEY, v, {
            expires: Const.COOKIE_ADDR_EXPIRES,
            path: Const.DEFAULT_PATH
        });
    },
    /**
     * cookie中获取city, 默认返回北京
     */
    getAddr: function() {
        var v = decodeURIComponent(cookie.getRaw(Const.COOKIE_ADDR_KEY));
        return JSON.parse(v);
    },
    /**
    * 判断对象是否为空
    */
    isEmpty: function(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }
}; 
});
;define('bigba:static/utils/GlobalTips.js', function(require, exports, module){ /**
 * 全局信息提示框
 * @author jason.zhou
 * @date 2014-02-20
 */
var FixElement,
    fix,
    fixEl,
    timerid,
    TIMEOUT = 3000,    // 停留时间
    HEADER_HEIGHT = 82;
    SELF_HEIGHT = 45;// 顶部高度

FixElement = require("jsmod/ui/fixElement");

fix = new FixElement('<div class="global-tips"><span class="gt-msg"></span></div>', {
    targetType: 'top',
    zIndex: 3000,
    preventShow: true
});

fixEl = fix.getElement();

/**
 * 隐藏
 */
function fixHide() {
    timerid && clearTimeout(timerid);
    fix.fixTo("#content", "top", {top: 0});
    fix.hide();
}
/**
 * 显示
 */
function fixShow(pos) {
    var stop = $(window).scrollTop();
    var topV = stop > HEADER_HEIGHT ? (stop - HEADER_HEIGHT + SELF_HEIGHT + 20) : (SELF_HEIGHT + 1);
    var posParam = {top: topV};
    if (pos === 'top') {
        posParam = {top: stop}
    }
    fix.show();
    fix.fixTo("#content", "top", posParam);
}

$(window).on('scroll.globaltips', function() {
    fixHide();
});

// 添加close事件
$('.global-tips .close-btn').on('click', function() {
    fixHide();
});

module.exports = {
    tip : function(msg, pos) {
        timerid && clearTimeout(timerid);
        fixEl.find('.gt-msg').html(msg);

        fix.redraw();
        fixShow(pos);

        timerid = setTimeout(function() {
            fixHide();
        }, TIMEOUT);
    },
    topTip: function(msg, mask) {
        if (mask) {
            fixEl.addClass('reverse');
        } else {
            fixEl.removeClass('reverse')
        }
        this.tip(msg, 'top');
    },
    hide: function() {
        fixHide();
    }
};
 
});
;define('bigba:static/utils/LocalDataCenter.js', function(require, exports, module){ var store = require("bigba:static/utils/store.js"),
    util = require("bigba:static/util.js");

module.exports = {
	eLength: 5,
	schema: ["address", "lat", "lng"],
	key: "LocalDataCenter",
	/**
	 * Add new item to localStorage, the item info is based on the url which contains "address&lat&lng".
	 * @param {Object} params  Item information, use "util.getParams()"" to create one
	 */
	add: function(params) {
		var me = this,
			allE = store.get(me.key) || [];
		// If valid
		if (!me._validate(params)) {
			return;
		}
		params.address = encodeURIComponent(util.encodeHTML(decodeURIComponent(params.address)));
		// If params has been stored
		for (var i in allE) {
			var el = allE[i];
			if (me._equal(params, el)) {
				return;
			}
		}
		allE.unshift(params);
		allE = me._cut(allE);
		store.set(me.key, allE);
	},
	/**
	 * Get all the stored items from localstorage with the limited length of "this.eLength"
	 * @return {Array}  All stored items 
	 */
	getAll: function() {
		return this._cut(store.get(this.key));
	},
	/**
	 * Check if "obj" is valid using "this.schema"
	 * @private
	 * @param  {Object}  obj  
	 * @return {Boolean}  Return true if "obj" is valid and vice versa
	 */
	_validate: function(obj){
		var result = true;
		for (var i in this.schema) {
			result = result && obj[this.schema[i]];
		}
		return result;
	},
	/**
	 * Keep the "allE" with the length of "this.eLength"
	 * @private
	 * @param  {Array} allE  Input array
	 * @return {Array}       Output array
	 */
	_cut: function(allE){
		while (allE && allE.length > this.eLength) {
			allE.pop();
		}
		return allE;
	},
	/**
	 * Check whether too objects equal each other on "this.schema"
	 * @private
	 * @param  {Object} a 
	 * @param  {Object} b 
	 * @return {Boolean}   Return true if a equals b and vice versa
	 */
	_equal: function(a, b) {
		return a && b && this._serialize(a) === this._serialize(b);
	},
	/**
	 * Serialize "el" on the basis of "this.schema"
	 * @private
	 * @param  {Object} el Input object
	 * @return {String}    Output String
	 */
	_serialize: function(el) {
		var result = '';
		for (var i in el) {
			if (el.hasOwnProperty(i)) {
				result += el[i];
			}
		}
		return result;
	}
}; 
});
;define('bigba:static/utils/SlidePlayer.js', function(require, exports, module){ /**
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
;define('bigba:static/utils/Template.js', function(require, exports, module){ /**
 * @file Template.
 * @author <a href="jason:zhoujiancheng@baidu.com">jason.zhou</a>
 * @version 1.0
 * @date 2013.07.23
 */

/**
 * @module static/utils/Template
 */

// 自定义分隔符
var LEFT_DELIMITER = '<&',
    RIGHT_DELIMITER = '&>',

    // List of HTML entities for escaping.
    htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    },

    // Regex containing the keys listed immediately above.
    htmlEscaper = /[&<>"'\/]/g,

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    templateSettings = {
        evaluate: new RegExp(LEFT_DELIMITER + '([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        interpolate: new RegExp(LEFT_DELIMITER + '=([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        escape: new RegExp(LEFT_DELIMITER + '-([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        // 扩展，增加数据不为空时的判断，如果数据不为空当前行不显示
        interpolateNonEmpty: new RegExp(LEFT_DELIMITER + '#([\\s\\S]+?)' + RIGHT_DELIMITER, 'g')
    },

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    noMatch = /.^/,

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    escapes = {
        '\\': '\\',
        "'": "'",
        r: '\r',
        n: '\n',
        t: '\t',
        u2028: '\u2028',
        u2029: '\u2029'
    },

    escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
    unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

// 初始化escapes
for (var key in escapes) {
    escapes[escapes[key]] = key;
}

// Escape a string for HTML interpolation.
function escape(string) {
    return ('' + string).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
    });
}
    // Within an interpolation, evaluation, or escaping, remove HTML escaping
    // that had been previously added.
function unescape(code) {
    return code.replace(unescaper, function(match, escape) {
        return escapes[escape];
    });
}

// Fill in a given object with default properties.
function apply(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
}

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
/**
 * 扩展Underscore template
 * 增加了一种新的描述符<pre><&# value &></pre>用此描述符时，如果其内容为空则此描述符所在的行或所在的数组索引不显示写模板的时候要特别注意
例如：
<pre>
    &lt;ul&gt;
    <&for(var i = 0; i < test.length; i++) {&>
        &lt;li><&#test[i].name&>&lt;/li&gt;
    <&}&>
    &lt;/ul&gt;        
    相当于
    &lt;ul&gt;
    <&for(var i = 0; i < test.length; i++) {&>
        <& if (test[i].name) {&>
            &lt;li&gt;<&=test[i].name&>&lt;/li&gt;
        <& } &>
    <&}&>
    &lt;/ul&gt; 
</pre>
 * 
 * @param {String|Array} text html模版或元素id
 * @param {object} data 对应模版的数据模型
 * @returns {String|compiledFunction} html字符串或编译后的js方法
 * @example
数据：
<pre>
var data = {
    test: [{
        name:'zhang&nbsp;san'
    },{
        name:'lisi'
    },{
    },{
        name:null
    }]
};
</pre>
模版1：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&#test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
模版2：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&=test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
模版3：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&-test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
// require Template 模块
var tpl = require("common:static/utils/Template.js");
tpl('tpl1', data);
tpl('tpl2', data);
tpl('tpl3', data);
输出结果分别是
结果1：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
&lt;/ul&gt;
</pre>
结果2：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
结果3：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang&nbsp;san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
 */
module.exports = function(text, data, options) {
    var element,
        settings;
    if (Object.prototype.toString.call(text) == '[object String]') {
        var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
        if (element = document.getElementById(text)) {
            text = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
        }
        text = text.replace(trimer, '');
        text = text.split('\n');
    }
    // 查询数据第一项目，如果符合条件则添加if判断 by jason
    // 增加如果本行有多个描述符，则添加多层if判断
    if (Object.prototype.toString.call(text) == '[object Array]') {
        for (var i = 0, t; t = text[i]; i++) {
            var ifFilter = []; // if 条件
            t.replace(templateSettings.interpolateNonEmpty, function(match, code){
                ifFilter.push(code);
            });
            if (ifFilter.length > 0) {
                text.splice(i, 1, LEFT_DELIMITER + ' if ('+ifFilter.join("&&")+') { ' + RIGHT_DELIMITER + t + LEFT_DELIMITER + ' } ' + RIGHT_DELIMITER);
            }
        }
    }
    text = text.join('');
    settings = apply(settings || {}, templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p.push('" + text.replace(escaper, function(match) {
            return '\\' + escapes[match];
        }).replace(settings.escape || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__.escape(__t))+\n'";
        }).replace(settings.interpolate || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.interpolateNonEmpty || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.evaluate || noMatch, function(match, code) {
            return "');\n" + unescape(code) + "\n__p.push('";
        }) + "');\n";

        // "for(var __i in opts) {if(opts.hasOwnProperty(__i)){if(obj[__i]){throw new Error('key[' +__i+'] Already exists');}obj[__i] = opts[__i];}}\n"

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' 
            + source 
        + '}\n';

        source = "var __t,__p=[],__j=Array.prototype.join," 
        + "print=function(){__p.push(__j.call(arguments,''))};\n" 
        + source 
        + "return __p.join('');\n";

    var render = new Function(settings.variable || 'obj', '__', source),
        // 模版编译后传入的参数
        opts = {
            '__escape': escape
        };
    _.extend(opts, options || {});   
    if (data) return render(data, opts);
    var template = function(data, _opts) {
        _.extend(opts, _opts);
        return render.call(this, data, opts);
    };

    // Provide the compiled function source as a convenience for precompilation.
    // template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
    
    return template;
}
 
});
;define('bigba:static/utils/timer.js', function(require, exports, module){ /**
 * 倒计时组件，提供页面倒计时显示及通知功能。
 *
 * <div data-role="timer" data-end="2014/9/25 10:00"></div>
 * new Timer({
 *		now:"2014/9/25 9:30",
 *		on:{
 *			end:function(nodes){
 *				nodes[0].node.style.display="none";
 *			}
 *		}
 * })
 */

(function(){
	var Utils = {
		tmpl: function(tmpl, data) {
			var reg = /\{([^\}]*)\}/g;

			return tmpl.replace(reg, function(m, k) {
				return (typeof data[k] !== "undefined") ? data[k] : "";
			});
		}
	}

	/**
	 * Timer构造函数
	 * @constructor
	 * @param container {String} optional 倒计时节点DOM容器，默认是document.body
	 * @param options {Object} 配置信息
	 */
	var Timer = function(container, options) {
		var me = this;

		me.nodeMapList = [];

		if ($.isPlainObject(container)) {
			options = container;
			options.container = $(document.body);
		} else {
			options = options || {};

			options.container = $(container);
		}

		me.options = $.extend({}, Timer.DEFAULTS, options);

		if (!me.paramsCheck()) {
			throw new Error("参数配置有误");
		}
		me.init();

		return me;
	}
	/**
	 * 精度枚举
	 */
	Timer.PRECISION = {
		day: "day",
		hour: "hour",
		minute: "minute",
		second: "second"
	}
	/**
	 * 默认配置
	 */
	Timer.DEFAULTS = {
		// 倒计时节点选择器（container内部的）
		selector: "[data-role='timer']",
		// 时钟步长，单位是秒，默认是1秒
		step: 1,
		// 当前时间戳
		now: 0,
		// 倒计时结束时间戳
		end: null,
		// 显示精度
		precision: Timer.PRECISION.second,
		// 倒计时显示模板
		timingTpl: "{days}天{hours}小时{minutes}分{seconds}秒",
		// 倒计时结束后的显示内容
		endTpl: "已结束"
	}
	Timer.prototype = {
		init: function() {
			var me = this,
				options = me.options,
				nodeList = $(options.selector, options.container),
				nodeMapList = me.nodeMapList,
				end;

			// 收集节点以及每个节点对应的剩余时间，方便后续处理
			nodeList.each(function(index, node) {
				end = node.getAttribute("data-end");
				if (!end) {
					//可以通过配置传入倒计时结束时间点，但节点中声明的结束时间的优先级高于配置传入的
					end=options.end>0?options.end:options.now;
				}
				nodeMapList.push({
					node: node,
					life: end - options.now
				});
			})

			//开始时钟循环
			me.loop();
		},
		/**
		 * 验证输入参数的合法性
		 * @method paramsCheck
		 * @return {boolean} 合法为true，否则为false
		 */
		paramsCheck: function() {
			var me = this,
				options = me.options,
				tmpNow,
				tmpEnd,
				emptyFn = function() {};

			options.now = options.now;
			options.end = options.end ? options.end : 0;
			options.step = parseInt(options.step);
			options.on = options.on || {};
			options.on.end = $.isFunction(options.on.end) ? options.on.end : emptyFn;


			if (!options.selector || !options.now || isNaN(options.step)) {
				return false;
			}

			//时钟步长至少为1000毫秒
			options.step = Math.max(options.step*1000, 1000);

			return true;
		},
		/**
		 * 时钟循环，当没有“活着”的节点时，将中断循环
		 */
		loop: function() {
			var me = this;

			clearTimeout(me.loopTimer);

			me.burn();
			me.filter();
			me.refresh();

			if (me.nodeMapList.length > 0) {
				me.loopTimer = setTimeout(function() {
					me.loop();
				}, me.options.step);
			}
		},
		/**
		 * 刷新显示倒计时
		 */
		refresh: function() {
			var me = this,
				timingTpl = me.options.timingTpl,
				endTpl = me.options.endTpl,
				nodeMapList = me.nodeMapList;

			$.each(nodeMapList, function(index, item) {
				item.node.innerHTML = Utils.tmpl(timingTpl, me.convertDate(item.life));
			});
		},
		/**
		 * 过滤掉已经“挂了”的倒计时，并触发响应的事件
		 */
		filter: function() {
			var me = this,
				liveMap = [],
				dieMap = [],
				options = me.options,
				nodeMapList = me.nodeMapList;

			$.each(me.nodeMapList, function(index, item) {
				if (item.life <= 0) {
					dieMap.push(item);
				} else {
					liveMap.push(item);
				}
			});

			if (dieMap.length > 0) {
				me.onEnd(dieMap);
			}

			//更新节点池
			me.nodeMapList = liveMap;
		},
		/**
		 * 时间燃尽处理
		 */
		burn: function() {
			var me = this,
				options = me.options,
				nodeMapList = me.nodeMapList;

			$.each(nodeMapList, function(index, item) {
				item.life -= options.step;
			});
		},
		/**
		 * 将毫秒转换为天、时、分、秒，precision配置参数会影响对应的值
		 * @method convertDate
		 * @param ms {Number} 毫秒值
		 * @return {days:天,hours:小时,minutes:分钟,seconds:秒}
		 */
		convertDate: function(ms) {
			var precision = this.options.precision,
				secondFactor = 1000,
				minuteFactor = secondFactor * 60,
				hourFactor = minuteFactor * 60,
				dayFactor = hourFactor * 24,
				day = 0,
				hour = 0,
				minute = 0,
				second = 0;

			switch (precision) {
				case Timer.PRECISION.day:
					day = parseInt(ms / dayFactor);
					break;
				case Timer.PRECISION.hour:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					break;
				case Timer.PRECISION.minute:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					minute = parseInt((ms % hourFactor) / minuteFactor);
					break;
				case Timer.PRECISION.second:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					minute = parseInt((ms % hourFactor) / minuteFactor);
					second = parseInt((ms % minuteFactor) / secondFactor);
					break;
			}

			return {
				days: day,
				hours: hour,
				minutes: minute,
				seconds: second
			}
		},
		/**
		 * 重启container节点中的倒计时
		 * @method restart
		 * @param node {String} 倒计时节点选择器
		 * @param now {String} 当前时间的Timestamp
		 * @param end {String} 结束时间的Timestamp
		 */
		restart: function(nodeSeler, now, end) {
			var me = this,
				node,
				nodeMap = {},
				nodeMapList = me.nodeMapList;

			node = $(nodeSeler, me.container)[0];

			if (!now || !end) {
				return;
			}

			nodeMap.node = node;
			nodeMap.life = end - now;

			if (nodeMap.life <= 0) {
				me.onEnd([nodeMap]);
			} else {

				for (var i = 0; i < nodeMapList.length; i++) {
					if (nodeMapList[i].node == node) {
						nodeMapList.splice(i, 1); //移除相同节点
						break;
					}
				}

				nodeMapList.push(nodeMap);

				me.loop();
			}

		},
		/**
		 * 倒计时结束后的处理
		 * @method onEnd
		 * @param nodeMap {Array} {node:节点,life:剩余时间}
		 */
		onEnd: function(nodeMap) {
			var me = this,
				endCallback = me.options.on.end;

			$.each(nodeMap, function(index, map) {
				map.node.innerHTML = me.options.endTpl;
			});

			endCallback(nodeMap);
		}
	}


	module.exports=Timer;
})();

 
});
;/**
 * 全局广播通知;
 * 严格的区分了频道与事件的概念
 *
 * @example
 *
 * A模块内监听'com.myTest'频道下的say事件
 * listener.on('com.myTest', 'say', function(d){alert(d);});
 *
 * B模块内触发'com.myTest'频道下的say事件
 * listener.trigger('com.myTest', 'say', 'Hello World!');
 */
(function() {
    var EXECTIME = 50, //连续执行时间，防止密集运算
        DELAY = 25;

    var that = {},
        timer = '',
        slice = [].slice,
        channelList = {}; //用于保存被注册过所有频道
    /**
     * 通知监听
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 事件响应
     * @param {Object} context 上下文环境
     */
    var on = function(channel, type, callback, context) {
        var curChannel = channelList[channel];
        if (!curChannel) {
            curChannel = channelList[channel] = {};
        }
        curChannel[type] = curChannel[type] || [];
        curChannel[type].push({
            'func': callback,
            'context': context || that
        });
    };

    /**
     * 通知监听, 执行一次后销毁
     * @param  {[type]}   channel  [description]
     * @param  {[type]}   type     [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   context  [description]
     * @return {[type]}            [description]
     */
    var once = function(channel, type, callback, context) {
        var _once = function() {
            that.off(channel, type, _once);
            return callback.apply(context || that, arguments);
        };
        on(channel, type, _once, context);
    };

    /**
     * 事件触发
     * @param {String} channel
     * @param {String} type
     * @param {Object} data 要传递给相应函数的实参
     */
    var trigger = function(channel, type, data) {
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var curHandlers = [];
            for (var i = taskList.length; i--;) {
                curHandlers.push({
                    'handler': taskList[i],
                    'args': slice.call(arguments, 1)
                });
            }
            (function() {
                var start = +new Date();
                do {
                    var curTask = curHandlers.shift(),
                        handler = curTask.handler;
                    try {
                        handler.func.apply(handler.context, curTask.args);
                    } catch (exp) {
                        //console.log('listener: One of ' + curTask['type'] + '`s function execute error!');
                    }
                } while (curHandlers.length && (+new Date() - start < EXECTIME));
                if (curHandlers.length > 0) {
                    setTimeout(arguments.callee, DELAY);
                }
            })();
        }
    };

    /**
     * 事件监听移除
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 要移除的事件响应函数句柄
     */
    var off = function(channel, type, callback, context) {
        context = context || that;
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var handler;
            for (var i = taskList.length; i--;) {
                handler = taskList[i];
                if (handler.func === callback && handler.context === context) {
                    taskList.splice(i, 1);
                }
            }
        }
    };

    that.on = on;
    that.once = once;
    that.trigger = trigger;
    that.off = off;

    window.listener = window.listener || that;
})();
;// Simple Set Clipboard System
// Author: Joseph Huckaby

var ZeroClipboard = {
	version: "1.0.7",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '/static/waimai/images/forapp/ZeroClipboard.swf', // URL to movie
	nextId: 1, // ID of next movie
	
	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				var classes = this.className.split(/\s+/);
				var idx = -1;
				for (var k = 0; k < classes.length; k++) {
					if (classes[k] == name) { idx = k; k = classes.length; }
				}
				if (idx > -1) {
					classes.splice( idx, 1 );
					this.className = classes.join(' ');
				}
				return this;
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},
	
	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},
	
	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client		
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},
	
	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},
	
	getDOMObjectPosition: function(obj, stopObj) {
		// get absolute coordinates for dom element
		var bodyScrollTop = $('body').scrollTop();
		var info = {
			left: 0, 
			top: 0, 
			width: obj.width ? obj.width : obj.offsetWidth, 
			height: obj.height ? obj.height : obj.offsetHeight
		};

		while (obj && (obj != stopObj)) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		info.top += bodyScrollTop;
		return info;
	},
	
	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};
		
		// unique ID
		this.id = ZeroClipboard.nextId++;
		this.movieId = 'ZeroClipboardMovie_' + this.id;
		
		// register client with singleton to receive flash events
		ZeroClipboard.register(this.id, this);
		
		// create movie
		if (elem) this.glue(elem);
	}
};

ZeroClipboard.Client.prototype = {
	
	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	
	glue: function(elem, appendElem, stylesToAdd) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard.$(elem);
		
		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 9999;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}
		
		if (typeof(appendElem) == 'string') {
			appendElem = ZeroClipboard.$(appendElem);
		}
		else if (typeof(appendElem) == 'undefined') {
			appendElem = document.getElementsByTagName('body')[0];
		}
		
		// find X/Y position of domElement
		var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);
		
		// create floating DIV above element
		this.div = document.createElement('div');
		this.div.id = 'flashCopy';
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '' + box.left + 'px';
		style.top = '' + box.top + 'px';
		style.width = '' + box.width + 'px';
		style.height = '' + box.height + 'px';
		style.zIndex = zIndex;
		
		if (typeof(stylesToAdd) == 'object') {
			for (addedStyle in stylesToAdd) {
				style[addedStyle] = stylesToAdd[addedStyle];
			}
		}
		
		// style.backgroundColor = '#f00'; // debug
		
		appendElem.appendChild(this.div);
		
		this.div.innerHTML = this.getHTML( box.width, box.height );
	},
	
	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id + 
			'&width=' + width + 
			'&height=' + height;
			
		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},
	
	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},
	
	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},
	
	destroy: function() {
		// destroy control and floater
		if (this.domElement && this.div) {
			this.hide();
			this.div.innerHTML = '';
			
			var body = document.getElementsByTagName('body')[0];
			try { body.removeChild( this.div ); } catch(e) {;}
			
			this.domElement = null;
			this.div = null;
		}
	},
	
	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard.$(elem);
			if (!this.domElement) this.hide();
		}
		
		if (this.domElement && this.div) {
			var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},
	
	setText: function(newText) {
		// set text to be copied to clipboard
		this.clipText = newText;
		if (this.ready) this.movie.setText(newText);
	},
	
	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) this.handlers[eventName] = [];
		this.handlers[eventName].push(func);
	},
	
	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) this.movie.setHandCursor(enabled);
	},
	
	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},
	
	receiveEvent: function(eventName, args) {
		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
				
		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}
				
				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}
				
				this.ready = true;
				this.movie.setText( this.clipText );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;
			
			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('hover');
					if (this.recoverActive) this.domElement.addClass('active');
				}
				break;
			
			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					this.domElement.removeClass('hover');
				}
				break;
			
			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;
			
			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName
		
		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];
			
				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
	
};

;/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.5
 *
 */
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null
        };
        //extend by boye.liu at 2014.8.3
        var updateTimer;
        function update() {
            var counter = 0;
            clearTimeout(updateTimer);
            updateTimer = setTimeout(function(){
                elements.each(function() {
                    var $this = $(this);
                    var self = this;
                    if (settings.skip_invisible && !$this.is(":visible")) {
                        return;
                    }
                    if ($.abovethetop(self, settings) ||
                        $.leftofbegin(self, settings)) {
                            /* Nothing. */
                    } else if (!$.belowthefold(self, settings) &&
                        !$.rightoffold(self, settings)) {
                            $this.trigger("appear");
                            /* if we found an image we'll load, reset the counter */
                            counter = 0;
                    } else {
                        if (++counter > settings.failure_limit) {
                            return false;
                        }
                    }
                });
            },500);

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function(event) {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            $self
                                .hide()
                                .attr("src", $self.data(settings.data_attribute))
                                [settings.effect](settings.effect_speed);
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function(event) {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

;/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

;/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = 'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;
	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));

;/*
 http://www.JSON.org/json2.js
 2010-03-20

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()   + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
    $.toJSON=JSON.stringify;
    $.evalJSON=JSON.parse;
}());

;/*
* Jssor 19.0
* http://www.jssor.com/
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/MIT
* 
* TERMS OF USE - Jssor
* 
* Copyright 2014 Jssor
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*! Jssor */

//$JssorDebug$
var $JssorDebug$ = new function () {

    this.$DebugMode = true;

    // Methods

    this.$Log = function (msg, important) {
        var console = window.console || {};
        var debug = this.$DebugMode;

        if (debug && console.log) {
            console.log(msg);
        } else if (debug && important) {
            alert(msg);
        }
    };

    this.$Error = function (msg, e) {
        var console = window.console || {};
        var debug = this.$DebugMode;

        if (debug && console.error) {
            console.error(msg);
        } else if (debug) {
            alert(msg);
        }

        if (debug) {
            // since we're debugging, fail fast by crashing
            throw e || new Error(msg);
        }
    };

    this.$Fail = function (msg) {
        throw new Error(msg);
    };

    this.$Assert = function (value, msg) {
        var debug = this.$DebugMode;
        if (debug) {
            if (!value)
                throw new Error("Assert failed " + msg || "");
        }
    };

    this.$Trace = function (msg) {
        var console = window.console || {};
        var debug = this.$DebugMode;

        if (debug && console.log) {
            console.log(msg);
        }
    };

    this.$Execute = function (func) {
        var debug = this.$DebugMode;
        if (debug)
            func();
    };

    this.$LiveStamp = function (obj, id) {
        var debug = this.$DebugMode;
        if (debug) {
            var stamp = document.createElement("DIV");
            stamp.setAttribute("id", id);

            obj.$Live = stamp;
        }
    };

    this.$C_AbstractProperty = function () {
        ///	<summary>
        ///		Tells compiler the property is abstract, it should be implemented by subclass.
        ///	</summary>

        throw new Error("The property is abstract, it should be implemented by subclass.");
    };

    this.$C_AbstractMethod = function () {
        ///	<summary>
        ///		Tells compiler the method is abstract, it should be implemented by subclass.
        ///	</summary>

        throw new Error("The method is abstract, it should be implemented by subclass.");
    };

    function C_AbstractClass(instance) {
        ///	<summary>
        ///		Tells compiler the class is abstract, it should be implemented by subclass.
        ///	</summary>

        if (instance.constructor === C_AbstractClass.caller)
            throw new Error("Cannot create instance of an abstract class.");
    }

    this.$C_AbstractClass = C_AbstractClass;
};

//$JssorEasing$
var $JssorEasing$ = window.$JssorEasing$ = {
    $EaseSwing: function (t) {
        return -Math.cos(t * Math.PI) / 2 + .5;
    },
    $EaseLinear: function (t) {
        return t;
    },
    $EaseInQuad: function (t) {
        return t * t;
    },
    $EaseOutQuad: function (t) {
        return -t * (t - 2);
    },
    $EaseInOutQuad: function (t) {
        return (t *= 2) < 1 ? 1 / 2 * t * t : -1 / 2 * (--t * (t - 2) - 1);
    },
    $EaseInCubic: function (t) {
        return t * t * t;
    },
    $EaseOutCubic: function (t) {
        return (t -= 1) * t * t + 1;
    },
    $EaseInOutCubic: function (t) {
        return (t *= 2) < 1 ? 1 / 2 * t * t * t : 1 / 2 * ((t -= 2) * t * t + 2);
    },
    $EaseInQuart: function (t) {
        return t * t * t * t;
    },
    $EaseOutQuart: function (t) {
        return -((t -= 1) * t * t * t - 1);
    },
    $EaseInOutQuart: function (t) {
        return (t *= 2) < 1 ? 1 / 2 * t * t * t * t : -1 / 2 * ((t -= 2) * t * t * t - 2);
    },
    $EaseInQuint: function (t) {
        return t * t * t * t * t;
    },
    $EaseOutQuint: function (t) {
        return (t -= 1) * t * t * t * t + 1;
    },
    $EaseInOutQuint: function (t) {
        return (t *= 2) < 1 ? 1 / 2 * t * t * t * t * t : 1 / 2 * ((t -= 2) * t * t * t * t + 2);
    },
    $EaseInSine: function (t) {
        return 1 - Math.cos(t * Math.PI / 2);
    },
    $EaseOutSine: function (t) {
        return Math.sin(t * Math.PI / 2);
    },
    $EaseInOutSine: function (t) {
        return -1 / 2 * (Math.cos(Math.PI * t) - 1);
    },
    $EaseInExpo: function (t) {
        return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
    },
    $EaseOutExpo: function (t) {
        return t == 1 ? 1 : -Math.pow(2, -10 * t) + 1;
    },
    $EaseInOutExpo: function (t) {
        return t == 0 || t == 1 ? t : (t *= 2) < 1 ? 1 / 2 * Math.pow(2, 10 * (t - 1)) : 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
    },
    $EaseInCirc: function (t) {
        return -(Math.sqrt(1 - t * t) - 1);
    },
    $EaseOutCirc: function (t) {
        return Math.sqrt(1 - (t -= 1) * t);
    },
    $EaseInOutCirc: function (t) {
        return (t *= 2) < 1 ? -1 / 2 * (Math.sqrt(1 - t * t) - 1) : 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    $EaseInElastic: function (t) {
        if (!t || t == 1)
            return t;
        var p = .3, s = .075;
        return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * 2 * Math.PI / p));
    },
    $EaseOutElastic: function (t) {
        if (!t || t == 1)
            return t;
        var p = .3, s = .075;
        return Math.pow(2, -10 * t) * Math.sin((t - s) * 2 * Math.PI / p) + 1;
    },
    $EaseInOutElastic: function (t) {
        if (!t || t == 1)
            return t;
        var p = .45, s = .1125;
        return (t *= 2) < 1 ? -.5 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * 2 * Math.PI / p) : Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * 2 * Math.PI / p) * .5 + 1;
    },
    $EaseInBack: function (t) {
        var s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    $EaseOutBack: function (t) {
        var s = 1.70158;
        return (t -= 1) * t * ((s + 1) * t + s) + 1;
    },
    $EaseInOutBack: function (t) {
        var s = 1.70158;
        return (t *= 2) < 1 ? 1 / 2 * t * t * (((s *= 1.525) + 1) * t - s) : 1 / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    $EaseInBounce: function (t) {
        return 1 - $JssorEasing$.$EaseOutBounce(1 - t)
    },
    $EaseOutBounce: function (t) {
        return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
    },
    $EaseInOutBounce: function (t) {
        return t < 1 / 2 ? $JssorEasing$.$EaseInBounce(t * 2) * .5 : $JssorEasing$.$EaseOutBounce(t * 2 - 1) * .5 + .5;
    },
    $EaseGoBack: function (t) {
        return 1 - Math.abs((t *= 2) - 1);
    },
    $EaseInWave: function (t) {
        return 1 - Math.cos(t * Math.PI * 2)
    },
    $EaseOutWave: function (t) {
        return Math.sin(t * Math.PI * 2);
    },
    $EaseOutJump: function (t) {
        return 1 - (((t *= 2) < 1) ? (t = 1 - t) * t * t : (t -= 1) * t * t);
    },
    $EaseInJump: function (t) {
        return ((t *= 2) < 1) ? t * t * t : (t = 2 - t) * t * t;
    }
};

var $JssorDirection$ = window.$JssorDirection$ = {
    $TO_LEFT: 0x0001,
    $TO_RIGHT: 0x0002,
    $TO_TOP: 0x0004,
    $TO_BOTTOM: 0x0008,
    $HORIZONTAL: 0x0003,
    $VERTICAL: 0x000C,
    //$LEFTRIGHT: 0x0003,
    //$TOPBOTOM: 0x000C,
    //$TOPLEFT: 0x0005,
    //$TOPRIGHT: 0x0006,
    //$BOTTOMLEFT: 0x0009,
    //$BOTTOMRIGHT: 0x000A,
    //$AROUND: 0x000F,

    $GetDirectionHorizontal: function (direction) {
        return direction & 0x0003;
    },
    $GetDirectionVertical: function (direction) {
        return direction & 0x000C;
    },
    //$ChessHorizontal: function (direction) {
    //    return (~direction & 0x0003) + (direction & 0x000C);
    //},
    //$ChessVertical: function (direction) {
    //    return (~direction & 0x000C) + (direction & 0x0003);
    //},
    //$IsToLeft: function (direction) {
    //    return (direction & 0x0003) == 0x0001;
    //},
    //$IsToRight: function (direction) {
    //    return (direction & 0x0003) == 0x0002;
    //},
    //$IsToTop: function (direction) {
    //    return (direction & 0x000C) == 0x0004;
    //},
    //$IsToBottom: function (direction) {
    //    return (direction & 0x000C) == 0x0008;
    //},
    $IsHorizontal: function (direction) {
        return direction & 0x0003;
    },
    $IsVertical: function (direction) {
        return direction & 0x000C;
    }
};

var $JssorKeyCode$ = {
    $BACKSPACE: 8,
    $COMMA: 188,
    $DELETE: 46,
    $DOWN: 40,
    $END: 35,
    $ENTER: 13,
    $ESCAPE: 27,
    $HOME: 36,
    $LEFT: 37,
    $NUMPAD_ADD: 107,
    $NUMPAD_DECIMAL: 110,
    $NUMPAD_DIVIDE: 111,
    $NUMPAD_ENTER: 108,
    $NUMPAD_MULTIPLY: 106,
    $NUMPAD_SUBTRACT: 109,
    $PAGE_DOWN: 34,
    $PAGE_UP: 33,
    $PERIOD: 190,
    $RIGHT: 39,
    $SPACE: 32,
    $TAB: 9,
    $UP: 38
};

// $Jssor$ is a static class, so make it singleton instance
var $Jssor$ = window.$Jssor$ = new function () {
    var _This = this;

    //#region Constants
    var REGEX_WHITESPACE_GLOBAL = /\S+/g;
    var ROWSER_OTHER = -1;
    var ROWSER_UNKNOWN = 0;
    var BROWSER_IE = 1;
    var BROWSER_FIREFOX = 2;
    var BROWSER_SAFARI = 3;
    var BROWSER_CHROME = 4;
    var BROWSER_OPERA = 5;
    //var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
    //#endregion

    //#region Variables
    var _Device;
    var _Browser = 0;
    var _BrowserRuntimeVersion = 0;
    var _BrowserEngineVersion = 0;
    var _BrowserJavascriptVersion = 0;
    var _WebkitVersion = 0;

    var _Navigator = navigator;
    var _AppName = _Navigator.appName;
    var _AppVersion = _Navigator.appVersion;
    var _UserAgent = _Navigator.userAgent;

    var _DocElmt = document.documentElement;
    var _TransformProperty;
    //#endregion

    function Device() {
        if (!_Device) {
            _Device = { $Touchable: "ontouchstart" in window || "createTouch" in document };

            var msPrefix;
            if ((_Navigator.pointerEnabled || (msPrefix = _Navigator.msPointerEnabled))) {
                _Device.$TouchActionAttr = msPrefix ? "msTouchAction" : "touchAction";
            }
        }

        return _Device;
    }

    function DetectBrowser(browser) {
        if (!_Browser) {
            _Browser = -1;

            if (_AppName == "Microsoft Internet Explorer" &&
                !!window.attachEvent && !!window.ActiveXObject) {

                var ieOffset = _UserAgent.indexOf("MSIE");
                _Browser = BROWSER_IE;
                _BrowserEngineVersion = ParseFloat(_UserAgent.substring(ieOffset + 5, _UserAgent.indexOf(";", ieOffset)));

                //check IE javascript version
                /*@cc_on
                _BrowserJavascriptVersion = @_jscript_version;
                @*/

                // update: for intranet sites and compat view list sites, IE sends
                // an IE7 User-Agent to the server to be interoperable, and even if
                // the page requests a later IE version, IE will still report the
                // IE7 UA to JS. we should be robust to self
                //var docMode = document.documentMode;
                //if (typeof docMode !== "undefined") {
                //    _BrowserRuntimeVersion = docMode;
                //}

                _BrowserRuntimeVersion = document.documentMode || _BrowserEngineVersion;

            }
            else if (_AppName == "Netscape" && !!window.addEventListener) {

                var ffOffset = _UserAgent.indexOf("Firefox");
                var saOffset = _UserAgent.indexOf("Safari");
                var chOffset = _UserAgent.indexOf("Chrome");
                var webkitOffset = _UserAgent.indexOf("AppleWebKit");

                if (ffOffset >= 0) {
                    _Browser = BROWSER_FIREFOX;
                    _BrowserRuntimeVersion = ParseFloat(_UserAgent.substring(ffOffset + 8));
                }
                else if (saOffset >= 0) {
                    var slash = _UserAgent.substring(0, saOffset).lastIndexOf("/");
                    _Browser = (chOffset >= 0) ? BROWSER_CHROME : BROWSER_SAFARI;
                    _BrowserRuntimeVersion = ParseFloat(_UserAgent.substring(slash + 1, saOffset));
                }
                else {
                    //(/Trident.*rv[ :]*11\./i
                    var match = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/i.exec(_UserAgent);
                    if (match) {
                        _Browser = BROWSER_IE;
                        _BrowserRuntimeVersion = _BrowserEngineVersion = ParseFloat(match[1]);
                    }
                }

                if (webkitOffset >= 0)
                    _WebkitVersion = ParseFloat(_UserAgent.substring(webkitOffset + 12));
            }
            else {
                var match = /(opera)(?:.*version|)[ \/]([\w.]+)/i.exec(_UserAgent);
                if (match) {
                    _Browser = BROWSER_OPERA;
                    _BrowserRuntimeVersion = ParseFloat(match[2]);
                }
            }
        }

        return browser == _Browser;
    }

    function IsBrowserIE() {
        return DetectBrowser(BROWSER_IE);
    }

    function IsBrowserIeQuirks() {
        return IsBrowserIE() && (_BrowserRuntimeVersion < 6 || document.compatMode == "BackCompat");   //Composite to "CSS1Compat"
    }

    function IsBrowserFireFox() {
        return DetectBrowser(BROWSER_FIREFOX);
    }

    function IsBrowserSafari() {
        return DetectBrowser(BROWSER_SAFARI);
    }

    function IsBrowserChrome() {
        return DetectBrowser(BROWSER_CHROME);
    }

    function IsBrowserOpera() {
        return DetectBrowser(BROWSER_OPERA);
    }

    function IsBrowserBadTransform() {
        return IsBrowserSafari() && (_WebkitVersion > 534) && (_WebkitVersion < 535);
    }

    function IsBrowserIe9Earlier() {
        return IsBrowserIE() && _BrowserRuntimeVersion < 9;
    }

    function GetTransformProperty(elmt) {

        if (!_TransformProperty) {
            // Note that in some versions of IE9 it is critical that
            // msTransform appear in this list before MozTransform

            Each(['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'], function (property) {
                if (elmt.style[property] != undefined) {
                    _TransformProperty = property;
                    return true;
                }
            });

            _TransformProperty = _TransformProperty || "transform";
        }

        return _TransformProperty;
    }

    // Helpers
    function getOffsetParent(elmt, isFixed) {
        // IE and Opera "fixed" position elements don't have offset parents.
        // regardless, if it's fixed, its offset parent is the body.
        if (isFixed && elmt != document.body) {
            return document.body;
        } else {
            return elmt.offsetParent;
        }
    }

    function toString(obj) {
        return {}.toString.call(obj);
    }

    // [[Class]] -> type pairs
    var _Class2type;

    function GetClass2Type() {
        if (!_Class2type) {
            _Class2type = {};
            Each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"], function (name) {
                _Class2type["[object " + name + "]"] = name.toLowerCase();
            });
        }

        return _Class2type;
    }

    function Each(obj, callback) {
        if (toString(obj) == "[object Array]") {
            for (var i = 0; i < obj.length; i++) {
                if (callback(obj[i], i, obj)) {
                    return true;
                }
            }
        }
        else {
            for (var name in obj) {
                if (callback(obj[name], name, obj)) {
                    return true;
                }
            }
        }
    }

    function Type(obj) {
        return obj == null ? String(obj) : GetClass2Type()[toString(obj)] || "object";
    }

    function IsNotEmpty(obj) {
        for(var name in obj)
            return true;
    }

    function IsPlainObject(obj) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        try {
            return Type(obj) == "object"
                && !obj.nodeType
                && obj != obj.window
                && (!obj.constructor || { }.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"));
        }
        catch (e) { }
    }

    function Point(x, y) {
        return { x: x, y: y };
    }

    function Delay(code, delay) {
        setTimeout(code, delay || 0);
    }

    function RemoveByReg(str, reg) {
        var m = reg.exec(str);

        if (m) {
            var header = str.substr(0, m.index);
            var tailer = str.substr(m.lastIndex + 1, str.length - (m.lastIndex + 1));
            str = header + tailer;
        }

        return str;
    }

    function BuildNewCss(oldCss, removeRegs, replaceValue) {
        var css = (!oldCss || oldCss == "inherit") ? "" : oldCss;

        Each(removeRegs, function (removeReg) {
            var m = removeReg.exec(css);

            if (m) {
                var header = css.substr(0, m.index);
                var tailer = css.substr(m.lastIndex + 1, css.length - (m.lastIndex + 1));
                css = header + tailer;
            }
        });

        css = replaceValue + (css.indexOf(" ") != 0 ? " " : "") + css;

        return css;
    }

    function SetStyleFilterIE(elmt, value) {
        if (_BrowserRuntimeVersion < 9) {
            elmt.style.filter = value;
        }
    }

    function SetStyleMatrixIE(elmt, matrix, offset) {
        //matrix is not for ie9+ running in ie8- mode
        if (_BrowserJavascriptVersion < 9) {
            var oldFilterValue = elmt.style.filter;
            var matrixReg = new RegExp(/[\s]*progid:DXImageTransform\.Microsoft\.Matrix\([^\)]*\)/g);
            var matrixValue = matrix ? "progid:DXImageTransform.Microsoft.Matrix(" + "M11=" + matrix[0][0] + ", M12=" + matrix[0][1] + ", M21=" + matrix[1][0] + ", M22=" + matrix[1][1] + ", SizingMethod='auto expand')" : "";

            var newFilterValue = BuildNewCss(oldFilterValue, [matrixReg], matrixValue);

            SetStyleFilterIE(elmt, newFilterValue);

            _This.$CssMarginTop(elmt, offset.y);
            _This.$CssMarginLeft(elmt, offset.x);
        }
    }

    // Methods

    _This.$Device = Device;

    _This.$IsBrowserIE = IsBrowserIE;

    _This.$IsBrowserIeQuirks = IsBrowserIeQuirks;

    _This.$IsBrowserFireFox = IsBrowserFireFox;

    _This.$IsBrowserSafari = IsBrowserSafari;

    _This.$IsBrowserChrome = IsBrowserChrome;

    _This.$IsBrowserOpera = IsBrowserOpera;

    _This.$IsBrowserBadTransform = IsBrowserBadTransform;

    _This.$IsBrowserIe9Earlier = IsBrowserIe9Earlier;

    _This.$BrowserVersion = function () {
        return _BrowserRuntimeVersion;
    };

    _This.$BrowserEngineVersion = function () {
        return _BrowserEngineVersion || _BrowserRuntimeVersion;
    };

    _This.$WebKitVersion = function () {
        DetectBrowser();

        return _WebkitVersion;
    };

    _This.$Delay = Delay;

    _This.$Inherit = function (instance, baseClass) {
        baseClass.call(instance);
        return Extend({}, instance);
    };

    function Construct(instance) {
        instance.constructor === Construct.caller && instance.$Construct && instance.$Construct.apply(instance, Construct.caller.arguments);
    }

    _This.$Construct = Construct;

    _This.$GetElement = function (elmt) {
        if (_This.$IsString(elmt)) {
            elmt = document.getElementById(elmt);
        }

        return elmt;
    };

    function GetEvent(event) {
        return event || window.event;
    }

    _This.$GetEvent = GetEvent;

    _This.$EvtSrc = function (event) {
        event = GetEvent(event);
        return event.target || event.srcElement || document;
    };

    _This.$EvtTarget = function (event) {
        event = GetEvent(event);
        return event.relatedTarget || event.toElement;
    };

    _This.$EvtWhich = function (event) {
        event = GetEvent(event);
        return event.which || [0, 1, 3, 0, 2][event.button] || event.charCode || event.keyCode;
    };

    _This.$MousePosition = function (event) {
        event = GetEvent(event);
        //var body = document.body;

        return {
            x: event.pageX || event.clientX/* + (_DocElmt.scrollLeft || body.scrollLeft || 0) - (_DocElmt.clientLeft || body.clientLeft || 0)*/ || 0,
            y: event.pageY || event.clientY/* + (_DocElmt.scrollTop || body.scrollTop || 0) - (_DocElmt.clientTop || body.clientTop || 0)*/ || 0
        };
    };

    _This.$PageScroll = function () {
        var body = document.body;

        return {
            x: (window.pageXOffset || _DocElmt.scrollLeft || body.scrollLeft || 0) - (_DocElmt.clientLeft || body.clientLeft || 0),
            y: (window.pageYOffset || _DocElmt.scrollTop || body.scrollTop || 0) - (_DocElmt.clientTop || body.clientTop || 0)
        };
    };

    _This.$WindowSize = function () {
        var body = document.body;

        return {
            x: body.clientWidth || _DocElmt.clientWidth,
            y: body.clientHeight || _DocElmt.clientHeight
        };
    };

    //_This.$GetElementPosition = function (elmt) {
    //    elmt = _This.$GetElement(elmt);
    //    var result = Point();

    //    // technique from:
    //    // http://www.quirksmode.org/js/findpos.html
    //    // with special check for "fixed" elements.

    //    while (elmt) {
    //        result.x += elmt.offsetLeft;
    //        result.y += elmt.offsetTop;

    //        var isFixed = _This.$GetElementStyle(elmt).position == "fixed";

    //        if (isFixed) {
    //            result = result.$Plus(_This.$PageScroll(window));
    //        }

    //        elmt = getOffsetParent(elmt, isFixed);
    //    }

    //    return result;
    //};

    //_This.$GetMouseScroll = function (event) {
    //    event = GetEvent(event);
    //    var delta = 0; // default value

    //    // technique from:
    //    // http://blog.paranoidferret.com/index.php/2007/10/31/javascript-tutorial-the-scroll-wheel/

    //    if (typeof (event.wheelDelta) == "number") {
    //        delta = event.wheelDelta;
    //    } else if (typeof (event.detail) == "number") {
    //        delta = event.detail * -1;
    //    } else {
    //        $JssorDebug$.$Fail("Unknown event mouse scroll, no known technique.");
    //    }

    //    // normalize value to [-1, 1]
    //    return delta ? delta / Math.abs(delta) : 0;
    //};

    //_This.$MakeAjaxRequest = function (url, callback) {
    //    var async = typeof (callback) == "function";
    //    var req = null;

    //    if (async) {
    //        var actual = callback;
    //        var callback = function () {
    //            Delay($Jssor$.$CreateCallback(null, actual, req), 1);
    //        };
    //    }

    //    if (window.ActiveXObject) {
    //        for (var i = 0; i < arrActiveX.length; i++) {
    //            try {
    //                req = new ActiveXObject(arrActiveX[i]);
    //                break;
    //            } catch (e) {
    //                continue;
    //            }
    //        }
    //    } else if (window.XMLHttpRequest) {
    //        req = new XMLHttpRequest();
    //    }

    //    if (!req) {
    //        $JssorDebug$.$Fail("Browser doesn't support XMLHttpRequest.");
    //    }

    //    if (async) {
    //        req.onreadystatechange = function () {
    //            if (req.readyState == 4) {
    //                // prevent memory leaks by breaking circular reference now
    //                req.onreadystatechange = new Function();
    //                callback();
    //            }
    //        };
    //    }

    //    try {
    //        req.open("GET", url, async);
    //        req.send(null);
    //    } catch (e) {
    //        $JssorDebug$.$Log(e.name + " while making AJAX request: " + e.message);

    //        req.onreadystatechange = null;
    //        req = null;

    //        if (async) {
    //            callback();
    //        }
    //    }

    //    return async ? null : req;
    //};

    //_This.$ParseXml = function (string) {
    //    var xmlDoc = null;

    //    if (window.ActiveXObject) {
    //        try {
    //            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //            xmlDoc.async = false;
    //            xmlDoc.loadXML(string);
    //        } catch (e) {
    //            $JssorDebug$.$Log(e.name + " while parsing XML (ActiveX): " + e.message);
    //        }
    //    } else if (window.DOMParser) {
    //        try {
    //            var parser = new DOMParser();
    //            xmlDoc = parser.parseFromString(string, "text/xml");
    //        } catch (e) {
    //            $JssorDebug$.$Log(e.name + " while parsing XML (DOMParser): " + e.message);
    //        }
    //    } else {
    //        $JssorDebug$.$Fail("Browser doesn't support XML DOM.");
    //    }

    //    return xmlDoc;
    //};

    function Css(elmt, name, value) {
        ///	<summary>
        ///		access css
        ///     $Jssor$.$Css(elmt, name);         //get css value
        ///     $Jssor$.$Css(elmt, name, value);  //set css value
        ///	</summary>
        ///	<param name="elmt" type="HTMLElement">
        ///		the element to access css
        ///	</param>
        ///	<param name="name" type="String">
        ///		the name of css property
        ///	</param>
        ///	<param name="value" optional="true">
        ///		the value to set
        ///	</param>
        if (value != undefined) {
            elmt.style[name] = value;
        }
        else {
            var style = elmt.currentStyle || elmt.style;
            value = style[name];

            if (value == "" && window.getComputedStyle) {
                style = elmt.ownerDocument.defaultView.getComputedStyle(elmt, null);

                style && (value = style.getPropertyValue(name) || style[name]);
            }

            return value;
        }
    }

    function CssN(elmt, name, value, isDimensional) {
        ///	<summary>
        ///		access css as numeric
        ///     $Jssor$.$CssN(elmt, name);         //get css value
        ///     $Jssor$.$CssN(elmt, name, value);  //set css value
        ///	</summary>
        ///	<param name="elmt" type="HTMLElement">
        ///		the element to access css
        ///	</param>
        ///	<param name="name" type="String">
        ///		the name of css property
        ///	</param>
        ///	<param name="value" type="Number" optional="true">
        ///		the value to set
        ///	</param>
        if (value != undefined) {
            isDimensional && (value += "px");
            Css(elmt, name, value);
        }
        else {
            return ParseFloat(Css(elmt, name));
        }
    }

    function CssP(elmt, name, value) {
        ///	<summary>
        ///		access css in pixel as numeric, like 'top', 'left', 'width', 'height'
        ///     $Jssor$.$CssP(elmt, name);         //get css value
        ///     $Jssor$.$CssP(elmt, name, value);  //set css value
        ///	</summary>
        ///	<param name="elmt" type="HTMLElement">
        ///		the element to access css
        ///	</param>
        ///	<param name="name" type="String">
        ///		the name of css property
        ///	</param>
        ///	<param name="value" type="Number" optional="true">
        ///		the value to set
        ///	</param>
        return CssN(elmt, name, value, true);
    }

    function CssProxy(name, numericOrDimension) {
        ///	<summary>
        ///		create proxy to access css, CssProxy(name[, numericOrDimension]);
        ///	</summary>
        ///	<param name="elmt" type="HTMLElement">
        ///		the element to access css
        ///	</param>
        ///	<param name="numericOrDimension" type="Number" optional="true">
        ///		not set: access original css, 1: access css as numeric, 2: access css in pixel as numeric
        ///	</param>
        var isDimensional = numericOrDimension & 2;
        var cssAccessor = numericOrDimension ? CssN : Css;
        return function (elmt, value) {
            return cssAccessor(elmt, name, value, isDimensional);
        };
    }

    function GetStyleOpacity(elmt) {
        if (IsBrowserIE() && _BrowserEngineVersion < 9) {
            var match = /opacity=([^)]*)/.exec(elmt.style.filter || "");
            return match ? (ParseFloat(match[1]) / 100) : 1;
        }
        else
            return ParseFloat(elmt.style.opacity || "1");
    }

    function SetStyleOpacity(elmt, opacity, ie9EarlierForce) {

        if (IsBrowserIE() && _BrowserEngineVersion < 9) {
            //var filterName = "filter"; // _BrowserEngineVersion < 8 ? "filter" : "-ms-filter";
            var finalFilter = elmt.style.filter || "";

            // for CSS filter browsers (IE), remove alpha filter if it's unnecessary.
            // update: doing _This always since IE9 beta seems to have broken the
            // behavior if we rely on the programmatic filters collection.
            var alphaReg = new RegExp(/[\s]*alpha\([^\)]*\)/g);

            // important: note the lazy star! _This protects against
            // multiple filters; we don't want to delete the other ones.
            // update: also trimming extra whitespace around filter.

            var ieOpacity = Math.round(100 * opacity);
            var alphaFilter = "";
            if (ieOpacity < 100 || ie9EarlierForce) {
                alphaFilter = "alpha(opacity=" + ieOpacity + ") ";
            }

            var newFilterValue = BuildNewCss(finalFilter, [alphaReg], alphaFilter);

            SetStyleFilterIE(elmt, newFilterValue);
        }
        else {
            elmt.style.opacity = opacity == 1 ? "" : Math.round(opacity * 100) / 100;
        }
    }

    function SetStyleTransformInternal(elmt, transform) {
        var rotate = transform.$Rotate || 0;
        var scale = transform.$Scale == undefined ? 1 : transform.$Scale;

        if (IsBrowserIe9Earlier()) {
            var matrix = _This.$CreateMatrix(rotate / 180 * Math.PI, scale, scale);
            SetStyleMatrixIE(elmt, (!rotate && scale == 1) ? null : matrix, _This.$GetMatrixOffset(matrix, transform.$OriginalWidth, transform.$OriginalHeight));
        }
        else {
            //rotate(15deg) scale(.5) translateZ(0)
            var transformProperty = GetTransformProperty(elmt);
            if (transformProperty) {
                var transformValue = "rotate(" + rotate % 360 + "deg) scale(" + scale + ")";

                //needed for touch device, no need for desktop device
                if (IsBrowserChrome() && _WebkitVersion > 535 && "ontouchstart" in window)
                    transformValue += " perspective(2000px)";

                elmt.style[transformProperty] = transformValue;
            }
        }
    }

    _This.$SetStyleTransform = function (elmt, transform) {
        if (IsBrowserBadTransform()) {
            Delay(_This.$CreateCallback(null, SetStyleTransformInternal, elmt, transform));
        }
        else {
            SetStyleTransformInternal(elmt, transform);
        }
    };

    _This.$SetStyleTransformOrigin = function (elmt, transformOrigin) {
        var transformProperty = GetTransformProperty(elmt);

        if (transformProperty)
            elmt.style[transformProperty + "Origin"] = transformOrigin;
    };

    _This.$CssScale = function (elmt, scale) {

        if (IsBrowserIE() && _BrowserEngineVersion < 9 || (_BrowserEngineVersion < 10 && IsBrowserIeQuirks())) {
            elmt.style.zoom = (scale == 1) ? "" : scale;
        }
        else {
            var transformProperty = GetTransformProperty(elmt);

            if (transformProperty) {
                //rotate(15deg) scale(.5)
                var transformValue = "scale(" + scale + ")";

                var oldTransformValue = elmt.style[transformProperty];
                var scaleReg = new RegExp(/[\s]*scale\(.*?\)/g);

                var newTransformValue = BuildNewCss(oldTransformValue, [scaleReg], transformValue);

                elmt.style[transformProperty] = newTransformValue;
            }
        }
    };

    _This.$EnableHWA = function (elmt) {
        if (!elmt.style[GetTransformProperty(elmt)] || elmt.style[GetTransformProperty(elmt)] == "none")
            elmt.style[GetTransformProperty(elmt)] = "perspective(2000px)";
    };

    _This.$DisableHWA = function (elmt) {
        elmt.style[GetTransformProperty(elmt)] = "none";
    };

    var ie8OffsetWidth = 0;
    var ie8OffsetHeight = 0;

    _This.$WindowResizeFilter = function (window, handler) {
        return IsBrowserIe9Earlier() ? function () {

            var trigger = true;

            var checkElement = (IsBrowserIeQuirks() ? window.document.body : window.document.documentElement);
            if (checkElement) {
                var widthChange = checkElement.offsetWidth - ie8OffsetWidth;
                var heightChange = checkElement.offsetHeight - ie8OffsetHeight;
                if (widthChange || heightChange) {
                    ie8OffsetWidth += widthChange;
                    ie8OffsetHeight += heightChange;
                }
                else
                    trigger = false;
            }

            trigger && handler();

        } : handler;
    };

    _This.$MouseOverOutFilter = function (handler, target) {
        ///	<param name="target" type="HTMLDomElement">
        ///		The target element to detect mouse over/out events. (for ie < 9 compatibility)
        ///	</param>

        $JssorDebug$.$Execute(function () {
            if (!target) {
                throw new Error("Null reference, parameter \"target\".");
            }
        });

        return function (event) {
            event = GetEvent(event);

            var eventName = event.type;
            var related = event.relatedTarget || (eventName == "mouseout" ? event.toElement : event.fromElement);

            if (!related || (related !== target && !_This.$IsChild(target, related))) {
                handler(event);
            }
        };
    };

    _This.$AddEvent = function (elmt, eventName, handler, useCapture) {
        elmt = _This.$GetElement(elmt);

        $JssorDebug$.$Execute(function () {
            if (!elmt) {
                $JssorDebug$.$Fail("Parameter 'elmt' not specified.");
            }

            if (!handler) {
                $JssorDebug$.$Fail("Parameter 'handler' not specified.");
            }

            if (!elmt.addEventListener && !elmt.attachEvent) {
                $JssorDebug$.$Fail("Unable to attach event handler, no known technique.");
            }
        });

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (elmt.addEventListener) {
            if (eventName == "mousewheel") {
                elmt.addEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to add the mousewheel -- not a mistake!
            // _This is for opera, since it uses onmousewheel but needs addEventListener.
            elmt.addEventListener(eventName, handler, useCapture);
        }
        else if (elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if (useCapture && elmt.setCapture) {
                elmt.setCapture();
            }
        }
    };

    _This.$RemoveEvent = function (elmt, eventName, handler, useCapture) {
        elmt = _This.$GetElement(elmt);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (elmt.removeEventListener) {
            if (eventName == "mousewheel") {
                elmt.removeEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to remove the mousewheel -- not a mistake!
            // _This is for opera, since it uses onmousewheel but needs removeEventListener.
            elmt.removeEventListener(eventName, handler, useCapture);
        }
        else if (elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if (useCapture && elmt.releaseCapture) {
                elmt.releaseCapture();
            }
        }
    };

    _This.$FireEvent = function (elmt, eventName) {
        //var document = elmt.document;

        $JssorDebug$.$Execute(function () {
            if (!document.createEvent && !document.createEventObject) {
                $JssorDebug$.$Fail("Unable to fire event, no known technique.");
            }

            if (!elmt.dispatchEvent && !elmt.fireEvent) {
                $JssorDebug$.$Fail("Unable to fire event, no known technique.");
            }
        });

        var evento;

        if (document.createEvent) {
            evento = document.createEvent("HTMLEvents");
            evento.initEvent(eventName, false, false);
            elmt.dispatchEvent(evento);
        }
        else {
            var ieEventName = "on" + eventName;
            evento = document.createEventObject();

            elmt.fireEvent(ieEventName, evento);
        }
    };

    _This.$CancelEvent = function (event) {
        event = GetEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (event.preventDefault) {
            event.preventDefault();     // W3C for preventing default
        }

        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    };

    _This.$StopEvent = function (event) {
        event = GetEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }

        event.cancelBubble = true;      // IE for stopping propagation
    };

    _This.$CreateCallback = function (object, method) {
        // create callback args
        var initialArgs = [].slice.call(arguments, 2);

        // create closure to apply method
        var callback = function () {
            // concatenate new args, but make a copy of initialArgs first
            var args = initialArgs.concat([].slice.call(arguments, 0));

            return method.apply(object, args);
        };

        //$JssorDebug$.$LiveStamp(callback, "callback_" + ($Jssor$.$GetNow() & 0xFFFFFF));

        return callback;
    };

    _This.$InnerText = function (elmt, text) {
        if (text == undefined)
            return elmt.textContent || elmt.innerText;

        var textNode = document.createTextNode(text);
        _This.$Empty(elmt);
        elmt.appendChild(textNode);
    };

    _This.$InnerHtml = function (elmt, html) {
        if (html == undefined)
            return elmt.innerHTML;

        elmt.innerHTML = html;
    };

    _This.$GetClientRect = function (elmt) {
        var rect = elmt.getBoundingClientRect();

        return { x: rect.left, y: rect.top, w: rect.right - rect.left, h: rect.bottom - rect.top };
    };

    _This.$ClearInnerHtml = function (elmt) {
        elmt.innerHTML = "";
    };

    _This.$EncodeHtml = function (text) {
        var div = _This.$CreateDiv();
        _This.$InnerText(div, text);
        return _This.$InnerHtml(div);
    };

    _This.$DecodeHtml = function (html) {
        var div = _This.$CreateDiv();
        _This.$InnerHtml(div, html);
        return _This.$InnerText(div);
    };

    _This.$SelectElement = function (elmt) {
        var userSelection;
        if (window.getSelection) {
            //W3C default
            userSelection = window.getSelection();
        }
        var theRange = null;
        if (document.createRange) {
            theRange = document.createRange();
            theRange.selectNode(elmt);
        }
        else {
            theRange = document.body.createTextRange();
            theRange.moveToElementText(elmt);
            theRange.select();
        }
        //set user selection
        if (userSelection)
            userSelection.addRange(theRange);
    };

    _This.$DeselectElements = function () {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };

    _This.$Children = function (elmt, includeAll) {
        var children = [];

        for (var tmpEl = elmt.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
            if (includeAll || tmpEl.nodeType == 1) {
                children.push(tmpEl);
            }
        }

        return children;
    };

    function FindChild(elmt, attrValue, noDeep, attrName) {
        attrName = attrName || "u";

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (AttributeEx(elmt, attrName) == attrValue)
                    return elmt;

                if (!noDeep) {
                    var childRet = FindChild(elmt, attrValue, noDeep, attrName);
                    if (childRet)
                        return childRet;
                }
            }
        }
    }

    _This.$FindChild = FindChild;

    function FindChildren(elmt, attrValue, noDeep, attrName) {
        attrName = attrName || "u";

        var ret = [];

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (AttributeEx(elmt, attrName) == attrValue)
                    ret.push(elmt);

                if (!noDeep) {
                    var childRet = FindChildren(elmt, attrValue, noDeep, attrName);
                    if (childRet.length)
                        ret = ret.concat(childRet);
                }
            }
        }

        return ret;
    }

    _This.$FindChildren = FindChildren;

    function FindChildByTag(elmt, tagName, noDeep) {

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (elmt.tagName == tagName)
                    return elmt;

                if (!noDeep) {
                    var childRet = FindChildByTag(elmt, tagName, noDeep);
                    if (childRet)
                        return childRet;
                }
            }
        }
    }

    _This.$FindChildByTag = FindChildByTag;

    function FindChildrenByTag(elmt, tagName, noDeep) {
        var ret = [];

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (!tagName || elmt.tagName == tagName)
                    ret.push(elmt);

                if (!noDeep) {
                    var childRet = FindChildrenByTag(elmt, tagName, noDeep);
                    if (childRet.length)
                        ret = ret.concat(childRet);
                }
            }
        }

        return ret;
    }

    _This.$FindChildrenByTag = FindChildrenByTag;

    _This.$GetElementsByTag = function (elmt, tagName) {
        return elmt.getElementsByTagName(tagName);
    };

    //function Extend() {
    //    var args = arguments;
    //    var target;
    //    var options;
    //    var propName;
    //    var propValue;
    //    var targetPropValue;
    //    var purpose = 7 & args[0];
    //    var deep = 1 & purpose;
    //    var unextend = 2 & purpose;
    //    var i = purpose ? 2 : 1;
    //    target = args[i - 1] || {};

    //    for (; i < args.length; i++) {
    //        // Only deal with non-null/undefined values
    //        if (options = args[i]) {
    //            // Extend the base object
    //            for (propName in options) {
    //                propValue = options[propName];

    //                if (propValue !== undefined) {
    //                    propValue = options[propName];

    //                    if (unextend) {
    //                        targetPropValue = target[propName];
    //                        if (propValue === targetPropValue)
    //                            delete target[propName];
    //                        else if (deep && IsPlainObject(targetPropValue)) {
    //                            Extend(purpose, targetPropValue, propValue);
    //                        }
    //                    }
    //                    else {
    //                        target[propName] = (deep && IsPlainObject(target[propName])) ? Extend(purpose | 4, {}, propValue) : propValue;
    //                    }
    //                }
    //            }
    //        }
    //    }

    //    // Return the modified object
    //    return target;
    //}

    //function Unextend() {
    //    var args = arguments;
    //    var newArgs = [].slice.call(arguments);
    //    var purpose = 1 & args[0];

    //    purpose && newArgs.shift();
    //    newArgs.unshift(purpose | 2);

    //    return Extend.apply(null, newArgs);
    //}

    function Extend() {
        var args = arguments;
        var target;
        var options;
        var propName;
        var propValue;
        var deep = 1 & args[0];
        var i = 1 + deep;
        target = args[i - 1] || {};

        for (; i < args.length; i++) {
            // Only deal with non-null/undefined values
            if (options = args[i]) {
                // Extend the base object
                for (propName in options) {
                    propValue = options[propName];

                    if (propValue !== undefined) {
                        propValue = options[propName];
                        target[propName] = (deep && IsPlainObject(target[propName])) ? Extend(deep, {}, propValue) : propValue;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

    _This.$Extend = Extend;

    function Unextend(target, option) {
        $JssorDebug$.$Assert(option);

        var unextended = {};
        var name;
        var targetProp;
        var optionProp;

        // Extend the base object
        for (name in target) {
            targetProp = target[name];
            optionProp = option[name];

            if (targetProp !== optionProp) {
                var exclude;

                if (IsPlainObject(targetProp) && IsPlainObject(optionProp)) {
                    targetProp = Unextend(optionProp);
                    exclude = !IsNotEmpty(targetProp);
                }
                
                !exclude && (unextended[name] = targetProp);
            }
        }

        // Return the modified object
        return unextended;
    }

    _This.$Unextend = Unextend;

    _This.$IsFunction = function (obj) {
        return Type(obj) == "function";
    };

    _This.$IsArray = function (obj) {
        return Type(obj) == "array";
    };

    _This.$IsString = function (obj) {
        return Type(obj) == "string";
    };

    _This.$IsNumeric = function (obj) {
        return !isNaN(ParseFloat(obj)) && isFinite(obj);
    };

    _This.$Type = Type;

    // args is for internal usage only
    _This.$Each = Each;

    _This.$IsNotEmpty = IsNotEmpty;

    _This.$IsPlainObject = IsPlainObject;

    function CreateElement(tagName) {
        return document.createElement(tagName);
    }

    _This.$CreateElement = CreateElement;

    _This.$CreateDiv = function () {
        return CreateElement("DIV");
    };

    _This.$CreateSpan = function () {
        return CreateElement("SPAN");
    };

    _This.$EmptyFunction = function () { };

    function Attribute(elmt, name, value) {
        if (value == undefined)
            return elmt.getAttribute(name);

        elmt.setAttribute(name, value);
    }

    function AttributeEx(elmt, name) {
        return Attribute(elmt, name) || Attribute(elmt, "data-" + name);
    }

    _This.$Attribute = Attribute;
    _This.$AttributeEx = AttributeEx;

    function ClassName(elmt, className) {
        if (className == undefined)
            return elmt.className;

        elmt.className = className;
    }

    _This.$ClassName = ClassName;

    function ToHash(array) {
        var hash = {};

        Each(array, function (item) {
            hash[item] = item;
        });

        return hash;
    }

    function Split(str, separator) {
        return str.match(separator || REGEX_WHITESPACE_GLOBAL);
    }

    function StringToHashObject(str, regExp) {
        return ToHash(Split(str || "", regExp));
    }

    _This.$ToHash = ToHash;
    _This.$Split = Split;

    function Join(separator, strings) {
        ///	<param name="separator" type="String">
        ///	</param>
        ///	<param name="strings" type="Array" value="['1']">
        ///	</param>

        var joined = "";

        Each(strings, function (str) {
            joined && (joined += separator);
            joined += str;
        });

        return joined;
    }

    function ReplaceClass(elmt, oldClassName, newClassName) {
        ClassName(elmt, Join(" ", Extend(Unextend(StringToHashObject(ClassName(elmt)), StringToHashObject(oldClassName)), StringToHashObject(newClassName))));
    }

    _This.$Join = Join;

    _This.$AddClass = function (elmt, className) {
        ReplaceClass(elmt, null, className);
    };

    _This.$RemoveClass = ReplaceClass;

    _This.$ReplaceClass = ReplaceClass;

    _This.$ParentNode = function (elmt) {
        return elmt.parentNode;
    };

    _This.$HideElement = function (elmt) {
        _This.$CssDisplay(elmt, "none");
    };

    _This.$EnableElement = function (elmt, notEnable) {
        if (notEnable) {
            _This.$Attribute(elmt, "disabled", true);
        }
        else {
            _This.$RemoveAttribute(elmt, "disabled");
        }
    };

    _This.$HideElements = function (elmts) {
        for (var i = 0; i < elmts.length; i++) {
            _This.$HideElement(elmts[i]);
        }
    };

    _This.$ShowElement = function (elmt, hide) {
        _This.$CssDisplay(elmt, hide ? "none" : "");
    };

    _This.$ShowElements = function (elmts, hide) {
        for (var i = 0; i < elmts.length; i++) {
            _This.$ShowElement(elmts[i], hide);
        }
    };

    _This.$RemoveAttribute = function (elmt, attrbuteName) {
        elmt.removeAttribute(attrbuteName);
    };

    _This.$CanClearClip = function () {
        return IsBrowserIE() && _BrowserRuntimeVersion < 10;
    };

    _This.$SetStyleClip = function (elmt, clip) {
        if (clip) {
            elmt.style.clip = "rect(" + Math.round(clip.$Top) + "px " + Math.round(clip.$Right) + "px " + Math.round(clip.$Bottom) + "px " + Math.round(clip.$Left) + "px)";
        }
        else {
            var cssText = elmt.style.cssText;
            var clipRegs = [
                new RegExp(/[\s]*clip: rect\(.*?\)[;]?/i),
                new RegExp(/[\s]*cliptop: .*?[;]?/i),
                new RegExp(/[\s]*clipright: .*?[;]?/i),
                new RegExp(/[\s]*clipbottom: .*?[;]?/i),
                new RegExp(/[\s]*clipleft: .*?[;]?/i)
            ];

            var newCssText = BuildNewCss(cssText, clipRegs, "");

            $Jssor$.$CssCssText(elmt, newCssText);
        }
    };

    _This.$GetNow = function () {
        return new Date().getTime();
    };

    _This.$AppendChild = function (elmt, child) {
        elmt.appendChild(child);
    };

    _This.$AppendChildren = function (elmt, children) {
        Each(children, function (child) {
            _This.$AppendChild(elmt, child);
        });
    };

    _This.$InsertBefore = function (newNode, refNode, pNode) {
        ///	<summary>
        ///		Insert a node before a reference node
        ///	</summary>
        ///	<param name="newNode" type="HTMLElement">
        ///		A new node to insert
        ///	</param>
        ///	<param name="refNode" type="HTMLElement">
        ///		The reference node to insert a new node before
        ///	</param>
        ///	<param name="pNode" type="HTMLElement" optional="true">
        ///		The parent node to insert node to
        ///	</param>

        (pNode || refNode.parentNode).insertBefore(newNode, refNode);
    };

    _This.$InsertAfter = function (newNode, refNode, pNode) {
        ///	<summary>
        ///		Insert a node after a reference node
        ///	</summary>
        ///	<param name="newNode" type="HTMLElement">
        ///		A new node to insert
        ///	</param>
        ///	<param name="refNode" type="HTMLElement">
        ///		The reference node to insert a new node after
        ///	</param>
        ///	<param name="pNode" type="HTMLElement" optional="true">
        ///		The parent node to insert node to
        ///	</param>

        _This.$InsertBefore(newNode, refNode.nextSibling, pNode || refNode.parentNode);
    };

    _This.$InsertAdjacentHtml = function (elmt, where, html) {
        elmt.insertAdjacentHTML(where, html);
    };

    _This.$RemoveElement = function (elmt, pNode) {
        ///	<summary>
        ///		Remove element from parent node
        ///	</summary>
        ///	<param name="elmt" type="HTMLElement">
        ///		The element to remove
        ///	</param>
        ///	<param name="pNode" type="HTMLElement" optional="true">
        ///		The parent node to remove elment from
        ///	</param>
        (pNode || elmt.parentNode).removeChild(elmt);
    };

    _This.$RemoveElements = function (elmts, pNode) {
        Each(elmts, function (elmt) {
            _This.$RemoveElement(elmt, pNode);
        });
    };

    _This.$Empty = function (elmt) {
        _This.$RemoveElements(_This.$Children(elmt, true), elmt);
    };

    _This.$ParseInt = function (str, radix) {
        return parseInt(str, radix || 10);
    };

    var ParseFloat = parseFloat;

    _This.$ParseFloat = ParseFloat;

    _This.$IsChild = function (elmtA, elmtB) {
        var body = document.body;

        while (elmtB && elmtA !== elmtB && body !== elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch (e) {
                // Firefox sometimes fires events for XUL elements, which throws
                // a "permission denied" error. so this is not a child.
                return false;
            }
        }

        return elmtA === elmtB;
    };

    function CloneNode(elmt, noDeep, keepId) {
        var clone = elmt.cloneNode(!noDeep);
        if (!keepId) {
            _This.$RemoveAttribute(clone, "id");
        }

        return clone;
    }

    _This.$CloneNode = CloneNode;

    _This.$LoadImage = function (src, callback) {
        var image = new Image();

        function LoadImageCompleteHandler(event, abort) {
            _This.$RemoveEvent(image, "load", LoadImageCompleteHandler);
            _This.$RemoveEvent(image, "abort", ErrorOrAbortHandler);
            _This.$RemoveEvent(image, "error", ErrorOrAbortHandler);

            if (callback)
                callback(image, abort);
        }

        function ErrorOrAbortHandler(event) {
            LoadImageCompleteHandler(event, true);
        }

        if (IsBrowserOpera() && _BrowserRuntimeVersion < 11.6 || !src) {
            LoadImageCompleteHandler(!src);
        }
        else {

            _This.$AddEvent(image, "load", LoadImageCompleteHandler);
            _This.$AddEvent(image, "abort", ErrorOrAbortHandler);
            _This.$AddEvent(image, "error", ErrorOrAbortHandler);

            image.src = src;
        }
    };

    _This.$LoadImages = function (imageElmts, mainImageElmt, callback) {

        var _ImageLoading = imageElmts.length + 1;

        function LoadImageCompleteEventHandler(image, abort) {

            _ImageLoading--;
            if (mainImageElmt && image && image.src == mainImageElmt.src)
                mainImageElmt = image;
            !_ImageLoading && callback && callback(mainImageElmt);
        }

        Each(imageElmts, function (imageElmt) {
            _This.$LoadImage(imageElmt.src, LoadImageCompleteEventHandler);
        });

        LoadImageCompleteEventHandler();
    };

    _This.$BuildElement = function (template, tagName, replacer, createCopy) {
        if (createCopy)
            template = CloneNode(template);

        var templateHolders = FindChildren(template, tagName);
        if (!templateHolders.length)
            templateHolders = $Jssor$.$GetElementsByTag(template, tagName);

        for (var j = templateHolders.length - 1; j > -1; j--) {
            var templateHolder = templateHolders[j];
            var replaceItem = CloneNode(replacer);
            ClassName(replaceItem, ClassName(templateHolder));
            $Jssor$.$CssCssText(replaceItem, templateHolder.style.cssText);

            $Jssor$.$InsertBefore(replaceItem, templateHolder);
            $Jssor$.$RemoveElement(templateHolder);
        }

        return template;
    };

    function JssorButtonEx(elmt) {
        var _Self = this;

        var _OriginClassName = "";
        var _ToggleClassSuffixes = ["av", "pv", "ds", "dn"];
        var _ToggleClasses = [];
        var _ToggleClassName;

        var _IsMouseDown = 0;   //class name 'dn'
        var _IsSelected = 0;    //class name 1(active): 'av', 2(passive): 'pv'
        var _IsDisabled = 0;    //class name 'ds'

        function Highlight() {
            ReplaceClass(elmt, _ToggleClassName, _ToggleClasses[_IsDisabled || _IsMouseDown || (_IsSelected & 2) || _IsSelected]);
        }

        function MouseUpOrCancelEventHandler(event) {
            _IsMouseDown = 0;

            Highlight();

            _This.$RemoveEvent(document, "mouseup", MouseUpOrCancelEventHandler);
            _This.$RemoveEvent(document, "touchend", MouseUpOrCancelEventHandler);
            _This.$RemoveEvent(document, "touchcancel", MouseUpOrCancelEventHandler);
        }

        function MouseDownEventHandler(event) {
            if (_IsDisabled) {
                _This.$CancelEvent(event);
            }
            else {

                _IsMouseDown = 4;

                Highlight();

                _This.$AddEvent(document, "mouseup", MouseUpOrCancelEventHandler);
                _This.$AddEvent(document, "touchend", MouseUpOrCancelEventHandler);
                _This.$AddEvent(document, "touchcancel", MouseUpOrCancelEventHandler);
            }
        }

        _Self.$Selected = function (activate) {
            if (activate != undefined) {
                _IsSelected = (activate & 2) || (activate & 1);

                Highlight();
            }
            else {
                return _IsSelected;
            }
        };

        _Self.$Enable = function (enable) {
            if (enable == undefined) {
                return !_IsDisabled;
            }

            _IsDisabled = enable ? 0 : 3;

            Highlight();
        };

        //JssorButtonEx Constructor
        {
            elmt = _This.$GetElement(elmt);

            var originalClassNameArray = $Jssor$.$Split(ClassName(elmt));
            if (originalClassNameArray)
                _OriginClassName = originalClassNameArray.shift();

            Each(_ToggleClassSuffixes, function (toggleClassSuffix) {
                _ToggleClasses.push(_OriginClassName +toggleClassSuffix);
            });

            _ToggleClassName = Join(" ", _ToggleClasses);

            _ToggleClasses.unshift("");

            _This.$AddEvent(elmt, "mousedown", MouseDownEventHandler);
            _This.$AddEvent(elmt, "touchstart", MouseDownEventHandler);
        }
    }

    _This.$Buttonize = function (elmt) {
        return new JssorButtonEx(elmt);
    };

    _This.$Css = Css;
    _This.$CssN = CssN;
    _This.$CssP = CssP;

    _This.$CssOverflow = CssProxy("overflow");

    _This.$CssTop = CssProxy("top", 2);
    _This.$CssLeft = CssProxy("left", 2);
    _This.$CssWidth = CssProxy("width", 2);
    _This.$CssHeight = CssProxy("height", 2);
    _This.$CssMarginLeft = CssProxy("marginLeft", 2);
    _This.$CssMarginTop = CssProxy("marginTop", 2);
    _This.$CssPosition = CssProxy("position");
    _This.$CssDisplay = CssProxy("display");
    _This.$CssZIndex = CssProxy("zIndex", 1);
    _This.$CssFloat = function (elmt, floatValue) {
        return Css(elmt, IsBrowserIE() ? "styleFloat" : "cssFloat", floatValue);
    };
    _This.$CssOpacity = function (elmt, opacity, ie9EarlierForce) {
        if (opacity != undefined) {
            SetStyleOpacity(elmt, opacity, ie9EarlierForce);
        }
        else {
            return GetStyleOpacity(elmt);
        }
    };

    _This.$CssCssText = function (elmt, text) {
        if (text != undefined) {
            elmt.style.cssText = text;
        }
        else {
            return elmt.style.cssText;
        }
    };

    var _StyleGetter = {
        $Opacity: _This.$CssOpacity,
        $Top: _This.$CssTop,
        $Left: _This.$CssLeft,
        $Width: _This.$CssWidth,
        $Height: _This.$CssHeight,
        $Position: _This.$CssPosition,
        $Display: _This.$CssDisplay,
        $ZIndex: _This.$CssZIndex
    };

    var _StyleSetterReserved;

    function StyleSetter() {
        if (!_StyleSetterReserved) {
            _StyleSetterReserved = Extend({
                $MarginTop: _This.$CssMarginTop,
                $MarginLeft: _This.$CssMarginLeft,
                $Clip: _This.$SetStyleClip,
                $Transform: _This.$SetStyleTransform
            }, _StyleGetter);
        }
        return _StyleSetterReserved;
    }

    function StyleSetterEx() {
        StyleSetter();

        //For Compression Only
        _StyleSetterReserved.$Transform = _StyleSetterReserved.$Transform;

        return _StyleSetterReserved;
    }

    _This.$StyleSetter = StyleSetter;

    _This.$StyleSetterEx = StyleSetterEx;

    _This.$GetStyles = function (elmt, originStyles) {
        StyleSetter();

        var styles = {};

        Each(originStyles, function (value, key) {
            if (_StyleGetter[key]) {
                styles[key] = _StyleGetter[key](elmt);
            }
        });

        return styles;
    };

    _This.$SetStyles = function (elmt, styles) {
        var styleSetter = StyleSetter();

        Each(styles, function (value, key) {
            styleSetter[key] && styleSetter[key](elmt, value);
        });
    };

    _This.$SetStylesEx = function (elmt, styles) {
        StyleSetterEx();

        _This.$SetStyles(elmt, styles);
    };

    var $JssorMatrix$ = new function () {
        var _ThisMatrix = this;

        function Multiply(ma, mb) {
            var acs = ma[0].length;
            var rows = ma.length;
            var cols = mb[0].length;

            var matrix = [];

            for (var r = 0; r < rows; r++) {
                var row = matrix[r] = [];
                for (var c = 0; c < cols; c++) {
                    var unitValue = 0;

                    for (var ac = 0; ac < acs; ac++) {
                        unitValue += ma[r][ac] * mb[ac][c];
                    }

                    row[c] = unitValue;
                }
            }

            return matrix;
        }

        _ThisMatrix.$ScaleX = function (matrix, sx) {
            return _ThisMatrix.$ScaleXY(matrix, sx, 0);
        };

        _ThisMatrix.$ScaleY = function (matrix, sy) {
            return _ThisMatrix.$ScaleXY(matrix, 0, sy);
        };

        _ThisMatrix.$ScaleXY = function (matrix, sx, sy) {
            return Multiply(matrix, [[sx, 0], [0, sy]]);
        };

        _ThisMatrix.$TransformPoint = function (matrix, p) {
            var pMatrix = Multiply(matrix, [[p.x], [p.y]]);

            return Point(pMatrix[0][0], pMatrix[1][0]);
        };
    };

    _This.$CreateMatrix = function (alpha, scaleX, scaleY) {
        var cos = Math.cos(alpha);
        var sin = Math.sin(alpha);
        //var r11 = cos;
        //var r21 = sin;
        //var r12 = -sin;
        //var r22 = cos;

        //var m11 = cos * scaleX;
        //var m12 = -sin * scaleY;
        //var m21 = sin * scaleX;
        //var m22 = cos * scaleY;

        return [[cos * scaleX, -sin * scaleY], [sin * scaleX, cos * scaleY]];
    };

    _This.$GetMatrixOffset = function (matrix, width, height) {
        var p1 = $JssorMatrix$.$TransformPoint(matrix, Point(-width / 2, -height / 2));
        var p2 = $JssorMatrix$.$TransformPoint(matrix, Point(width / 2, -height / 2));
        var p3 = $JssorMatrix$.$TransformPoint(matrix, Point(width / 2, height / 2));
        var p4 = $JssorMatrix$.$TransformPoint(matrix, Point(-width / 2, height / 2));

        return Point(Math.min(p1.x, p2.x, p3.x, p4.x) + width / 2, Math.min(p1.y, p2.y, p3.y, p4.y) + height / 2);
    };

    _This.$Cast = function (fromStyles, difStyles, interPosition, easings, durings, rounds, options) {

        var currentStyles = difStyles;

        if (fromStyles) {
            currentStyles = {};

            for (var key in difStyles) {

                var round = rounds[key] || 1;
                var during = durings[key] || [0, 1];
                var propertyInterPosition = (interPosition - during[0]) / during[1];
                propertyInterPosition = Math.min(Math.max(propertyInterPosition, 0), 1);
                propertyInterPosition = propertyInterPosition * round;
                var floorPosition = Math.floor(propertyInterPosition);
                if (propertyInterPosition != floorPosition)
                    propertyInterPosition -= floorPosition;

                var easing = easings[key] || easings.$Default || $JssorEasing$.$EaseSwing;
                var easingValue = easing(propertyInterPosition);
                var currentPropertyValue;
                var value = fromStyles[key];
                var toValue = difStyles[key];
                var difValue = difStyles[key];

                if ($Jssor$.$IsNumeric(difValue)) {
                    currentPropertyValue = value + difValue * easingValue;
                }
                else {
                    currentPropertyValue = $Jssor$.$Extend({ $Offset: {} }, fromStyles[key]);

                    $Jssor$.$Each(difValue.$Offset, function (rectX, n) {
                        var offsetValue = rectX * easingValue;
                        currentPropertyValue.$Offset[n] = offsetValue;
                        currentPropertyValue[n] += offsetValue;
                    });
                }
                currentStyles[key] = currentPropertyValue;
            }

            if (difStyles.$Zoom || difStyles.$Rotate) {
                currentStyles.$Transform = { $Rotate: currentStyles.$Rotate || 0, $Scale: currentStyles.$Zoom, $OriginalWidth: options.$OriginalWidth, $OriginalHeight: options.$OriginalHeight };
            }
        }

        if (difStyles.$Clip && options.$Move) {
            var styleFrameNClipOffset = currentStyles.$Clip.$Offset;

            var offsetY = (styleFrameNClipOffset.$Top || 0) + (styleFrameNClipOffset.$Bottom || 0);
            var offsetX = (styleFrameNClipOffset.$Left || 0) + (styleFrameNClipOffset.$Right || 0);

            currentStyles.$Left = (currentStyles.$Left || 0) + offsetX;
            currentStyles.$Top = (currentStyles.$Top || 0) + offsetY;
            currentStyles.$Clip.$Left -= offsetX;
            currentStyles.$Clip.$Right -= offsetX;
            currentStyles.$Clip.$Top -= offsetY;
            currentStyles.$Clip.$Bottom -= offsetY;
        }

        if (currentStyles.$Clip && $Jssor$.$CanClearClip() && !currentStyles.$Clip.$Top && !currentStyles.$Clip.$Left && (currentStyles.$Clip.$Right == options.$OriginalWidth) && (currentStyles.$Clip.$Bottom == options.$OriginalHeight))
            currentStyles.$Clip = null;

        return currentStyles;
    };
};

//$JssorObject$
function $JssorObject$() {
    var _ThisObject = this;
    // Fields

    var _Listeners = []; // dictionary of eventName --> array of handlers
    var _Listenees = [];

    // Private Methods
    function AddListener(eventName, handler) {

        $JssorDebug$.$Execute(function () {
            if (eventName == undefined || eventName == null)
                throw new Error("param 'eventName' is null or empty.");

            if (typeof (handler) != "function") {
                throw "param 'handler' must be a function.";
            }

            $Jssor$.$Each(_Listeners, function (listener) {
                if (listener.$EventName == eventName && listener.$Handler === handler) {
                    throw new Error("The handler listened to the event already, cannot listen to the same event of the same object with the same handler twice.");
                }
            });
        });

        _Listeners.push({ $EventName: eventName, $Handler: handler });
    }

    function RemoveListener(eventName, handler) {

        $JssorDebug$.$Execute(function () {
            if (eventName == undefined || eventName == null)
                throw new Error("param 'eventName' is null or empty.");

            if (typeof (handler) != "function") {
                throw "param 'handler' must be a function.";
            }
        });

        $Jssor$.$Each(_Listeners, function (listener, index) {
            if (listener.$EventName == eventName && listener.$Handler === handler) {
                _Listeners.splice(index, 1);
            }
        });
    }

    function ClearListeners() {
        _Listeners = [];
    }

    function ClearListenees() {

        $Jssor$.$Each(_Listenees, function (listenee) {
            $Jssor$.$RemoveEvent(listenee.$Obj, listenee.$EventName, listenee.$Handler);
        });

        _Listenees = [];
    }

    //Protected Methods
    _ThisObject.$Listen = function (obj, eventName, handler, useCapture) {

        $JssorDebug$.$Execute(function () {
            if (!obj)
                throw new Error("param 'obj' is null or empty.");

            if (eventName == undefined || eventName == null)
                throw new Error("param 'eventName' is null or empty.");

            if (typeof (handler) != "function") {
                throw "param 'handler' must be a function.";
            }

            $Jssor$.$Each(_Listenees, function (listenee) {
                if (listenee.$Obj === obj && listenee.$EventName == eventName && listenee.$Handler === handler) {
                    throw new Error("The handler listened to the event already, cannot listen to the same event of the same object with the same handler twice.");
                }
            });
        });

        $Jssor$.$AddEvent(obj, eventName, handler, useCapture);
        _Listenees.push({ $Obj: obj, $EventName: eventName, $Handler: handler });
    };

    _ThisObject.$Unlisten = function (obj, eventName, handler) {

        $JssorDebug$.$Execute(function () {
            if (!obj)
                throw new Error("param 'obj' is null or empty.");

            if (eventName == undefined || eventName == null)
                throw new Error("param 'eventName' is null or empty.");

            if (typeof (handler) != "function") {
                throw "param 'handler' must be a function.";
            }
        });

        $Jssor$.$Each(_Listenees, function (listenee, index) {
            if (listenee.$Obj === obj && listenee.$EventName == eventName && listenee.$Handler === handler) {
                $Jssor$.$RemoveEvent(obj, eventName, handler);
                _Listenees.splice(index, 1);
            }
        });
    };

    _ThisObject.$UnlistenAll = ClearListenees;

    // Public Methods
    _ThisObject.$On = _ThisObject.addEventListener = AddListener;

    _ThisObject.$Off = _ThisObject.removeEventListener = RemoveListener;

    _ThisObject.$TriggerEvent = function (eventName) {

        var args = [].slice.call(arguments, 1);

        $Jssor$.$Each(_Listeners, function (listener) {
            listener.$EventName == eventName && listener.$Handler.apply(window, args);
        });
    };

    _ThisObject.$Destroy = function () {
        ClearListenees();
        ClearListeners();

        for (var name in _ThisObject)
            delete _ThisObject[name];
    };

    $JssorDebug$.$C_AbstractClass(_ThisObject);
};

function $JssorAnimator$(delay, duration, options, elmt, fromStyles, difStyles) {
    delay = delay || 0;

    var _ThisAnimator = this;
    var _AutoPlay;
    var _Hiden;
    var _CombineMode;
    var _PlayToPosition;
    var _PlayDirection;
    var _NoStop;
    var _TimeStampLastFrame = 0;

    var _SubEasings;
    var _SubRounds;
    var _SubDurings;
    var _Callback;

    var _Shift = 0;
    var _Position_Current = 0;
    var _Position_Display = 0;
    var _Hooked;

    var _Position_InnerBegin = delay;
    var _Position_InnerEnd = delay + duration;
    var _Position_OuterBegin;
    var _Position_OuterEnd;
    var _LoopLength;

    var _NestedAnimators = [];
    var _StyleSetter;

    function GetPositionRange(position, begin, end) {
        var range = 0;

        if (position < begin)
            range = -1;

        else if (position > end)
            range = 1;

        return range;
    }

    function GetInnerPositionRange(position) {
        return GetPositionRange(position, _Position_InnerBegin, _Position_InnerEnd);
    }

    function GetOuterPositionRange(position) {
        return GetPositionRange(position, _Position_OuterBegin, _Position_OuterEnd);
    }

    function Shift(offset) {
        _Position_OuterBegin += offset;
        _Position_OuterEnd += offset;
        _Position_InnerBegin += offset;
        _Position_InnerEnd += offset;

        _Position_Current += offset;
        _Position_Display += offset;

        _Shift = offset;
    }

    function Locate(position, relative) {
        var offset = position - _Position_OuterBegin + delay * relative;

        Shift(offset);

        //$JssorDebug$.$Execute(function () {
        //    _ThisAnimator.$Position_InnerBegin = _Position_InnerBegin;
        //    _ThisAnimator.$Position_InnerEnd = _Position_InnerEnd;
        //    _ThisAnimator.$Position_OuterBegin = _Position_OuterBegin;
        //    _ThisAnimator.$Position_OuterEnd = _Position_OuterEnd;
        //});

        return _Position_OuterEnd;
    }

    function GoToPosition(positionOuter, force) {
        var trimedPositionOuter = positionOuter;

        if (_LoopLength && (trimedPositionOuter >= _Position_OuterEnd || trimedPositionOuter <= _Position_OuterBegin)) {
            trimedPositionOuter = ((trimedPositionOuter - _Position_OuterBegin) % _LoopLength + _LoopLength) % _LoopLength + _Position_OuterBegin;
        }

        if (!_Hooked || _NoStop || force || _Position_Current != trimedPositionOuter) {

            var positionToDisplay = Math.min(trimedPositionOuter, _Position_OuterEnd);
            positionToDisplay = Math.max(positionToDisplay, _Position_OuterBegin);

            if (!_Hooked || _NoStop || force || positionToDisplay != _Position_Display) {

                if (difStyles) {

                    var interPosition = (positionToDisplay - _Position_InnerBegin) / (duration || 1);

                    if (options.$Reverse)
                        interPosition = 1 - interPosition;

                    var currentStyles = $Jssor$.$Cast(fromStyles, difStyles, interPosition, _SubEasings, _SubDurings, _SubRounds, options);

                    $Jssor$.$Each(currentStyles, function (value, key) {
                        _StyleSetter[key] && _StyleSetter[key](elmt, value);
                    });
                }

                _ThisAnimator.$OnInnerOffsetChange(_Position_Display - _Position_InnerBegin, positionToDisplay - _Position_InnerBegin);

                _Position_Display = positionToDisplay;

                $Jssor$.$Each(_NestedAnimators, function (animator, i) {
                    var nestedAnimator = positionOuter < _Position_Current ? _NestedAnimators[_NestedAnimators.length - i - 1] : animator;
                    nestedAnimator.$GoToPosition(_Position_Display - _Shift, force);
                });

                var positionOld = _Position_Current;
                var positionNew = _Position_Display;

                _Position_Current = trimedPositionOuter;
                _Hooked = true;

                _ThisAnimator.$OnPositionChange(positionOld, positionNew);
            }
        }
    }

    function Join(animator, combineMode, noExpand) {
        ///	<summary>
        ///		Combine another animator as nested animator
        ///	</summary>
        ///	<param name="animator" type="$JssorAnimator$">
        ///		An instance of $JssorAnimator$
        ///	</param>
        ///	<param name="combineMode" type="int">
        ///		0: parallel - place the animator parallel to this animator.
        ///		1: chain - chain the animator at the _Position_InnerEnd of this animator.
        ///	</param>
        $JssorDebug$.$Execute(function () {
            if (combineMode !== 0 && combineMode !== 1)
                $JssorDebug$.$Fail("Argument out of range, the value of 'combineMode' should be either 0 or 1.");
        });

        if (combineMode)
            animator.$Locate(_Position_OuterEnd, 1);

        if (!noExpand) {
            _Position_OuterBegin = Math.min(_Position_OuterBegin, animator.$GetPosition_OuterBegin() + _Shift);
            _Position_OuterEnd = Math.max(_Position_OuterEnd, animator.$GetPosition_OuterEnd() + _Shift);
        }
        _NestedAnimators.push(animator);
    }

    var RequestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame;

    if ($Jssor$.$IsBrowserSafari() && $Jssor$.$BrowserVersion() < 7) {
        RequestAnimationFrame = null;

        //$JssorDebug$.$Log("Custom animation frame for safari before 7.");
    }

    RequestAnimationFrame = RequestAnimationFrame || function (callback) {
        $Jssor$.$Delay(callback, options.$Interval);
    };

    function ShowFrame() {
        if (_AutoPlay) {
            var now = $Jssor$.$GetNow();
            var timeOffset = Math.min(now - _TimeStampLastFrame, options.$IntervalMax);
            var timePosition = _Position_Current + timeOffset * _PlayDirection;
            _TimeStampLastFrame = now;

            if (timePosition * _PlayDirection >= _PlayToPosition * _PlayDirection)
                timePosition = _PlayToPosition;

            GoToPosition(timePosition);

            if (!_NoStop && timePosition * _PlayDirection >= _PlayToPosition * _PlayDirection) {
                Stop(_Callback);
            }
            else {
                RequestAnimationFrame(ShowFrame);
            }
        }
    }

    function PlayToPosition(toPosition, callback, noStop) {
        if (!_AutoPlay) {
            _AutoPlay = true;
            _NoStop = noStop
            _Callback = callback;
            toPosition = Math.max(toPosition, _Position_OuterBegin);
            toPosition = Math.min(toPosition, _Position_OuterEnd);
            _PlayToPosition = toPosition;
            _PlayDirection = _PlayToPosition < _Position_Current ? -1 : 1;
            _ThisAnimator.$OnStart();
            _TimeStampLastFrame = $Jssor$.$GetNow();
            RequestAnimationFrame(ShowFrame);
        }
    }

    function Stop(callback) {
        if (_AutoPlay) {
            _NoStop = _AutoPlay = _Callback = false;
            _ThisAnimator.$OnStop();

            if (callback)
                callback();
        }
    }

    _ThisAnimator.$Play = function (positionLength, callback, noStop) {
        PlayToPosition(positionLength ? _Position_Current + positionLength : _Position_OuterEnd, callback, noStop);
    };

    _ThisAnimator.$PlayToPosition = PlayToPosition;

    _ThisAnimator.$PlayToBegin = function (callback, noStop) {
        PlayToPosition(_Position_OuterBegin, callback, noStop);
    };

    _ThisAnimator.$PlayToEnd = function (callback, noStop) {
        PlayToPosition(_Position_OuterEnd, callback, noStop);
    };

    _ThisAnimator.$Stop = Stop;

    _ThisAnimator.$Continue = function (toPosition) {
        PlayToPosition(toPosition);
    };

    _ThisAnimator.$GetPosition = function () {
        return _Position_Current;
    };

    _ThisAnimator.$GetPlayToPosition = function () {
        return _PlayToPosition;
    };

    _ThisAnimator.$GetPosition_Display = function () {
        return _Position_Display;
    };

    _ThisAnimator.$GoToPosition = GoToPosition;

    _ThisAnimator.$GoToBegin = function () {
        GoToPosition(_Position_OuterBegin, true);
    };

    _ThisAnimator.$GoToEnd = function () {
        GoToPosition(_Position_OuterEnd, true);
    };

    _ThisAnimator.$Move = function (offset) {
        GoToPosition(_Position_Current + offset);
    };

    _ThisAnimator.$CombineMode = function () {
        return _CombineMode;
    };

    _ThisAnimator.$GetDuration = function () {
        return duration;
    };

    _ThisAnimator.$IsPlaying = function () {
        return _AutoPlay;
    };

    _ThisAnimator.$IsOnTheWay = function () {
        return _Position_Current > _Position_InnerBegin && _Position_Current <= _Position_InnerEnd;
    };

    _ThisAnimator.$SetLoopLength = function (length) {
        _LoopLength = length;
    };

    _ThisAnimator.$Locate = Locate;

    _ThisAnimator.$Shift = Shift;

    _ThisAnimator.$Join = Join;

    _ThisAnimator.$Combine = function (animator) {
        ///	<summary>
        ///		Combine another animator parallel to this animator
        ///	</summary>
        ///	<param name="animator" type="$JssorAnimator$">
        ///		An instance of $JssorAnimator$
        ///	</param>
        Join(animator, 0);
    };

    _ThisAnimator.$Chain = function (animator) {
        ///	<summary>
        ///		Chain another animator at the _Position_InnerEnd of this animator
        ///	</summary>
        ///	<param name="animator" type="$JssorAnimator$">
        ///		An instance of $JssorAnimator$
        ///	</param>
        Join(animator, 1);
    };

    _ThisAnimator.$GetPosition_InnerBegin = function () {
        ///	<summary>
        ///		Internal member function, do not use it.
        ///	</summary>
        ///	<private />
        ///	<returns type="int" />
        return _Position_InnerBegin;
    };

    _ThisAnimator.$GetPosition_InnerEnd = function () {
        ///	<summary>
        ///		Internal member function, do not use it.
        ///	</summary>
        ///	<private />
        ///	<returns type="int" />
        return _Position_InnerEnd;
    };

    _ThisAnimator.$GetPosition_OuterBegin = function () {
        ///	<summary>
        ///		Internal member function, do not use it.
        ///	</summary>
        ///	<private />
        ///	<returns type="int" />
        return _Position_OuterBegin;
    };

    _ThisAnimator.$GetPosition_OuterEnd = function () {
        ///	<summary>
        ///		Internal member function, do not use it.
        ///	</summary>
        ///	<private />
        ///	<returns type="int" />
        return _Position_OuterEnd;
    };

    _ThisAnimator.$OnPositionChange = _ThisAnimator.$OnStart = _ThisAnimator.$OnStop = _ThisAnimator.$OnInnerOffsetChange = $Jssor$.$EmptyFunction;
    _ThisAnimator.$Version = $Jssor$.$GetNow();

    //Constructor  1
    {
        options = $Jssor$.$Extend({
            $Interval: 16,
            $IntervalMax: 50
        }, options);

        //Sodo statement, for development time intellisence only
        $JssorDebug$.$Execute(function () {
            options = $Jssor$.$Extend({
                $LoopLength: undefined,
                $Setter: undefined,
                $Easing: undefined
            }, options);
        });

        _LoopLength = options.$LoopLength;

        _StyleSetter = $Jssor$.$Extend({}, $Jssor$.$StyleSetter(), options.$Setter);

        _Position_OuterBegin = _Position_InnerBegin = delay;
        _Position_OuterEnd = _Position_InnerEnd = delay + duration;

        _SubRounds = options.$Round || {};
        _SubDurings = options.$During || {};
        _SubEasings = $Jssor$.$Extend({ $Default: $Jssor$.$IsFunction(options.$Easing) && options.$Easing || $JssorEasing$.$EaseSwing }, options.$Easing);
    }
};

function $JssorPlayerClass$() {

    var _ThisPlayer = this;
    var _PlayerControllers = [];

    function PlayerController(playerElement) {
        var _SelfPlayerController = this;
        var _PlayerInstance;
        var _PlayerInstantces = [];

        function OnPlayerInstanceDataAvailable(event) {
            var srcElement = $Jssor$.$EvtSrc(event);
            _PlayerInstance = srcElement.pInstance;

            $Jssor$.$RemoveEvent(srcElement, "dataavailable", OnPlayerInstanceDataAvailable);
            $Jssor$.$Each(_PlayerInstantces, function (playerInstance) {
                if (playerInstance != _PlayerInstance) {
                    playerInstance.$Remove();
                }
            });

            playerElement.pTagName = _PlayerInstance.tagName;
            _PlayerInstantces = null;
        }

        function HandlePlayerInstance(playerInstanceElement) {
            var playerHandler;

            if (!playerInstanceElement.pInstance) {
                var playerHandlerAttribute = $Jssor$.$AttributeEx(playerInstanceElement, "pHandler");

                if ($JssorPlayer$[playerHandlerAttribute]) {
                    $Jssor$.$AddEvent(playerInstanceElement, "dataavailable", OnPlayerInstanceDataAvailable);
                    playerHandler = new $JssorPlayer$[playerHandlerAttribute](playerElement, playerInstanceElement);
                    _PlayerInstantces.push(playerHandler);

                    $JssorDebug$.$Execute(function () {
                        if ($Jssor$.$Type(playerHandler.$Remove) != "function") {
                            $JssorDebug$.$Fail("'pRemove' interface not implemented for player handler '" + playerHandlerAttribute + "'.");
                        }
                    });
                }
            }

            return playerHandler;
        }

        _SelfPlayerController.$InitPlayerController = function () {
            if (!playerElement.pInstance && !HandlePlayerInstance(playerElement)) {

                var playerInstanceElements = $Jssor$.$Children(playerElement);

                $Jssor$.$Each(playerInstanceElements, function (playerInstanceElement) {
                    HandlePlayerInstance(playerInstanceElement);
                });
            }
        };
    }

    _ThisPlayer.$EVT_SWITCH = 21;

    _ThisPlayer.$FetchPlayers = function (elmt) {
        elmt = elmt || document.body;

        var playerElements = $Jssor$.$FindChildren(elmt, "player");

        $Jssor$.$Each(playerElements, function (playerElement) {
            if (!_PlayerControllers[playerElement.pId]) {
                playerElement.pId = _PlayerControllers.length;
                _PlayerControllers.push(new PlayerController(playerElement));
            }
            var playerController = _PlayerControllers[playerElement.pId];
            playerController.$InitPlayerController();
        });
    };
}
;/// <reference path="Jssor.js" />

/*
* Jssor.Slider 19.0
* http://www.jssor.com/
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/MIT
* 
* TERMS OF USE - Jssor.Slider
* 
* Copyright 2014 Jssor
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


var $JssorSlideshowFormations$ = window.$JssorSlideshowFormations$ = new function () {
    var _This = this;

    //Constants +++++++

    var COLUMN_INCREASE = 0;
    var COLUMN_DECREASE = 1;
    var ROW_INCREASE = 2;
    var ROW_DECREASE = 3;

    var DIRECTION_HORIZONTAL = 0x0003;
    var DIRECTION_VERTICAL = 0x000C;

    var TO_LEFT = 0x0001;
    var TO_RIGHT = 0x0002;
    var TO_TOP = 0x0004;
    var TO_BOTTOM = 0x0008;

    var FROM_LEFT = 0x0100;
    var FROM_TOP = 0x0200;
    var FROM_RIGHT = 0x0400;
    var FROM_BOTTOM = 0x0800;

    var ASSEMBLY_BOTTOM_LEFT = FROM_BOTTOM + TO_LEFT;
    var ASSEMBLY_BOTTOM_RIGHT = FROM_BOTTOM + TO_RIGHT;
    var ASSEMBLY_TOP_LEFT = FROM_TOP + TO_LEFT;
    var ASSEMBLY_TOP_RIGHT = FROM_TOP + TO_RIGHT;
    var ASSEMBLY_LEFT_TOP = FROM_LEFT + TO_TOP;
    var ASSEMBLY_LEFT_BOTTOM = FROM_LEFT + TO_BOTTOM;
    var ASSEMBLY_RIGHT_TOP = FROM_RIGHT + TO_TOP;
    var ASSEMBLY_RIGHT_BOTTOM = FROM_RIGHT + TO_BOTTOM;

    //Constants -------

    //Formation Definition +++++++
    function isToLeft(roadValue) {
        return (roadValue & TO_LEFT) == TO_LEFT;
    }

    function isToRight(roadValue) {
        return (roadValue & TO_RIGHT) == TO_RIGHT;
    }

    function isToTop(roadValue) {
        return (roadValue & TO_TOP) == TO_TOP;
    }

    function isToBottom(roadValue) {
        return (roadValue & TO_BOTTOM) == TO_BOTTOM;
    }

    function PushFormationOrder(arr, order, formationItem) {
        formationItem.push(order);
        arr[order] = arr[order] || [];
        arr[order].push(formationItem);
    }

    _This.$FormationStraight = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = [];
        var i = 0;
        var col = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        var order;
        for (r = 0; r < rows; r++) {
            for (col = 0; col < cols; col++) {
                cr = r + ',' + col;
                switch (formationDirection) {
                    case ASSEMBLY_BOTTOM_LEFT:
                        order = il - (col * rows + (rl - r));
                        break;
                    case ASSEMBLY_RIGHT_TOP:
                        order = il - (r * cols + (cl - col));
                        break;
                    case ASSEMBLY_TOP_LEFT:
                        order = il - (col * rows + r);
                    case ASSEMBLY_LEFT_TOP:
                        order = il - (r * cols + col);
                        break;
                    case ASSEMBLY_BOTTOM_RIGHT:
                        order = col * rows + r;
                        break;
                    case ASSEMBLY_LEFT_BOTTOM:
                        order = r * cols + (cl - col);
                        break;
                    case ASSEMBLY_TOP_RIGHT:
                        order = col * rows + (rl - r);
                        break;
                    default:
                        order = r * cols + col;
                        break; //ASSEMBLY_RIGHT_BOTTOM
                }
                PushFormationOrder(a, order, [r, col]);
            }
        }

        return a;
    };

    _This.$FormationSwirl = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = [];
        var hit = [];
        var i = 0;
        var col = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        var courses;
        var course = 0;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
                col = cl;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_RIGHT_TOP:
                col = 0;
                r = rl;
                courses = [COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_TOP_LEFT:
                col = cl;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_LEFT_TOP:
                col = cl;
                r = rl;
                courses = [COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_BOTTOM_RIGHT:
                col = 0;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_LEFT_BOTTOM:
                col = cl;
                r = 0;
                courses = [COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_TOP_RIGHT:
                col = 0;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE];
                break;
            default:
                col = 0;
                r = 0;
                courses = [COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE];
                break; //ASSEMBLY_RIGHT_BOTTOM
        }
        i = 0;
        while (i < count) {
            cr = r + ',' + col;
            if (col >= 0 && col < cols && r >= 0 && r < rows && !hit[cr]) {
                //a[cr] = i++;
                hit[cr] = true;
                PushFormationOrder(a, i++, [r, col]);
            }
            else {
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        col--;
                        break;
                    case ROW_INCREASE:
                        r--;
                        break;
                    case COLUMN_DECREASE:
                        col++;
                        break;
                    case ROW_DECREASE:
                        r++;
                        break;
                }
            }

            switch (courses[course % courses.length]) {
                case COLUMN_INCREASE:
                    col++;
                    break;
                case ROW_INCREASE:
                    r++;
                    break;
                case COLUMN_DECREASE:
                    col--;
                    break;
                case ROW_DECREASE:
                    r--;
                    break;
            }
        }
        return a;
    };

    _This.$FormationZigZag = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = [];
        var i = 0;
        var col = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        var courses;
        var course = 0;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
                col = cl;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_DECREASE, ROW_DECREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_RIGHT_TOP:
                col = 0;
                r = rl;
                courses = [COLUMN_INCREASE, ROW_DECREASE, COLUMN_DECREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_TOP_LEFT:
                col = cl;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_DECREASE, ROW_INCREASE, COLUMN_DECREASE];
                break;
            case ASSEMBLY_LEFT_TOP:
                col = cl;
                r = rl;
                courses = [COLUMN_DECREASE, ROW_DECREASE, COLUMN_INCREASE, ROW_DECREASE];
                break;
            case ASSEMBLY_BOTTOM_RIGHT:
                col = 0;
                r = 0;
                courses = [ROW_INCREASE, COLUMN_INCREASE, ROW_DECREASE, COLUMN_INCREASE];
                break;
            case ASSEMBLY_LEFT_BOTTOM:
                col = cl;
                r = 0;
                courses = [COLUMN_DECREASE, ROW_INCREASE, COLUMN_INCREASE, ROW_INCREASE];
                break;
            case ASSEMBLY_TOP_RIGHT:
                col = 0;
                r = rl;
                courses = [ROW_DECREASE, COLUMN_INCREASE, ROW_INCREASE, COLUMN_INCREASE];
                break;
            default:
                col = 0;
                r = 0;
                courses = [COLUMN_INCREASE, ROW_INCREASE, COLUMN_DECREASE, ROW_INCREASE];
                break; //ASSEMBLY_RIGHT_BOTTOM
        }
        i = 0;
        while (i < count) {
            cr = r + ',' + col;
            if (col >= 0 && col < cols && r >= 0 && r < rows && typeof (a[cr]) == 'undefined') {
                PushFormationOrder(a, i++, [r, col]);
                //a[cr] = i++;
                switch (courses[course % courses.length]) {
                    case COLUMN_INCREASE:
                        col++;
                        break;
                    case ROW_INCREASE:
                        r++;
                        break;
                    case COLUMN_DECREASE:
                        col--;
                        break;
                    case ROW_DECREASE:
                        r--;
                        break;
                }
            }
            else {
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        col--;
                        break;
                    case ROW_INCREASE:
                        r--;
                        break;
                    case COLUMN_DECREASE:
                        col++;
                        break;
                    case ROW_DECREASE:
                        r++;
                        break;
                }
                switch (courses[course++ % courses.length]) {
                    case COLUMN_INCREASE:
                        col++;
                        break;
                    case ROW_INCREASE:
                        r++;
                        break;
                    case COLUMN_DECREASE:
                        col--;
                        break;
                    case ROW_DECREASE:
                        r--;
                        break;
                }
            }
        }
        return a;
    };

    _This.$FormationStraightStairs = function (transition) {
        var cols = transition.$Cols;
        var rows = transition.$Rows;
        var formationDirection = transition.$Assembly;
        var count = transition.$Count;
        var a = [];
        var i = 0;
        var col = 0;
        var r = 0;
        var cl = cols - 1;
        var rl = rows - 1;
        var il = count - 1;
        var cr;
        switch (formationDirection) {
            case ASSEMBLY_BOTTOM_LEFT:
            case ASSEMBLY_TOP_RIGHT:
            case ASSEMBLY_TOP_LEFT:
            case ASSEMBLY_BOTTOM_RIGHT:
                var C = 0;
                var R = 0;
                break;
            case ASSEMBLY_LEFT_BOTTOM:
            case ASSEMBLY_RIGHT_TOP:
            case ASSEMBLY_LEFT_TOP:
            case ASSEMBLY_RIGHT_BOTTOM:
                var C = cl;
                var R = 0;
                break;
            default:
                formationDirection = ASSEMBLY_RIGHT_BOTTOM;
                var C = cl;
                var R = 0;
                break;
        }
        col = C;
        r = R;
        while (i < count) {
            cr = r + ',' + col;
            if (isToTop(formationDirection) || isToRight(formationDirection)) {
                PushFormationOrder(a, il - i++, [r, col]);
                //a[cr] = il - i++;
            }
            else {
                PushFormationOrder(a, i++, [r, col]);
                //a[cr] = i++;
            }
            switch (formationDirection) {
                case ASSEMBLY_BOTTOM_LEFT:
                case ASSEMBLY_TOP_RIGHT:
                    col--;
                    r++;
                    break;
                case ASSEMBLY_TOP_LEFT:
                case ASSEMBLY_BOTTOM_RIGHT:
                    col++;
                    r--;
                    break;
                case ASSEMBLY_LEFT_BOTTOM:
                case ASSEMBLY_RIGHT_TOP:
                    col--;
                    r--;
                    break;
                case ASSEMBLY_RIGHT_BOTTOM:
                case ASSEMBLY_LEFT_TOP:
                default:
                    col++;
                    r++;
                    break;
            }
            if (col < 0 || r < 0 || col > cl || r > rl) {
                switch (formationDirection) {
                    case ASSEMBLY_BOTTOM_LEFT:
                    case ASSEMBLY_TOP_RIGHT:
                        C++;
                        break;
                    case ASSEMBLY_LEFT_BOTTOM:
                    case ASSEMBLY_RIGHT_TOP:
                    case ASSEMBLY_TOP_LEFT:
                    case ASSEMBLY_BOTTOM_RIGHT:
                        R++;
                        break;
                    case ASSEMBLY_RIGHT_BOTTOM:
                    case ASSEMBLY_LEFT_TOP:
                    default:
                        C--;
                        break;
                }
                if (C < 0 || R < 0 || C > cl || R > rl) {
                    switch (formationDirection) {
                        case ASSEMBLY_BOTTOM_LEFT:
                        case ASSEMBLY_TOP_RIGHT:
                            C = cl;
                            R++;
                            break;
                        case ASSEMBLY_TOP_LEFT:
                        case ASSEMBLY_BOTTOM_RIGHT:
                            R = rl;
                            C++;
                            break;
                        case ASSEMBLY_LEFT_BOTTOM:
                        case ASSEMBLY_RIGHT_TOP: R = rl; C--;
                            break;
                        case ASSEMBLY_RIGHT_BOTTOM:
                        case ASSEMBLY_LEFT_TOP:
                        default:
                            C = 0;
                            R++;
                            break;
                    }
                    if (R > rl)
                        R = rl;
                    else if (R < 0)
                        R = 0;
                    else if (C > cl)
                        C = cl;
                    else if (C < 0)
                        C = 0;
                }
                r = R;
                col = C;
            }
        }
        return a;
    };

    _This.$FormationSquare = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = [];
        var i = 0;
        var col;
        var r;
        var dc;
        var dr;
        var cr;
        dc = cols < rows ? (rows - cols) / 2 : 0;
        dr = cols > rows ? (cols - rows) / 2 : 0;
        cr = Math.round(Math.max(cols / 2, rows / 2)) + 1;
        for (col = 0; col < cols; col++) {
            for (r = 0; r < rows; r++)
                PushFormationOrder(arr, cr - Math.min(col + 1 + dc, r + 1 + dr, cols - col + dc, rows - r + dr), [r, col]);
        }
        return arr;
    };

    _This.$FormationRectangle = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = [];
        var i = 0;
        var col;
        var r;
        var cr;
        cr = Math.round(Math.min(cols / 2, rows / 2)) + 1;
        for (col = 0; col < cols; col++) {
            for (r = 0; r < rows; r++)
                PushFormationOrder(arr, cr - Math.min(col + 1, r + 1, cols - col, rows - r), [r, col]);
        }
        return arr;
    };

    _This.$FormationRandom = function (transition) {
        var a = [];
        var r, col, i;
        for (r = 0; r < transition.$Rows; r++) {
            for (col = 0; col < transition.$Cols; col++)
                PushFormationOrder(a, Math.ceil(100000 * Math.random()) % 13, [r, col]);
        }

        return a;
    };

    _This.$FormationCircle = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = [];
        var i = 0;
        var col;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        for (col = 0; col < cols; col++) {
            for (r = 0; r < rows; r++)
                PushFormationOrder(arr, Math.round(Math.sqrt(Math.pow(col - hc, 2) + Math.pow(r - hr, 2))), [r, col]);
        }
        return arr;
    };

    _This.$FormationCross = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = [];
        var i = 0;
        var col;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        for (col = 0; col < cols; col++) {
            for (r = 0; r < rows; r++)
                PushFormationOrder(arr, Math.round(Math.min(Math.abs(col - hc), Math.abs(r - hr))), [r, col]);
        }
        return arr;
    };

    _This.$FormationRectangleCross = function (transition) {
        var cols = transition.$Cols || 1;
        var rows = transition.$Rows || 1;
        var arr = [];
        var i = 0;
        var col;
        var r;
        var hc = cols / 2 - 0.5;
        var hr = rows / 2 - 0.5;
        var cr = Math.max(hc, hr) + 1;
        for (col = 0; col < cols; col++) {
            for (r = 0; r < rows; r++)
                PushFormationOrder(arr, Math.round(cr - Math.max(hc - Math.abs(col - hc), hr - Math.abs(r - hr))) - 1, [r, col]);
        }
        return arr;
    };
};

var $JssorSlideshowRunner$ = window.$JssorSlideshowRunner$ = function (slideContainer, slideContainerWidth, slideContainerHeight, slideshowOptions, isTouchDevice) {

    var _SelfSlideshowRunner = this;

    //var _State = 0; //-1 fullfill, 0 clean, 1 initializing, 2 stay, 3 playing
    var _EndTime;

    var _SliderFrameCount;

    var _SlideshowPlayerBelow;
    var _SlideshowPlayerAbove;

    var _PrevItem;
    var _SlideItem;

    var _TransitionIndex = 0;
    var _TransitionsOrder = slideshowOptions.$TransitionsOrder;

    var _SlideshowTransition;

    var _SlideshowPerformance = 8;

    //#region Private Methods
    function EnsureTransitionInstance(options, slideshowInterval) {

        var slideshowTransition = {
            $Interval: slideshowInterval,  //Delay to play next frame
            $Duration: 1, //Duration to finish the entire transition
            $Delay: 0,  //Delay to assembly blocks
            $Cols: 1,   //Number of columns
            $Rows: 1,   //Number of rows
            $Opacity: 0,   //Fade block or not
            $Zoom: 0,   //Zoom block or not
            $Clip: 0,   //Clip block or not
            $Move: false,   //Move block or not
            $SlideOut: false,   //Slide the previous slide out to display next slide instead
            //$FlyDirection: 0,   //Specify fly transform with direction
            $Reverse: false,    //Reverse the assembly or not
            $Formation: $JssorSlideshowFormations$.$FormationRandom,    //Shape that assembly blocks as
            $Assembly: 0x0408,   //The way to assembly blocks ASSEMBLY_RIGHT_BOTTOM
            $ChessMode: { $Column: 0, $Row: 0 },    //Chess move or fly direction
            $Easing: $JssorEasing$.$EaseSwing,  //Specify variation of speed during transition
            $Round: {},
            $Blocks: [],
            $During: {}
        };

        $Jssor$.$Extend(slideshowTransition, options);

        slideshowTransition.$Count = slideshowTransition.$Cols * slideshowTransition.$Rows;
        if ($Jssor$.$IsFunction(slideshowTransition.$Easing))
            slideshowTransition.$Easing = { $Default: slideshowTransition.$Easing };

        slideshowTransition.$FramesCount = Math.ceil(slideshowTransition.$Duration / slideshowTransition.$Interval);

        slideshowTransition.$GetBlocks = function (width, height) {
            width /= slideshowTransition.$Cols;
            height /= slideshowTransition.$Rows;
            var wh = width + 'x' + height;
            if (!slideshowTransition.$Blocks[wh]) {
                slideshowTransition.$Blocks[wh] = { $Width: width, $Height: height };
                for (var col = 0; col < slideshowTransition.$Cols; col++) {
                    for (var r = 0; r < slideshowTransition.$Rows; r++)
                        slideshowTransition.$Blocks[wh][r + ',' + col] = { $Top: r * height, $Right: col * width + width, $Bottom: r * height + height, $Left: col * width };
                }
            }

            return slideshowTransition.$Blocks[wh];
        };

        if (slideshowTransition.$Brother) {
            slideshowTransition.$Brother = EnsureTransitionInstance(slideshowTransition.$Brother, slideshowInterval);
            slideshowTransition.$SlideOut = true;
        }

        return slideshowTransition;
    }
    //#endregion

    //#region Private Classes
    function JssorSlideshowPlayer(slideContainer, slideElement, slideTransition, beginTime, slideContainerWidth, slideContainerHeight) {
        var _Self = this;

        var _Block;
        var _StartStylesArr = {};
        var _AnimationStylesArrs = {};
        var _AnimationBlockItems = [];
        var _StyleStart;
        var _StyleEnd;
        var _StyleDif;
        var _ChessModeColumn = slideTransition.$ChessMode.$Column || 0;
        var _ChessModeRow = slideTransition.$ChessMode.$Row || 0;

        var _Blocks = slideTransition.$GetBlocks(slideContainerWidth, slideContainerHeight);
        var _FormationInstance = GetFormation(slideTransition);
        var _MaxOrder = _FormationInstance.length - 1;
        var _Period = slideTransition.$Duration + slideTransition.$Delay * _MaxOrder;
        var _EndTime = beginTime + _Period;

        var _SlideOut = slideTransition.$SlideOut;
        var _IsIn;

        //_EndTime += $Jssor$.$IsBrowserChrome() ? 260 : 50;
        _EndTime += 50;

        //#region Private Methods

        function GetFormation(transition) {

            var formationInstance = transition.$Formation(transition);

            return transition.$Reverse ? formationInstance.reverse() : formationInstance;

        }
        //#endregion

        _Self.$EndTime = _EndTime;

        _Self.$ShowFrame = function (time) {
            time -= beginTime;

            var isIn = time < _Period;

            if (isIn || _IsIn) {
                _IsIn = isIn;

                if (!_SlideOut)
                    time = _Period - time;

                var frameIndex = Math.ceil(time / slideTransition.$Interval);

                $Jssor$.$Each(_AnimationStylesArrs, function (value, index) {

                    var itemFrameIndex = Math.max(frameIndex, value.$Min);
                    itemFrameIndex = Math.min(itemFrameIndex, value.length - 1);

                    if (value.$LastFrameIndex != itemFrameIndex) {
                        if (!value.$LastFrameIndex && !_SlideOut) {
                            $Jssor$.$ShowElement(_AnimationBlockItems[index]);
                        }
                        else if (itemFrameIndex == value.$Max && _SlideOut) {
                            $Jssor$.$HideElement(_AnimationBlockItems[index]);
                        }
                        value.$LastFrameIndex = itemFrameIndex;
                        $Jssor$.$SetStylesEx(_AnimationBlockItems[index], value[itemFrameIndex]);
                    }
                });
            }
        };

        //constructor
        {
            slideElement = $Jssor$.$CloneNode(slideElement);
            //$Jssor$.$RemoveAttribute(slideElement, "id");
            if ($Jssor$.$IsBrowserIe9Earlier()) {
                var hasImage = !slideElement["no-image"];
                var slideChildElements = $Jssor$.$FindChildrenByTag(slideElement);
                $Jssor$.$Each(slideChildElements, function (slideChildElement) {
                    if (hasImage || slideChildElement["jssor-slider"])
                        $Jssor$.$CssOpacity(slideChildElement, $Jssor$.$CssOpacity(slideChildElement), true);
                });
            }

            $Jssor$.$Each(_FormationInstance, function (formationItems, order) {
                $Jssor$.$Each(formationItems, function (formationItem) {
                    var row = formationItem[0];
                    var col = formationItem[1];
                    {
                        var columnRow = row + ',' + col;

                        var chessHorizontal = false;
                        var chessVertical = false;
                        var chessRotate = false;

                        if (_ChessModeColumn && col % 2) {
                            if (_ChessModeColumn & 3/*$JssorDirection$.$IsHorizontal(_ChessModeColumn)*/) {
                                chessHorizontal = !chessHorizontal;
                            }
                            if (_ChessModeColumn & 12/*$JssorDirection$.$IsVertical(_ChessModeColumn)*/) {
                                chessVertical = !chessVertical;
                            }

                            if (_ChessModeColumn & 16)
                                chessRotate = !chessRotate;
                        }

                        if (_ChessModeRow && row % 2) {
                            if (_ChessModeRow & 3/*$JssorDirection$.$IsHorizontal(_ChessModeRow)*/) {
                                chessHorizontal = !chessHorizontal;
                            }
                            if (_ChessModeRow & 12/*$JssorDirection$.$IsVertical(_ChessModeRow)*/) {
                                chessVertical = !chessVertical;
                            }
                            if (_ChessModeRow & 16)
                                chessRotate = !chessRotate;
                        }

                        slideTransition.$Top = slideTransition.$Top || (slideTransition.$Clip & 4);
                        slideTransition.$Bottom = slideTransition.$Bottom || (slideTransition.$Clip & 8);
                        slideTransition.$Left = slideTransition.$Left || (slideTransition.$Clip & 1);
                        slideTransition.$Right = slideTransition.$Right || (slideTransition.$Clip & 2);

                        var topBenchmark = chessVertical ? slideTransition.$Bottom : slideTransition.$Top;
                        var bottomBenchmark = chessVertical ? slideTransition.$Top : slideTransition.$Bottom;
                        var leftBenchmark = chessHorizontal ? slideTransition.$Right : slideTransition.$Left;
                        var rightBenchmark = chessHorizontal ? slideTransition.$Left : slideTransition.$Right;

                        slideTransition.$Clip = topBenchmark || bottomBenchmark || leftBenchmark || rightBenchmark;

                        _StyleDif = {};
                        _StyleEnd = { $Top: 0, $Left: 0, $Opacity: 1, $Width: slideContainerWidth, $Height: slideContainerHeight };
                        _StyleStart = $Jssor$.$Extend({}, _StyleEnd);
                        _Block = $Jssor$.$Extend({}, _Blocks[columnRow]);

                        if (slideTransition.$Opacity) {
                            _StyleEnd.$Opacity = 2 - slideTransition.$Opacity;
                        }

                        if (slideTransition.$ZIndex) {
                            _StyleEnd.$ZIndex = slideTransition.$ZIndex;
                            _StyleStart.$ZIndex = 0;
                        }

                        var allowClip = slideTransition.$Cols * slideTransition.$Rows > 1 || slideTransition.$Clip;

                        if (slideTransition.$Zoom || slideTransition.$Rotate) {
                            var allowRotate = true;
                            if ($Jssor$.$IsBrowserIe9Earlier()) {
                                if (slideTransition.$Cols * slideTransition.$Rows > 1)
                                    allowRotate = false;
                                else
                                    allowClip = false;
                            }

                            if (allowRotate) {
                                _StyleEnd.$Zoom = slideTransition.$Zoom ? slideTransition.$Zoom - 1 : 1;
                                _StyleStart.$Zoom = 1;

                                if ($Jssor$.$IsBrowserIe9Earlier() || $Jssor$.$IsBrowserOpera())
                                    _StyleEnd.$Zoom = Math.min(_StyleEnd.$Zoom, 2);

                                var rotate = slideTransition.$Rotate;

                                _StyleEnd.$Rotate = rotate * 360 * ((chessRotate) ? -1 : 1);
                                _StyleStart.$Rotate = 0;
                            }
                        }

                        if (allowClip) {
                            if (slideTransition.$Clip) {
                                var clipScale = slideTransition.$ScaleClip || 1;
                                var blockOffset = _Block.$Offset = {};
                                if (topBenchmark && bottomBenchmark) {
                                    blockOffset.$Top = _Blocks.$Height / 2 * clipScale;
                                    blockOffset.$Bottom = -blockOffset.$Top;
                                }
                                else if (topBenchmark) {
                                    blockOffset.$Bottom = -_Blocks.$Height * clipScale;
                                }
                                else if (bottomBenchmark) {
                                    blockOffset.$Top = _Blocks.$Height * clipScale;
                                }

                                if (leftBenchmark && rightBenchmark) {
                                    blockOffset.$Left = _Blocks.$Width / 2 * clipScale;
                                    blockOffset.$Right = -blockOffset.$Left;
                                }
                                else if (leftBenchmark) {
                                    blockOffset.$Right = -_Blocks.$Width * clipScale;
                                }
                                else if (rightBenchmark) {
                                    blockOffset.$Left = _Blocks.$Width * clipScale;
                                }
                            }

                            _StyleDif.$Clip = _Block;
                            _StyleStart.$Clip = _Blocks[columnRow];
                        }

                        //fly
                        {
                            var chessHor = chessHorizontal ? 1 : -1;
                            var chessVer = chessVertical ? 1 : -1;

                            if (slideTransition.x)
                                _StyleEnd.$Left += slideContainerWidth * slideTransition.x * chessHor;

                            if (slideTransition.y)
                                _StyleEnd.$Top += slideContainerHeight * slideTransition.y * chessVer;
                        }

                        $Jssor$.$Each(_StyleEnd, function (propertyEnd, property) {
                            if ($Jssor$.$IsNumeric(propertyEnd)) {
                                if (propertyEnd != _StyleStart[property]) {
                                    _StyleDif[property] = propertyEnd - _StyleStart[property];
                                }
                            }
                        });

                        _StartStylesArr[columnRow] = _SlideOut ? _StyleStart : _StyleEnd;

                        var animationStylesArr = [];
                        var framesCount = slideTransition.$FramesCount;
                        var virtualFrameCount = Math.round(order * slideTransition.$Delay / slideTransition.$Interval);
                        _AnimationStylesArrs[columnRow] = new Array(virtualFrameCount);
                        _AnimationStylesArrs[columnRow].$Min = virtualFrameCount;
                        _AnimationStylesArrs[columnRow].$Max = virtualFrameCount + framesCount - 1;

                        for (var frameN = 0; frameN <= framesCount; frameN++) {
                            var styleFrameN = $Jssor$.$Cast(_StyleStart, _StyleDif, frameN / framesCount, slideTransition.$Easing, slideTransition.$During, slideTransition.$Round, { $Move: slideTransition.$Move, $OriginalWidth: slideContainerWidth, $OriginalHeight: slideContainerHeight })

                            styleFrameN.$ZIndex = styleFrameN.$ZIndex || 1;

                            _AnimationStylesArrs[columnRow].push(styleFrameN);
                        }

                    } //for
                });
            });

            _FormationInstance.reverse();
            $Jssor$.$Each(_FormationInstance, function (formationItems) {
                $Jssor$.$Each(formationItems, function (formationItem) {
                    var row = formationItem[0];
                    var col = formationItem[1];

                    var columnRow = row + ',' + col;

                    var image = slideElement;
                    if (col || row)
                        image = $Jssor$.$CloneNode(slideElement);

                    $Jssor$.$SetStyles(image, _StartStylesArr[columnRow]);
                    $Jssor$.$CssOverflow(image, "hidden");

                    $Jssor$.$CssPosition(image, "absolute");
                    slideContainer.$AddClipElement(image);
                    _AnimationBlockItems[columnRow] = image;
                    $Jssor$.$ShowElement(image, !_SlideOut);
                });
            });
        }
    }

    function SlideshowProcessor() {
        var _SelfSlideshowProcessor = this;
        var _CurrentTime = 0;

        $JssorAnimator$.call(_SelfSlideshowProcessor, 0, _EndTime);

        _SelfSlideshowProcessor.$OnPositionChange = function (oldPosition, newPosition) {
            if ((newPosition - _CurrentTime) > _SlideshowPerformance) {
                _CurrentTime = newPosition;

                _SlideshowPlayerAbove && _SlideshowPlayerAbove.$ShowFrame(newPosition);
                _SlideshowPlayerBelow && _SlideshowPlayerBelow.$ShowFrame(newPosition);
            }
        };

        _SelfSlideshowProcessor.$Transition = _SlideshowTransition;
    }
    //#endregion

    //member functions
    _SelfSlideshowRunner.$GetTransition = function (slideCount) {
        var n = 0;

        var transitions = slideshowOptions.$Transitions;

        var transitionCount = transitions.length;

        if (_TransitionsOrder) { /*Sequence*/
            //if (transitionCount > slideCount && ($Jssor$.$IsBrowserChrome() || $Jssor$.$IsBrowserSafari() || $Jssor$.$IsBrowserFireFox())) {
            //    transitionCount -= transitionCount % slideCount;
            //}
            n = _TransitionIndex++ % transitionCount;
        }
        else { /*Random*/
            n = Math.floor(Math.random() * transitionCount);
        }

        transitions[n] && (transitions[n].$Index = n);

        return transitions[n];
    };

    _SelfSlideshowRunner.$Initialize = function (slideIndex, prevIndex, slideItem, prevItem, slideshowTransition) {
        $JssorDebug$.$Execute(function () {
            if (_SlideshowPlayerBelow) {
                $JssorDebug$.$Fail("slideshow runner has not been cleared.");
            }
        });

        _SlideshowTransition = slideshowTransition;

        slideshowTransition = EnsureTransitionInstance(slideshowTransition, _SlideshowPerformance);

        _SlideItem = slideItem;
        _PrevItem = prevItem;

        var prevSlideElement = prevItem.$Item;
        var currentSlideElement = slideItem.$Item;
        prevSlideElement["no-image"] = !prevItem.$Image;
        currentSlideElement["no-image"] = !slideItem.$Image;

        var slideElementAbove = prevSlideElement;
        var slideElementBelow = currentSlideElement;

        var slideTransitionAbove = slideshowTransition;
        var slideTransitionBelow = slideshowTransition.$Brother || EnsureTransitionInstance({}, _SlideshowPerformance);

        if (!slideshowTransition.$SlideOut) {
            slideElementAbove = currentSlideElement;
            slideElementBelow = prevSlideElement;
        }

        var shift = slideTransitionBelow.$Shift || 0;

        _SlideshowPlayerBelow = new JssorSlideshowPlayer(slideContainer, slideElementBelow, slideTransitionBelow, Math.max(shift - slideTransitionBelow.$Interval, 0), slideContainerWidth, slideContainerHeight);
        _SlideshowPlayerAbove = new JssorSlideshowPlayer(slideContainer, slideElementAbove, slideTransitionAbove, Math.max(slideTransitionBelow.$Interval - shift, 0), slideContainerWidth, slideContainerHeight);

        _SlideshowPlayerBelow.$ShowFrame(0);
        _SlideshowPlayerAbove.$ShowFrame(0);

        _EndTime = Math.max(_SlideshowPlayerBelow.$EndTime, _SlideshowPlayerAbove.$EndTime);

        _SelfSlideshowRunner.$Index = slideIndex;
    };

    _SelfSlideshowRunner.$Clear = function () {
        slideContainer.$Clear();
        _SlideshowPlayerBelow = null;
        _SlideshowPlayerAbove = null;
    };

    _SelfSlideshowRunner.$GetProcessor = function () {
        var slideshowProcessor = null;

        if (_SlideshowPlayerAbove)
            slideshowProcessor = new SlideshowProcessor();

        return slideshowProcessor;
    };

    //Constructor
    {
        if ($Jssor$.$IsBrowserIe9Earlier() || $Jssor$.$IsBrowserOpera() || (isTouchDevice && $Jssor$.$WebKitVersion() < 537)) {
            _SlideshowPerformance = 16;
        }

        $JssorObject$.call(_SelfSlideshowRunner);
        $JssorAnimator$.call(_SelfSlideshowRunner, -10000000, 10000000);
    }
};

var $JssorSlider$ = window.$JssorSlider$ = function (elmt, options) {
    var _SelfSlider = this;

    //#region Private Classes
    //Conveyor
    function Conveyor() {
        var _SelfConveyor = this;
        $JssorAnimator$.call(_SelfConveyor, -100000000, 200000000);

        _SelfConveyor.$GetCurrentSlideInfo = function () {
            var positionDisplay = _SelfConveyor.$GetPosition_Display();
            var virtualIndex = Math.floor(positionDisplay);
            var slideIndex = GetRealIndex(virtualIndex);
            var slidePosition = positionDisplay - Math.floor(positionDisplay);

            return { $Index: slideIndex, $VirtualIndex: virtualIndex, $Position: slidePosition };
        };

        _SelfConveyor.$OnPositionChange = function (oldPosition, newPosition) {

            var index = Math.floor(newPosition);
            if (index != newPosition && newPosition > oldPosition)
                index++;

            ResetNavigator(index, true);

            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_POSITION_CHANGE, GetRealIndex(newPosition), GetRealIndex(oldPosition), newPosition, oldPosition);
        };
    }
    //Conveyor

    //Carousel
    function Carousel() {
        var _SelfCarousel = this;

        $JssorAnimator$.call(_SelfCarousel, 0, 0, { $LoopLength: _SlideCount });

        //Carousel Constructor
        {
            $Jssor$.$Each(_SlideItems, function (slideItem) {
                (_Loop & 1) && slideItem.$SetLoopLength(_SlideCount);
                _SelfCarousel.$Chain(slideItem);
                slideItem.$Shift(_ParkingPosition / _StepLength);
            });
        }
    }
    //Carousel

    //Slideshow
    function Slideshow() {
        var _SelfSlideshow = this;
        var _Wrapper = _SlideContainer.$Elmt;

        $JssorAnimator$.call(_SelfSlideshow, -1, 2, { $Easing: $JssorEasing$.$EaseLinear, $Setter: { $Position: SetPosition }, $LoopLength: _SlideCount }, _Wrapper, { $Position: 1 }, { $Position: -2 });

        _SelfSlideshow.$Wrapper = _Wrapper;

        //Slideshow Constructor
        {
            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_SlideContainer.$Elmt, "debug-id", "slide_container");
            });
        }
    }
    //Slideshow

    //CarouselPlayer
    function CarouselPlayer(carousel, slideshow) {
        var _SelfCarouselPlayer = this;
        var _FromPosition;
        var _ToPosition;
        var _Duration;
        var _StandBy;
        var _StandByPosition;

        $JssorAnimator$.call(_SelfCarouselPlayer, -100000000, 200000000, { $IntervalMax: 100 });

        _SelfCarouselPlayer.$OnStart = function () {
            _IsSliding = true;
            _LoadingTicket = null;

            //EVT_SWIPE_START
            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_SWIPE_START, GetRealIndex(_Conveyor.$GetPosition()), _Conveyor.$GetPosition());
        };

        _SelfCarouselPlayer.$OnStop = function () {

            _IsSliding = false;
            _StandBy = false;

            var currentSlideInfo = _Conveyor.$GetCurrentSlideInfo();

            //EVT_SWIPE_END
            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_SWIPE_END, GetRealIndex(_Conveyor.$GetPosition()), _Conveyor.$GetPosition());

            if (!currentSlideInfo.$Position) {
                OnPark(currentSlideInfo.$VirtualIndex, _CurrentSlideIndex);
            }
        };

        _SelfCarouselPlayer.$OnPositionChange = function (oldPosition, newPosition) {

            var toPosition;

            if (_StandBy)
                toPosition = _StandByPosition;
            else {
                toPosition = _ToPosition;

                if (_Duration) {
                    var interPosition = newPosition / _Duration;
                    toPosition = _Options.$SlideEasing(interPosition) * (_ToPosition - _FromPosition) + _FromPosition;
                }
            }

            _Conveyor.$GoToPosition(toPosition);
        };

        _SelfCarouselPlayer.$PlayCarousel = function (fromPosition, toPosition, duration, callback) {
            $JssorDebug$.$Execute(function () {
                if (_SelfCarouselPlayer.$IsPlaying())
                    $JssorDebug$.$Fail("The carousel is already playing.");
            });

            _FromPosition = fromPosition;
            _ToPosition = toPosition;
            _Duration = duration;

            _Conveyor.$GoToPosition(fromPosition);
            _SelfCarouselPlayer.$GoToPosition(0);

            _SelfCarouselPlayer.$PlayToPosition(duration, callback);
        };

        _SelfCarouselPlayer.$StandBy = function (standByPosition) {
            _StandBy = true;
            _StandByPosition = standByPosition;
            _SelfCarouselPlayer.$Play(standByPosition, null, true);
        };

        _SelfCarouselPlayer.$SetStandByPosition = function (standByPosition) {
            _StandByPosition = standByPosition;
        };

        _SelfCarouselPlayer.$MoveCarouselTo = function (position) {
            _Conveyor.$GoToPosition(position);
        };

        //CarouselPlayer Constructor
        {
            _Conveyor = new Conveyor();

            _Conveyor.$Combine(carousel);
            _Conveyor.$Combine(slideshow);
        }
    }
    //CarouselPlayer

    //SlideContainer
    function SlideContainer() {
        var _Self = this;
        var elmt = CreatePanel();

        $Jssor$.$CssZIndex(elmt, 0);
        $Jssor$.$Css(elmt, "pointerEvents", "none");

        _Self.$Elmt = elmt;

        _Self.$AddClipElement = function (clipElement) {
            $Jssor$.$AppendChild(elmt, clipElement);
            $Jssor$.$ShowElement(elmt);
        };

        _Self.$Clear = function () {
            $Jssor$.$HideElement(elmt);
            $Jssor$.$Empty(elmt);
        };
    }
    //SlideContainer

    //SlideItem
    function SlideItem(slideElmt, slideIndex) {

        var _SelfSlideItem = this;

        var _CaptionSliderIn;
        var _CaptionSliderOut;
        var _CaptionSliderCurrent;
        var _IsCaptionSliderPlayingWhenDragStart;

        var _Wrapper;
        var _BaseElement = slideElmt;

        var _LoadingScreen;

        var _ImageItem;
        var _ImageElmts = [];
        var _LinkItemOrigin;
        var _LinkItem;
        var _ImageLoading;
        var _ImageLoaded;
        var _ImageLazyLoading;
        var _ContentRefreshed;

        var _Processor;

        var _PlayerInstanceElement;
        var _PlayerInstance;

        var _SequenceNumber;    //for debug only

        $JssorAnimator$.call(_SelfSlideItem, -_DisplayPieces, _DisplayPieces + 1, { $SlideItemAnimator: true });

        function ResetCaptionSlider(fresh) {
            _CaptionSliderOut && _CaptionSliderOut.$Revert();
            _CaptionSliderIn && _CaptionSliderIn.$Revert();

            RefreshContent(slideElmt, fresh);
            _ContentRefreshed = true;

            _CaptionSliderIn = new _CaptionSliderOptions.$Class(slideElmt, _CaptionSliderOptions, 1);
            $JssorDebug$.$LiveStamp(_CaptionSliderIn, "caption_slider_" + _CaptionSliderCount + "_in");
            _CaptionSliderOut = new _CaptionSliderOptions.$Class(slideElmt, _CaptionSliderOptions);
            $JssorDebug$.$LiveStamp(_CaptionSliderOut, "caption_slider_" + _CaptionSliderCount + "_out");

            $JssorDebug$.$Execute(function () {
                _CaptionSliderCount++;
            });

            _CaptionSliderOut.$GoToPosition(0);
            _CaptionSliderIn.$GoToPosition(0);
        }

        function EnsureCaptionSliderVersion() {
            if (_CaptionSliderIn.$Version < _CaptionSliderOptions.$Version) {
                ResetCaptionSlider();
            }
        }

        //event handling begin
        function LoadImageCompleteEventHandler(completeCallback, loadingScreen, image) {
            if (!_ImageLoaded) {
                _ImageLoaded = true;

                if (_ImageItem && image) {
                    var imageWidth = image.width;
                    var imageHeight = image.height;
                    var fillWidth = imageWidth;
                    var fillHeight = imageHeight;

                    if (imageWidth && imageHeight && _Options.$FillMode) {

                        //0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
                        if (_Options.$FillMode & 3 && (!(_Options.$FillMode & 4) || imageWidth > _SlideWidth || imageHeight > _SlideHeight)) {
                            var fitHeight = false;
                            var ratio = _SlideWidth / _SlideHeight * imageHeight / imageWidth;

                            if (_Options.$FillMode & 1) {
                                fitHeight = (ratio > 1);
                            }
                            else if (_Options.$FillMode & 2) {
                                fitHeight = (ratio < 1);
                            }
                            fillWidth = fitHeight ? imageWidth * _SlideHeight / imageHeight : _SlideWidth;
                            fillHeight = fitHeight ? _SlideHeight : imageHeight * _SlideWidth / imageWidth;
                        }

                        $Jssor$.$CssWidth(_ImageItem, fillWidth);
                        $Jssor$.$CssHeight(_ImageItem, fillHeight);
                        $Jssor$.$CssTop(_ImageItem, (_SlideHeight - fillHeight) / 2);
                        $Jssor$.$CssLeft(_ImageItem, (_SlideWidth - fillWidth) / 2);
                    }

                    $Jssor$.$CssPosition(_ImageItem, "absolute");

                    _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_LOAD_END, slideIndex);
                }
            }

            $Jssor$.$HideElement(loadingScreen);
            completeCallback && completeCallback(_SelfSlideItem);
        }

        function LoadSlideshowImageCompleteEventHandler(nextIndex, nextItem, slideshowTransition, loadingTicket) {
            if (loadingTicket == _LoadingTicket && _CurrentSlideIndex == slideIndex && _AutoPlay) {
                if (!_Frozen) {
                    var nextRealIndex = GetRealIndex(nextIndex);
                    _SlideshowRunner.$Initialize(nextRealIndex, slideIndex, nextItem, _SelfSlideItem, slideshowTransition);
                    nextItem.$HideContentForSlideshow();
                    _Slideshow.$Locate(nextRealIndex, 1);
                    _Slideshow.$GoToPosition(nextRealIndex);
                    _CarouselPlayer.$PlayCarousel(nextIndex, nextIndex, 0);
                }
            }
        }

        function SlideReadyEventHandler(loadingTicket) {
            if (loadingTicket == _LoadingTicket && _CurrentSlideIndex == slideIndex) {

                if (!_Processor) {
                    var slideshowProcessor = null;
                    if (_SlideshowRunner) {
                        if (_SlideshowRunner.$Index == slideIndex)
                            slideshowProcessor = _SlideshowRunner.$GetProcessor();
                        else
                            _SlideshowRunner.$Clear();
                    }

                    EnsureCaptionSliderVersion();

                    _Processor = new Processor(slideElmt, slideIndex, slideshowProcessor, _SelfSlideItem.$GetCaptionSliderIn(), _SelfSlideItem.$GetCaptionSliderOut());
                    _Processor.$SetPlayer(_PlayerInstance);
                }

                !_Processor.$IsPlaying() && _Processor.$Replay();
            }
        }

        function ParkEventHandler(currentIndex, previousIndex, manualActivate) {
            if (currentIndex == slideIndex) {

                if (currentIndex != previousIndex)
                    _SlideItems[previousIndex] && _SlideItems[previousIndex].$ParkOut();
                else
                    !manualActivate && _Processor && _Processor.$AdjustIdleOnPark();

                _PlayerInstance && _PlayerInstance.$Enable();

                //park in
                var loadingTicket = _LoadingTicket = $Jssor$.$GetNow();
                _SelfSlideItem.$LoadImage($Jssor$.$CreateCallback(null, SlideReadyEventHandler, loadingTicket));
            }
            else {
                var distance = Math.abs(slideIndex - currentIndex);
                var loadRange = _DisplayPieces + _Options.$LazyLoading - 1;
                if (!_ImageLazyLoading || distance <= loadRange) {
                    _SelfSlideItem.$LoadImage();
                }
            }
        }

        function SwipeStartEventHandler() {
            if (_CurrentSlideIndex == slideIndex && _Processor) {
                _Processor.$Stop();
                _PlayerInstance && _PlayerInstance.$Quit();
                _PlayerInstance && _PlayerInstance.$Disable();
                _Processor.$OpenSlideshowPanel();
            }
        }

        function FreezeEventHandler() {
            if (_CurrentSlideIndex == slideIndex && _Processor) {
                _Processor.$Stop();
            }
        }

        function ContentClickEventHandler(event) {
            if (_LastDragSucceded) {
                $Jssor$.$StopEvent(event);

                var checkElement = $Jssor$.$EvtSrc(event);
                while (checkElement && slideElmt !== checkElement) {
                    if (checkElement.tagName == "A") {
                        $Jssor$.$CancelEvent(event);
                    }
                    try {
                        checkElement = checkElement.parentNode;
                    } catch (e) {
                        // Firefox sometimes fires events for XUL elements, which throws
                        // a "permission denied" error. so this is not a child.
                        break;
                    }
                }
            }
        }

        function SlideClickEventHandler(event) {
            if (!_LastDragSucceded) {
                _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_CLICK, slideIndex, event);
            }
        }

        function PlayerAvailableEventHandler() {
            _PlayerInstance = _PlayerInstanceElement.pInstance;
            _Processor && _Processor.$SetPlayer(_PlayerInstance);
        }

        _SelfSlideItem.$LoadImage = function (completeCallback, loadingScreen) {
            loadingScreen = loadingScreen || _LoadingScreen;

            if (_ImageElmts.length && !_ImageLoaded) {

                $Jssor$.$ShowElement(loadingScreen);

                if (!_ImageLoading) {
                    _ImageLoading = true;
                    _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_LOAD_START, slideIndex);

                    $Jssor$.$Each(_ImageElmts, function (imageElmt) {

                        if (!$Jssor$.$Attribute(imageElmt, "src")) {
                            imageElmt.src = $Jssor$.$AttributeEx(imageElmt, "src2");
                            $Jssor$.$CssDisplay(imageElmt, imageElmt["display-origin"]);
                        }
                    });
                }
                $Jssor$.$LoadImages(_ImageElmts, _ImageItem, $Jssor$.$CreateCallback(null, LoadImageCompleteEventHandler, completeCallback, loadingScreen));
            }
            else {
                LoadImageCompleteEventHandler(completeCallback, loadingScreen);
            }
        };

        _SelfSlideItem.$GoForNextSlide = function () {
            if (_SlideshowRunner) {
                var slideshowTransition = _SlideshowRunner.$GetTransition(_SlideCount);

                if (slideshowTransition) {
                    var loadingTicket = _LoadingTicket = $Jssor$.$GetNow();

                    var nextIndex = slideIndex + _PlayReverse;
                    var nextItem = _SlideItems[GetRealIndex(nextIndex)];
                    return nextItem.$LoadImage($Jssor$.$CreateCallback(null, LoadSlideshowImageCompleteEventHandler, nextIndex, nextItem, slideshowTransition, loadingTicket), _LoadingScreen);
                }
            }

            PlayTo(_CurrentSlideIndex + _Options.$AutoPlaySteps * _PlayReverse);
        };

        _SelfSlideItem.$TryActivate = function () {
            ParkEventHandler(slideIndex, slideIndex, true);
        };

        _SelfSlideItem.$ParkOut = function () {
            //park out
            _PlayerInstance && _PlayerInstance.$Quit();
            _PlayerInstance && _PlayerInstance.$Disable();
            _SelfSlideItem.$UnhideContentForSlideshow();
            _Processor && _Processor.$Abort();
            _Processor = null;
            ResetCaptionSlider();
        };

        //for debug only
        _SelfSlideItem.$StampSlideItemElements = function (stamp) {
            stamp = _SequenceNumber + "_" + stamp;

            $JssorDebug$.$Execute(function () {
                if (_ImageItem)
                    $Jssor$.$Attribute(_ImageItem, "debug-id", stamp + "_slide_item_image_id");

                $Jssor$.$Attribute(slideElmt, "debug-id", stamp + "_slide_item_item_id");
            });

            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_Wrapper, "debug-id", stamp + "_slide_item_wrapper_id");
            });

            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_LoadingScreen, "debug-id", stamp + "_loading_container_id");
            });
        };

        _SelfSlideItem.$HideContentForSlideshow = function () {
            $Jssor$.$HideElement(slideElmt);
        };

        _SelfSlideItem.$UnhideContentForSlideshow = function () {
            $Jssor$.$ShowElement(slideElmt);
        };

        _SelfSlideItem.$EnablePlayer = function () {
            _PlayerInstance && _PlayerInstance.$Enable();
        };

        function RefreshContent(elmt, fresh, level) {
            $JssorDebug$.$Execute(function () {
                if ($Jssor$.$Attribute(elmt, "jssor-slider"))
                    $JssorDebug$.$Log("Child slider found.");
            });

            if ($Jssor$.$Attribute(elmt, "jssor-slider"))
                return;

            level = level || 0;

            if (!_ContentRefreshed) {
                if (elmt.tagName == "IMG") {
                    _ImageElmts.push(elmt);

                    if (!$Jssor$.$Attribute(elmt, "src")) {
                        _ImageLazyLoading = true;
                        elmt["display-origin"] = $Jssor$.$CssDisplay(elmt);
                        $Jssor$.$HideElement(elmt);
                    }
                }
                if ($Jssor$.$IsBrowserIe9Earlier()) {
                    $Jssor$.$CssZIndex(elmt, ($Jssor$.$CssZIndex(elmt) || 0) + 1);
                }
                if (_Options.$HWA && $Jssor$.$WebKitVersion()) {
                    if ($Jssor$.$WebKitVersion() < 534 || (!_SlideshowEnabled && !$Jssor$.$IsBrowserChrome())) {
                        $Jssor$.$EnableHWA(elmt);
                    }
                }
            }

            var childElements = $Jssor$.$Children(elmt);

            $Jssor$.$Each(childElements, function (childElement, i) {

                var childTagName = childElement.tagName;
                var uAttribute = $Jssor$.$AttributeEx(childElement, "u");
                if (uAttribute == "player" && !_PlayerInstanceElement) {
                    _PlayerInstanceElement = childElement;
                    if (_PlayerInstanceElement.pInstance) {
                        PlayerAvailableEventHandler();
                    }
                    else {
                        $Jssor$.$AddEvent(_PlayerInstanceElement, "dataavailable", PlayerAvailableEventHandler);
                    }
                }

                if (uAttribute == "caption") {
                    if (!$Jssor$.$IsBrowserIE() && !fresh) {

                        //if (childTagName == "A") {
                        //    $Jssor$.$RemoveEvent(childElement, "click", ContentClickEventHandler);
                        //    $Jssor$.$Attribute(childElement, "jssor-content", null);
                        //}

                        var captionElement = $Jssor$.$CloneNode(childElement, false, true);
                        $Jssor$.$InsertBefore(captionElement, childElement, elmt);
                        $Jssor$.$RemoveElement(childElement, elmt);
                        childElement = captionElement;

                        fresh = true;
                    }
                }
                else if (!_ContentRefreshed && !level && !_ImageItem) {

                    if (childTagName == "A") {
                        if ($Jssor$.$AttributeEx(childElement, "u") == "image") {
                            _ImageItem = $Jssor$.$FindChildByTag(childElement, "IMG");

                            $JssorDebug$.$Execute(function () {
                                if (!_ImageItem) {
                                    $JssorDebug$.$Error("slide html code definition error, no 'IMG' found in a 'image with link' slide.\r\n" + elmt.outerHTML);
                                }
                            });
                        }
                        else {
                            _ImageItem = $Jssor$.$FindChild(childElement, "image", true);
                        }

                        if (_ImageItem) {
                            _LinkItemOrigin = childElement;
                            $Jssor$.$SetStyles(_LinkItemOrigin, _StyleDef);

                            _LinkItem = $Jssor$.$CloneNode(_LinkItemOrigin, true);
                            //$Jssor$.$AddEvent(_LinkItem, "click", ContentClickEventHandler);

                            $Jssor$.$CssDisplay(_LinkItem, "block");
                            $Jssor$.$SetStyles(_LinkItem, _StyleDef);
                            $Jssor$.$CssOpacity(_LinkItem, 0);
                            $Jssor$.$Css(_LinkItem, "backgroundColor", "#000");
                        }
                    }
                    else if (childTagName == "IMG" && $Jssor$.$AttributeEx(childElement, "u") == "image") {
                        _ImageItem = childElement;
                    }

                    if (_ImageItem) {
                        _ImageItem.border = 0;
                        $Jssor$.$SetStyles(_ImageItem, _StyleDef);
                    }
                }

                //if (!$Jssor$.$Attribute(childElement, "jssor-content")) {
                //    //cancel click event on <A> element when a drag of slide succeeded
                //    $Jssor$.$AddEvent(childElement, "click", ContentClickEventHandler);
                //    $Jssor$.$Attribute(childElement, "jssor-content", true);
                //}

                RefreshContent(childElement, fresh, level +1);
            });
        }

        _SelfSlideItem.$OnInnerOffsetChange = function (oldOffset, newOffset) {
            var slidePosition = _DisplayPieces - newOffset;

            SetPosition(_Wrapper, slidePosition);

            //following lines are for future usage, not ready yet
            //if (!_IsDragging || !_IsCaptionSliderPlayingWhenDragStart) {
            //    var _DealWithParallax;
            //    if (IsCurrentSlideIndex(slideIndex)) {
            //        if (_CaptionSliderOptions.$PlayOutMode == 2)
            //            _DealWithParallax = true;
            //    }
            //    else {
            //        if (!_CaptionSliderOptions.$PlayInMode) {
            //            //PlayInMode: 0 none
            //            _CaptionSliderIn.$GoToEnd();
            //        }
            //        //else if (_CaptionSliderOptions.$PlayInMode == 1) {
            //        //    //PlayInMode: 1 chain
            //        //    _CaptionSliderIn.$GoToPosition(0);
            //        //}
            //        else if (_CaptionSliderOptions.$PlayInMode == 2) {
            //            //PlayInMode: 2 parallel
            //            _DealWithParallax = true;
            //        }
            //    }

            //    if (_DealWithParallax) {
            //        _CaptionSliderIn.$GoToPosition((_CaptionSliderIn.$GetPosition_OuterEnd() - _CaptionSliderIn.$GetPosition_OuterBegin()) * Math.abs(newOffset - 1) * .8 + _CaptionSliderIn.$GetPosition_OuterBegin());
            //    }
            //}
        };

        _SelfSlideItem.$GetCaptionSliderIn = function () {
            return _CaptionSliderIn;
        };

        _SelfSlideItem.$GetCaptionSliderOut = function () {
            return _CaptionSliderOut;
        };

        _SelfSlideItem.$Index = slideIndex;

        $JssorObject$.call(_SelfSlideItem);

        //SlideItem Constructor
        {

            var thumb = $Jssor$.$FindChild(slideElmt, "thumb", true);
            if (thumb) {
                _SelfSlideItem.$Thumb = $Jssor$.$CloneNode(thumb);
                $Jssor$.$RemoveAttribute(thumb, "id");
                $Jssor$.$HideElement(thumb);
            }
            $Jssor$.$ShowElement(slideElmt);

            _LoadingScreen = $Jssor$.$CloneNode(_LoadingContainer);
            $Jssor$.$CssZIndex(_LoadingScreen, 1000);

            //cancel click event on <A> element when a drag of slide succeeded
            $Jssor$.$AddEvent(slideElmt, "click", SlideClickEventHandler);

            ResetCaptionSlider(true);

            _SelfSlideItem.$Image = _ImageItem;
            _SelfSlideItem.$Link = _LinkItem;

            _SelfSlideItem.$Item = slideElmt;

            _SelfSlideItem.$Wrapper = _Wrapper = slideElmt;
            $Jssor$.$AppendChild(_Wrapper, _LoadingScreen);

            _SelfSlider.$On(203, ParkEventHandler);
            _SelfSlider.$On(28, FreezeEventHandler);
            _SelfSlider.$On(24, SwipeStartEventHandler);

            $JssorDebug$.$Execute(function () {
                _SequenceNumber = _SlideItemCreatedCount++;
            });

            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_Wrapper, "debug-id", "slide-" + slideIndex);
            });
        }
    }
    //SlideItem

    //Processor
    function Processor(slideElmt, slideIndex, slideshowProcessor, captionSliderIn, captionSliderOut) {

        var _SelfProcessor = this;

        var _ProgressBegin = 0;
        var _SlideshowBegin = 0;
        var _SlideshowEnd;
        var _CaptionInBegin;
        var _IdleBegin;
        var _IdleEnd;
        var _ProgressEnd;

        var _IsSlideshowRunning;
        var _IsRollingBack;

        var _PlayerInstance;
        var _IsPlayerOnService;

        var slideItem = _SlideItems[slideIndex];

        $JssorAnimator$.call(_SelfProcessor, 0, 0);

        function UpdateLink() {

            $Jssor$.$Empty(_LinkContainer);

            if (_ShowLink && _IsSlideshowRunning && slideItem.$Link) {
                $Jssor$.$AppendChild(_LinkContainer, slideItem.$Link);
            }

            $Jssor$.$ShowElement(_LinkContainer, !_IsSlideshowRunning && slideItem.$Image);
        }

        function ProcessCompleteEventHandler() {

            if (_IsRollingBack) {
                _IsRollingBack = false;
                _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_ROLLBACK_END, slideIndex, _IdleEnd, _ProgressBegin, _IdleBegin, _IdleEnd, _ProgressEnd);
                _SelfProcessor.$GoToPosition(_IdleBegin);
            }

            _SelfProcessor.$Replay();
        }

        function PlayerSwitchEventHandler(isOnService) {
            _IsPlayerOnService = isOnService;

            _SelfProcessor.$Stop();
            _SelfProcessor.$Replay();
        }

        _SelfProcessor.$Replay = function () {

            var currentPosition = _SelfProcessor.$GetPosition_Display();

            if (!_IsDragging && !_IsSliding && !_IsPlayerOnService && _CurrentSlideIndex == slideIndex) {

                if (!currentPosition) {
                    if (_SlideshowEnd && !_IsSlideshowRunning) {
                        _IsSlideshowRunning = true;

                        _SelfProcessor.$OpenSlideshowPanel(true);

                        _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_SLIDESHOW_START, slideIndex, _ProgressBegin, _SlideshowBegin, _SlideshowEnd, _ProgressEnd);
                    }

                    UpdateLink();
                }

                var toPosition;
                var stateEvent = $JssorSlider$.$EVT_STATE_CHANGE;

                if (currentPosition != _ProgressEnd) {
                    if (currentPosition == _IdleEnd) {
                        toPosition = _ProgressEnd;
                    }
                    else if (currentPosition == _IdleBegin) {
                        toPosition = _IdleEnd;
                    }
                    else if (!currentPosition) {
                        toPosition = _IdleBegin;
                    }
                    else if (currentPosition > _IdleEnd) {
                        _IsRollingBack = true;
                        toPosition = _IdleEnd;
                        stateEvent = $JssorSlider$.$EVT_ROLLBACK_START;
                    }
                    else {
                        //continue from break (by drag or lock)
                        toPosition = _SelfProcessor.$GetPlayToPosition();
                    }
                }

                _SelfSlider.$TriggerEvent(stateEvent, slideIndex, currentPosition, _ProgressBegin, _IdleBegin, _IdleEnd, _ProgressEnd);

                var allowAutoPlay = _AutoPlay && (!_HoverToPause || _NotOnHover);

                if (currentPosition == _ProgressEnd) {
                    (_IdleEnd != _ProgressEnd && !(_HoverToPause & 12) || allowAutoPlay) && slideItem.$GoForNextSlide();
                }
                else if (allowAutoPlay || currentPosition != _IdleEnd) {
                    _SelfProcessor.$PlayToPosition(toPosition, ProcessCompleteEventHandler);
                }
            }
        };

        _SelfProcessor.$AdjustIdleOnPark = function () {
            if (_IdleEnd == _ProgressEnd && _IdleEnd == _SelfProcessor.$GetPosition_Display())
                _SelfProcessor.$GoToPosition(_IdleBegin);
        };

        _SelfProcessor.$Abort = function () {
            _SlideshowRunner && _SlideshowRunner.$Index == slideIndex && _SlideshowRunner.$Clear();

            var currentPosition = _SelfProcessor.$GetPosition_Display();
            if (currentPosition < _ProgressEnd) {
                _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_STATE_CHANGE, slideIndex, -currentPosition - 1, _ProgressBegin, _IdleBegin, _IdleEnd, _ProgressEnd);
            }
        };

        _SelfProcessor.$OpenSlideshowPanel = function (open) {
            if (slideshowProcessor) {
                $Jssor$.$CssOverflow(_SlideshowPanel, open && slideshowProcessor.$Transition.$Outside ? "" : "hidden");
            }
        };

        _SelfProcessor.$OnInnerOffsetChange = function (oldPosition, newPosition) {

            if (_IsSlideshowRunning && newPosition >= _SlideshowEnd) {
                _IsSlideshowRunning = false;
                UpdateLink();
                slideItem.$UnhideContentForSlideshow();
                _SlideshowRunner.$Clear();

                _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_SLIDESHOW_END, slideIndex, _ProgressBegin, _SlideshowBegin, _SlideshowEnd, _ProgressEnd);
            }

            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_PROGRESS_CHANGE, slideIndex, newPosition, _ProgressBegin, _IdleBegin, _IdleEnd, _ProgressEnd);
        };

        _SelfProcessor.$SetPlayer = function (playerInstance) {
            if (playerInstance && !_PlayerInstance) {
                _PlayerInstance = playerInstance;

                playerInstance.$On($JssorPlayer$.$EVT_SWITCH, PlayerSwitchEventHandler);
            }
        };

        //Processor Constructor
        {
            if (slideshowProcessor) {
                _SelfProcessor.$Chain(slideshowProcessor);
            }

            _SlideshowEnd = _SelfProcessor.$GetPosition_OuterEnd();
            _CaptionInBegin = _SelfProcessor.$GetPosition_OuterEnd();
            _SelfProcessor.$Chain(captionSliderIn);
            _IdleBegin = captionSliderIn.$GetPosition_OuterEnd();
            _IdleEnd = _IdleBegin + ($Jssor$.$ParseFloat($Jssor$.$AttributeEx(slideElmt, "idle")) || _AutoPlayInterval);

            captionSliderOut.$Shift(_IdleEnd);
            _SelfProcessor.$Combine(captionSliderOut);
            _ProgressEnd = _SelfProcessor.$GetPosition_OuterEnd();
        }
    }
    //Processor
    //#endregion

    function SetPosition(elmt, position) {
        var orientation = _DragOrientation > 0 ? _DragOrientation : _PlayOrientation;
        var x = _StepLengthX * position * (orientation & 1);
        var y = _StepLengthY * position * ((orientation >> 1) & 1);

        x = Math.round(x);
        y = Math.round(y);

        $Jssor$.$CssLeft(elmt, x);
        $Jssor$.$CssTop(elmt, y);
    }

    //#region Event handling begin

    function RecordFreezePoint() {
        _CarouselPlaying_OnFreeze = _IsSliding;
        _PlayToPosition_OnFreeze = _CarouselPlayer.$GetPlayToPosition();
        _Position_OnFreeze = _Conveyor.$GetPosition();
    }

    function Freeze() {
        RecordFreezePoint();

        if (_IsDragging || !_NotOnHover && (_HoverToPause & 12)) {
            _CarouselPlayer.$Stop();

            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_FREEZE);
        }
    }

    function Unfreeze(byDrag) {

        if (!_IsDragging && (_NotOnHover || !(_HoverToPause & 12)) && !_CarouselPlayer.$IsPlaying()) {

            var currentPosition = _Conveyor.$GetPosition();
            var toPosition = Math.ceil(_Position_OnFreeze);

            if (byDrag && Math.abs(_DragOffsetTotal) >= _Options.$MinDragOffsetToSlide) {
                toPosition = Math.ceil(currentPosition);
                toPosition += _DragIndexAdjust;
            }

            if (!(_Loop & 1)) {
                toPosition = Math.min(_SlideCount - _DisplayPieces, Math.max(toPosition, 0));
            }

            var t = Math.abs(toPosition - currentPosition);
            t = 1 - Math.pow(1 - t, 5);

            if (!_LastDragSucceded && _CarouselPlaying_OnFreeze) {
                _CarouselPlayer.$Continue(_PlayToPosition_OnFreeze);
            }
            else if (currentPosition == toPosition) {
                _CurrentSlideItem.$EnablePlayer();
                _CurrentSlideItem.$TryActivate();
            }
            else {

                _CarouselPlayer.$PlayCarousel(currentPosition, toPosition, t * _SlideDuration);
            }
        }
    }

    function PreventDragSelectionEvent(event) {
        if (!$Jssor$.$AttributeEx($Jssor$.$EvtSrc(event), "nodrag")) {
            $Jssor$.$CancelEvent(event);
        }
    }

    function OnTouchStart(event) {
        OnDragStart(event, 1);
    }

    function OnDragStart(event, touch) {
        event = $Jssor$.$GetEvent(event);
        var eventSrc = $Jssor$.$EvtSrc(event);

        if (!_DragOrientationRegistered && !$Jssor$.$AttributeEx(eventSrc, "nodrag") && RegisterDrag() && (!touch || event.touches.length == 1)) {
            _IsDragging = true;
            _DragInvalid = false;
            _LoadingTicket = null;

            $Jssor$.$AddEvent(document, touch ? "touchmove" : "mousemove", OnDragMove);

            _LastTimeMoveByDrag = $Jssor$.$GetNow() - 50;

            _LastDragSucceded = 0;
            Freeze();

            if (!_CarouselPlaying_OnFreeze)
                _DragOrientation = 0;

            if (touch) {
                var touchPoint = event.touches[0];
                _DragStartMouseX = touchPoint.clientX;
                _DragStartMouseY = touchPoint.clientY;
            }
            else {
                var mousePoint = $Jssor$.$MousePosition(event);

                _DragStartMouseX = mousePoint.x;
                _DragStartMouseY = mousePoint.y;
            }

            _DragOffsetTotal = 0;
            _DragOffsetLastTime = 0;
            _DragIndexAdjust = 0;

            //Trigger EVT_DRAGSTART
            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_DRAG_START, GetRealIndex(_Position_OnFreeze), _Position_OnFreeze, event);
        }
    }

    function OnDragMove(event) {
        if (_IsDragging) {
            event = $Jssor$.$GetEvent(event);

            var actionPoint;

            if (event.type != "mousemove") {
                var touch = event.touches[0];
                actionPoint = { x: touch.clientX, y: touch.clientY };
            }
            else {
                actionPoint = $Jssor$.$MousePosition(event);
            }

            if (actionPoint) {
                var distanceX = actionPoint.x - _DragStartMouseX;
                var distanceY = actionPoint.y - _DragStartMouseY;


                if (Math.floor(_Position_OnFreeze) != _Position_OnFreeze)
                    _DragOrientation = _DragOrientation || (_PlayOrientation & _DragOrientationRegistered);

                if ((distanceX || distanceY) && !_DragOrientation) {
                    if (_DragOrientationRegistered == 3) {
                        if (Math.abs(distanceY) > Math.abs(distanceX)) {
                            _DragOrientation = 2;
                        }
                        else
                            _DragOrientation = 1;
                    }
                    else {
                        _DragOrientation = _DragOrientationRegistered;
                    }

                    if (_IsTouchDevice && _DragOrientation == 1 && Math.abs(distanceY) - Math.abs(distanceX) > 3) {
                        _DragInvalid = true;
                    }
                }

                if (_DragOrientation) {
                    var distance = distanceY;
                    var stepLength = _StepLengthY;

                    if (_DragOrientation == 1) {
                        distance = distanceX;
                        stepLength = _StepLengthX;
                    }

                    if (!(_Loop & 1)) {
                        if (distance > 0) {
                            var normalDistance = stepLength * _CurrentSlideIndex;
                            var sqrtDistance = distance - normalDistance;
                            if (sqrtDistance > 0) {
                                distance = normalDistance + Math.sqrt(sqrtDistance) * 5;
                            }
                        }

                        if (distance < 0) {
                            var normalDistance = stepLength * (_SlideCount - _DisplayPieces - _CurrentSlideIndex);
                            var sqrtDistance = -distance - normalDistance;

                            if (sqrtDistance > 0) {
                                distance = -normalDistance - Math.sqrt(sqrtDistance) * 5;
                            }
                        }
                    }

                    if (_DragOffsetTotal - _DragOffsetLastTime < -2) {
                        _DragIndexAdjust = 0;
                    }
                    else if (_DragOffsetTotal - _DragOffsetLastTime > 2) {
                        _DragIndexAdjust = -1;
                    }

                    _DragOffsetLastTime = _DragOffsetTotal;
                    _DragOffsetTotal = distance;
                    _PositionToGoByDrag = _Position_OnFreeze - _DragOffsetTotal / stepLength / (_ScaleRatio || 1);

                    if (_DragOffsetTotal && _DragOrientation && !_DragInvalid) {
                        $Jssor$.$CancelEvent(event);
                        if (!_IsSliding) {
                            _CarouselPlayer.$StandBy(_PositionToGoByDrag);
                        }
                        else
                            _CarouselPlayer.$SetStandByPosition(_PositionToGoByDrag);
                    }
                }
            }
        }
    }

    function OnDragEnd() {
        UnregisterDrag();

        if (_IsDragging) {

            _IsDragging = false;

            _LastTimeMoveByDrag = $Jssor$.$GetNow();

            $Jssor$.$RemoveEvent(document, "mousemove", OnDragMove);
            $Jssor$.$RemoveEvent(document, "touchmove", OnDragMove);

            _LastDragSucceded = _DragOffsetTotal;

            _CarouselPlayer.$Stop();

            var currentPosition = _Conveyor.$GetPosition();

            //Trigger EVT_DRAG_END
            _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_DRAG_END, GetRealIndex(currentPosition), currentPosition, GetRealIndex(_Position_OnFreeze), _Position_OnFreeze);

            (_HoverToPause & 12) && RecordFreezePoint();

            Unfreeze(true);
        }
    }

    function SlidesClickEventHandler(event) {
        if (_LastDragSucceded) {
            $Jssor$.$StopEvent(event);

            var checkElement = $Jssor$.$EvtSrc(event);
            while (checkElement && _SlidesContainer !== checkElement) {
                if (checkElement.tagName == "A") {
                    $Jssor$.$CancelEvent(event);
                }
                try {
                    checkElement = checkElement.parentNode;
                } catch (e) {
                    // Firefox sometimes fires events for XUL elements, which throws
                    // a "permission denied" error. so this is not a child.
                    break;
                }
            }
        }
    }
    //#endregion

    function SetCurrentSlideIndex(index) {
        _PrevSlideItem = _SlideItems[_CurrentSlideIndex];
        _PreviousSlideIndex = _CurrentSlideIndex;
        _CurrentSlideIndex = GetRealIndex(index);
        _CurrentSlideItem = _SlideItems[_CurrentSlideIndex];
        ResetNavigator(index);
        return _CurrentSlideIndex;
    }

    function OnPark(slideIndex, prevIndex) {
        _DragOrientation = 0;

        SetCurrentSlideIndex(slideIndex);

        //Trigger EVT_PARK
        _SelfSlider.$TriggerEvent($JssorSlider$.$EVT_PARK, GetRealIndex(slideIndex), prevIndex);
    }

    function ResetNavigator(index, temp) {
        _TempSlideIndex = index;
        $Jssor$.$Each(_Navigators, function (navigator) {
            navigator.$SetCurrentIndex(GetRealIndex(index), index, temp);
        });
    }

    function RegisterDrag() {
        var dragRegistry = $JssorSlider$.$DragRegistry || 0;
        var dragOrientation = _DragEnabled;
        if (_IsTouchDevice)
            (dragOrientation & 1) && (dragOrientation &= 1);
        $JssorSlider$.$DragRegistry |= dragOrientation;

        return (_DragOrientationRegistered = dragOrientation & ~dragRegistry);
    }

    function UnregisterDrag() {
        if (_DragOrientationRegistered) {
            $JssorSlider$.$DragRegistry &= ~_DragEnabled;
            _DragOrientationRegistered = 0;
        }
    }

    function CreatePanel() {
        var div = $Jssor$.$CreateDiv();

        $Jssor$.$SetStyles(div, _StyleDef);
        $Jssor$.$CssPosition(div, "absolute");

        return div;
    }

    function GetRealIndex(index) {
        return (index % _SlideCount + _SlideCount) % _SlideCount;
    }

    function IsCurrentSlideIndex(index) {
        return GetRealIndex(index) == _CurrentSlideIndex;
    }

    function IsPreviousSlideIndex(index) {
        return GetRealIndex(index) == _PreviousSlideIndex;
    }

    //Navigation Request Handler
    function NavigationClickHandler(index, relative) {
        if (relative) {
            if (!_Loop) {
                //Stop at threshold
                index = Math.min(Math.max(index + _TempSlideIndex, 0), _SlideCount - _DisplayPieces);
                relative = false;
            }
            else if (_Loop & 2) {
                //Rewind
                index = GetRealIndex(index + _TempSlideIndex);
                relative = false;
            }
        }
        PlayTo(index, _Options.$SlideDuration, relative);
    }

    function ShowNavigators() {
        $Jssor$.$Each(_Navigators, function (navigator) {
            navigator.$Show(navigator.$Options.$ChanceToShow <= _NotOnHover);
        });
    }

    function MainContainerMouseLeaveEventHandler() {
        if (!_NotOnHover) {

            //$JssorDebug$.$Log("mouseleave");

            _NotOnHover = 1;

            ShowNavigators();

            if (!_IsDragging) {
                (_HoverToPause & 12) && Unfreeze();
                (_HoverToPause & 3) && _SlideItems[_CurrentSlideIndex].$TryActivate();
            }
        }
    }

    function MainContainerMouseEnterEventHandler() {

        if (_NotOnHover) {

            //$JssorDebug$.$Log("mouseenter");

            _NotOnHover = 0;

            ShowNavigators();

            _IsDragging || !(_HoverToPause & 12) || Freeze();
        }
    }

    function AdjustSlidesContainerSize() {
        _StyleDef = { $Width: _SlideWidth, $Height: _SlideHeight, $Top: 0, $Left: 0 };

        $Jssor$.$Each(_SlideElmts, function (slideElmt, i) {

            $Jssor$.$SetStyles(slideElmt, _StyleDef);
            $Jssor$.$CssPosition(slideElmt, "absolute");
            $Jssor$.$CssOverflow(slideElmt, "hidden");

            $Jssor$.$HideElement(slideElmt);
        });

        $Jssor$.$SetStyles(_LoadingContainer, _StyleDef);
    }

    function PlayToOffset(offset, slideDuration) {
        PlayTo(offset, slideDuration, true);
    }

    function PlayTo(slideIndex, slideDuration, relative) {
        ///	<summary>
        ///		PlayTo( slideIndex [, slideDuration] ); //Play slider to position 'slideIndex' within a period calculated base on 'slideDuration'.
        ///	</summary>
        ///	<param name="slideIndex" type="Number">
        ///		slide slideIndex or position will be playing to
        ///	</param>
        ///	<param name="slideDuration" type="Number" optional="true">
        ///		base slide duration in milliseconds to calculate the whole duration to complete this play request.
        ///	    default value is '$SlideDuration' value which is specified when initialize the slider.
        ///	</param>
        /// http://msdn.microsoft.com/en-us/library/vstudio/bb385682.aspx
        /// http://msdn.microsoft.com/en-us/library/vstudio/hh542720.aspx
        if (_CarouselEnabled && (!_IsDragging || _Options.$NaviQuitDrag)) {
            _IsSliding = true;
            _IsDragging = false;
            _CarouselPlayer.$Stop();

            {
                //Slide Duration
                if (slideDuration == undefined)
                    slideDuration = _SlideDuration;

                var positionDisplay = _Carousel.$GetPosition_Display();
                var positionTo = slideIndex;
                if (relative) {
                    positionTo = positionDisplay + slideIndex;
                    if (slideIndex > 0)
                        positionTo = Math.ceil(positionTo);
                    else
                        positionTo = Math.floor(positionTo);
                }

                if (_Loop & 2) {
                    //Rewind
                    positionTo = GetRealIndex(positionTo);
                }
                if (!(_Loop & 1)) {
                    //Stop at threshold
                    positionTo = Math.max(0, Math.min(positionTo, _SlideCount - _DisplayPieces));
                }

                var positionOffset = (positionTo - positionDisplay) % _SlideCount;
                positionTo = positionDisplay + positionOffset;

                var duration = positionDisplay == positionTo ? 0 : slideDuration * Math.abs(positionOffset);
                duration = Math.min(duration, slideDuration * _DisplayPieces * 1.5);

                _CarouselPlayer.$PlayCarousel(positionDisplay, positionTo, duration || 1);
            }
        }
    }

    //private functions

    //member functions

    _SelfSlider.$PlayTo = PlayTo;

    _SelfSlider.$GoTo = function (slideIndex) {
        ///	<summary>
        ///		instance.$GoTo( slideIndex );   //Go to the specifed slide immediately with no play.
        ///	</summary>
        PlayTo(slideIndex, 1);
    };

    _SelfSlider.$Next = function () {
        ///	<summary>
        ///		instance.$Next();   //Play the slider to next slide.
        ///	</summary>
        PlayToOffset(1);
    };

    _SelfSlider.$Prev = function () {
        ///	<summary>
        ///		instance.$Prev();   //Play the slider to previous slide.
        ///	</summary>
        PlayToOffset(-1);
    };

    _SelfSlider.$Pause = function () {
        ///	<summary>
        ///		instance.$Pause();   //Pause the slider, prevent it from auto playing.
        ///	</summary>
        _AutoPlay = false;
    };

    _SelfSlider.$Play = function () {
        ///	<summary>
        ///		instance.$Play();   //Start auto play if the slider is currently paused.
        ///	</summary>
        if (!_AutoPlay) {
            _AutoPlay = true;
            _SlideItems[_CurrentSlideIndex] && _SlideItems[_CurrentSlideIndex].$TryActivate();
        }
    };

    _SelfSlider.$SetSlideshowTransitions = function (transitions) {
        ///	<summary>
        ///		instance.$SetSlideshowTransitions( transitions );   //Reset slideshow transitions for the slider.
        ///	</summary>
        $JssorDebug$.$Execute(function () {
            if (!transitions || !transitions.length) {
                $JssorDebug$.$Error("Can not set slideshow transitions, no transitions specified.");
            }
        });

        //$Jssor$.$TranslateTransitions(transitions);    //for old transition compatibility
        _Options.$SlideshowOptions.$Transitions = transitions;
    };

    _SelfSlider.$SetCaptionTransitions = function (transitions) {
        ///	<summary>
        ///		instance.$SetCaptionTransitions( transitions );   //Reset caption transitions for the slider.
        ///	</summary>
        $JssorDebug$.$Execute(function () {
            if (!transitions || !transitions.length) {
                $JssorDebug$.$Error("Can not set caption transitions, no transitions specified");
            }
        });

        //$Jssor$.$TranslateTransitions(transitions);    //for old transition compatibility
        _CaptionSliderOptions.$CaptionTransitions = transitions;
        _CaptionSliderOptions.$Version = $Jssor$.$GetNow();
    };

    _SelfSlider.$SlidesCount = function () {
        ///	<summary>
        ///		instance.$SlidesCount();   //Retrieve slides count of the slider.
        ///	</summary>
        return _SlideElmts.length;
    };

    _SelfSlider.$CurrentIndex = function () {
        ///	<summary>
        ///		instance.$CurrentIndex();   //Retrieve current slide index of the slider.
        ///	</summary>
        return _CurrentSlideIndex;
    };

    _SelfSlider.$IsAutoPlaying = function () {
        ///	<summary>
        ///		instance.$IsAutoPlaying();   //Retrieve auto play status of the slider.
        ///	</summary>
        return _AutoPlay;
    };

    _SelfSlider.$IsDragging = function () {
        ///	<summary>
        ///		instance.$IsDragging();   //Retrieve drag status of the slider.
        ///	</summary>
        return _IsDragging;
    };

    _SelfSlider.$IsSliding = function () {
        ///	<summary>
        ///		instance.$IsSliding();   //Retrieve right<-->left sliding status of the slider.
        ///	</summary>
        return _IsSliding;
    };

    _SelfSlider.$IsMouseOver = function () {
        ///	<summary>
        ///		instance.$IsMouseOver();   //Retrieve mouse over status of the slider.
        ///	</summary>
        return !_NotOnHover;
    };

    _SelfSlider.$LastDragSucceded = function () {
        ///	<summary>
        ///		instance.$IsLastDragSucceded();   //Retrieve last drag succeded status, returns 0 if failed, returns drag offset if succeded
        ///	</summary>
        return _LastDragSucceded;
    };

    function OriginalWidth() {
        ///	<summary>
        ///		instance.$OriginalWidth();   //Retrieve original width of the slider.
        ///	</summary>
        return $Jssor$.$CssWidth(_ScaleWrapper || elmt);
    }

    function OriginalHeight() {
        ///	<summary>
        ///		instance.$OriginalHeight();   //Retrieve original height of the slider.
        ///	</summary>
        return $Jssor$.$CssHeight(_ScaleWrapper || elmt);
    }

    _SelfSlider.$OriginalWidth = _SelfSlider.$GetOriginalWidth = OriginalWidth;

    _SelfSlider.$OriginalHeight = _SelfSlider.$GetOriginalHeight = OriginalHeight;

    function Scale(dimension, isHeight) {
        ///	<summary>
        ///		instance.$ScaleWidth();   //Retrieve scaled dimension the slider currently displays.
        ///		instance.$ScaleWidth( dimension );   //Scale the slider to new width and keep aspect ratio.
        ///	</summary>

        if (dimension == undefined)
            return $Jssor$.$CssWidth(elmt);

        if (!_ScaleWrapper) {
            $JssorDebug$.$Execute(function () {
                var originalWidthStr = $Jssor$.$Css(elmt, "width");
                var originalHeightStr = $Jssor$.$Css(elmt, "height");
                var originalWidth = $Jssor$.$CssP(elmt, "width");
                var originalHeight = $Jssor$.$CssP(elmt, "height");

                if (!originalWidthStr || originalWidthStr.indexOf("px") == -1) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'width' of 'outer container' not specified. Please specify 'width' in pixel. e.g. 'width: 600px;'");
                }

                if (!originalHeightStr || originalHeightStr.indexOf("px") == -1) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'height' of 'outer container' not specified. Please specify 'height' in pixel. e.g. 'height: 300px;'");
                }

                if (originalWidthStr.indexOf('%') != -1) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'width' of 'outer container' not valid. Please specify 'width' in pixel. e.g. 'width: 600px;'");
                }

                if (originalHeightStr.indexOf('%') != -1) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'height' of 'outer container' not valid. Please specify 'height' in pixel. e.g. 'height: 300px;'");
                }

                if (!originalWidth) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'width' of 'outer container' not valid. 'width' of 'outer container' should be positive number. e.g. 'width: 600px;'");
                }

                if (!originalHeight) {
                    $JssorDebug$.$Fail("Cannot scale jssor slider, 'height' of 'outer container' not valid. 'height' of 'outer container' should be positive number. e.g. 'height: 300px;'");
                }
            });

            var innerWrapper = $Jssor$.$CreateDiv(document);
            $Jssor$.$ClassName(innerWrapper, $Jssor$.$ClassName(elmt));
            $Jssor$.$CssCssText(innerWrapper, $Jssor$.$CssCssText(elmt));
            $Jssor$.$CssDisplay(innerWrapper, "block");

            $Jssor$.$CssPosition(innerWrapper, "relative");
            $Jssor$.$CssTop(innerWrapper, 0);
            $Jssor$.$CssLeft(innerWrapper, 0);
            $Jssor$.$CssOverflow(innerWrapper, "visible");

            _ScaleWrapper = $Jssor$.$CreateDiv(document);

            $Jssor$.$CssPosition(_ScaleWrapper, "absolute");
            $Jssor$.$CssTop(_ScaleWrapper, 0);
            $Jssor$.$CssLeft(_ScaleWrapper, 0);
            $Jssor$.$CssWidth(_ScaleWrapper, $Jssor$.$CssWidth(elmt));
            $Jssor$.$CssHeight(_ScaleWrapper, $Jssor$.$CssHeight(elmt));
            $Jssor$.$SetStyleTransformOrigin(_ScaleWrapper, "0 0");

            $Jssor$.$AppendChild(_ScaleWrapper, innerWrapper);

            var children = $Jssor$.$Children(elmt);
            $Jssor$.$AppendChild(elmt, _ScaleWrapper);

            $Jssor$.$Css(elmt, "backgroundImage", "");

            //var noMoveElmts = {
            //    "navigator": _BulletNavigatorOptions && _BulletNavigatorOptions.$Scale == false,
            //    "arrowleft": _ArrowNavigatorOptions && _ArrowNavigatorOptions.$Scale == false,
            //    "arrowright": _ArrowNavigatorOptions && _ArrowNavigatorOptions.$Scale == false,
            //    "thumbnavigator": _ThumbnailNavigatorOptions && _ThumbnailNavigatorOptions.$Scale == false,
            //    "thumbwrapper": _ThumbnailNavigatorOptions && _ThumbnailNavigatorOptions.$Scale == false
            //};

            $Jssor$.$Each(children, function (child) {
                $Jssor$.$AppendChild($Jssor$.$AttributeEx(child, "noscale") ? elmt : innerWrapper, child);
                //$Jssor$.$AppendChild(noMoveElmts[$Jssor$.$AttributeEx(child, "u")] ? elmt : innerWrapper, child);
            });
        }

        $JssorDebug$.$Execute(function () {
            if (!dimension || dimension < 0) {
                $JssorDebug$.$Fail("'$ScaleWidth' error, 'dimension' should be positive value.");
            }
        });

        $JssorDebug$.$Execute(function () {
            if (!_InitialScrollWidth) {
                _InitialScrollWidth = _SelfSlider.$Elmt.scrollWidth;
            }
        });

        _ScaleRatio = dimension / (isHeight ? $Jssor$.$CssHeight : $Jssor$.$CssWidth)(_ScaleWrapper);
        $Jssor$.$CssScale(_ScaleWrapper, _ScaleRatio);

        var scaleWidth = isHeight ? (_ScaleRatio * OriginalWidth()) : dimension;
        var scaleHeight = isHeight ? dimension : (_ScaleRatio * OriginalHeight());

        $Jssor$.$CssWidth(elmt, scaleWidth);
        $Jssor$.$CssHeight(elmt, scaleHeight);

        $Jssor$.$Each(_Navigators, function (navigator) {
            navigator.$Relocate(scaleWidth, scaleHeight);
        });
    }

    _SelfSlider.$ScaleHeight = _SelfSlider.$GetScaleHeight = function (height) {
        ///	<summary>
        ///		instance.$ScaleHeight();   //Retrieve scaled height the slider currently displays.
        ///		instance.$ScaleHeight( dimension );   //Scale the slider to new height and keep aspect ratio.
        ///	</summary>

        if (height == undefined)
            return $Jssor$.$CssHeight(elmt);

        Scale(height, true);
    };

    _SelfSlider.$ScaleWidth = _SelfSlider.$SetScaleWidth = _SelfSlider.$GetScaleWidth = Scale;

    _SelfSlider.$GetVirtualIndex = function (index) {
        var parkingIndex = Math.ceil(GetRealIndex(_ParkingPosition / _StepLength));
        var displayIndex = GetRealIndex(index - _CurrentSlideIndex + parkingIndex);

        if (displayIndex > _DisplayPieces) {
            if (index - _CurrentSlideIndex > _SlideCount / 2)
                index -= _SlideCount;
            else if (index - _CurrentSlideIndex <= -_SlideCount / 2)
                index += _SlideCount;
        }
        else {
            index = _CurrentSlideIndex + displayIndex - parkingIndex;
        }

        return index;
    };

    //member functions

    $JssorObject$.call(_SelfSlider);

    $JssorDebug$.$Execute(function () {
        var outerContainerElmt = $Jssor$.$GetElement(elmt);
        if (!outerContainerElmt)
            $JssorDebug$.$Fail("Outer container '" + elmt + "' not found.");
    });

    //initialize member variables
    _SelfSlider.$Elmt = elmt = $Jssor$.$GetElement(elmt);
    //initialize member variables

    var _InitialScrollWidth;    //for debug only
    var _CaptionSliderCount = 1;    //for debug only

    var _Options = $Jssor$.$Extend({
        $FillMode: 0,                   //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
        $LazyLoading: 1,                //[Optional] For image with  lazy loading format (<IMG src2="url" .../>), by default it will be loaded only when the slide comes.
        //But an integer value (maybe 0, 1, 2 or 3) indicates that how far of nearby slides should be loaded immediately as well, default value is 1.
        $StartIndex: 0,                 //[Optional] Index of slide to display when initialize, default value is 0
        $AutoPlay: false,               //[Optional] Whether to auto play, default value is false
        $Loop: 1,                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
        $HWA: true,                     //[Optional] Enable hardware acceleration or not, default value is true
        $NaviQuitDrag: true,
        $AutoPlaySteps: 1,              //[Optional] Steps to go of every play (this options applys only when slideshow disabled), default value is 1
        $AutoPlayInterval: 3000,        //[Optional] Interval to play next slide since the previous stopped if a slideshow is auto playing, default value is 3000
        $PauseOnHover: 1,               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

        $SlideDuration: 500,            //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 400
        $SlideEasing: $JssorEasing$.$EaseOutQuad,   //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
        $MinDragOffsetToSlide: 20,      //[Optional] Minimum drag offset that trigger slide, default value is 20
        $SlideSpacing: 0, 				//[Optional] Space between each slide in pixels, default value is 0
        $DisplayPieces: 1,              //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), default value is 1
        $ParkingPosition: 0,            //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
        $UISearchMode: 1,               //[Optional] The way (0 parellel, 1 recursive, default value is recursive) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc.
        $PlayOrientation: 1,            //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
        $DragOrientation: 1             //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 both, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

    }, options);

    //going to use $Idle instead of $AutoPlayInterval
    if (_Options.$Idle != undefined)
        _Options.$AutoPlayInterval = _Options.$Idle;

    //going to use $Cols instead of $DisplayPieces
    if (_Options.$Cols != undefined)
        _Options.$DisplayPieces = _Options.$Cols;

    //Sodo statement for development time intellisence only
    $JssorDebug$.$Execute(function () {
        _Options = $Jssor$.$Extend({
            $ArrowKeyNavigation: undefined,
            $SlideWidth: undefined,
            $SlideHeight: undefined,
            $SlideshowOptions: undefined,
            $CaptionSliderOptions: undefined,
            $BulletNavigatorOptions: undefined,
            $ArrowNavigatorOptions: undefined,
            $ThumbnailNavigatorOptions: undefined
        },
        _Options);
    });

    var _PlayOrientation = _Options.$PlayOrientation & 3;
    var _PlayReverse = (_Options.$PlayOrientation & 4) / -4 || 1;

    var _SlideshowOptions = _Options.$SlideshowOptions;
    var _CaptionSliderOptions = $Jssor$.$Extend({ $Class: $JssorCaptionSliderBase$, $PlayInMode: 1, $PlayOutMode: 1 }, _Options.$CaptionSliderOptions);
    //$Jssor$.$TranslateTransitions(_CaptionSliderOptions.$CaptionTransitions); //for old transition compatibility
    var _BulletNavigatorOptions = _Options.$BulletNavigatorOptions;
    var _ArrowNavigatorOptions = _Options.$ArrowNavigatorOptions;
    var _ThumbnailNavigatorOptions = _Options.$ThumbnailNavigatorOptions;

    $JssorDebug$.$Execute(function () {
        if (_SlideshowOptions && !_SlideshowOptions.$Class) {
            $JssorDebug$.$Fail("Option $SlideshowOptions error, class not specified.");
        }
    });

    $JssorDebug$.$Execute(function () {
        if (_Options.$CaptionSliderOptions && !_Options.$CaptionSliderOptions.$Class) {
            $JssorDebug$.$Fail("Option $CaptionSliderOptions error, class not specified.");
        }
    });

    $JssorDebug$.$Execute(function () {
        if (_BulletNavigatorOptions && !_BulletNavigatorOptions.$Class) {
            $JssorDebug$.$Fail("Option $BulletNavigatorOptions error, class not specified.");
        }
    });

    $JssorDebug$.$Execute(function () {
        if (_ArrowNavigatorOptions && !_ArrowNavigatorOptions.$Class) {
            $JssorDebug$.$Fail("Option $ArrowNavigatorOptions error, class not specified.");
        }
    });

    $JssorDebug$.$Execute(function () {
        if (_ThumbnailNavigatorOptions && !_ThumbnailNavigatorOptions.$Class) {
            $JssorDebug$.$Fail("Option $ThumbnailNavigatorOptions error, class not specified.");
        }
    });

    var _UISearchNoDeep = !_Options.$UISearchMode;
    var _ScaleWrapper;
    var _SlidesContainer = $Jssor$.$FindChild(elmt, "slides", _UISearchNoDeep);
    var _LoadingContainer = $Jssor$.$FindChild(elmt, "loading", _UISearchNoDeep) || $Jssor$.$CreateDiv(document);

    var _BulletNavigatorContainer = $Jssor$.$FindChild(elmt, "navigator", _UISearchNoDeep);

    var _ArrowLeft = $Jssor$.$FindChild(elmt, "arrowleft", _UISearchNoDeep);
    var _ArrowRight = $Jssor$.$FindChild(elmt, "arrowright", _UISearchNoDeep);

    var _ThumbnailNavigatorContainer = $Jssor$.$FindChild(elmt, "thumbnavigator", _UISearchNoDeep);

    $JssorDebug$.$Execute(function () {
        //if (_BulletNavigatorOptions && !_BulletNavigatorContainer) {
        //    throw new Error("$BulletNavigatorOptions specified but bullet navigator container (<div u=\"navigator\" ...) not defined.");
        //}
        if (_BulletNavigatorContainer && !_BulletNavigatorOptions) {
            throw new Error("Bullet navigator container defined but $BulletNavigatorOptions not specified.");
        }

        //if (_ArrowNavigatorOptions) {
        //    if (!_ArrowLeft) {
        //        throw new Error("$ArrowNavigatorOptions specified, but arrowleft (<span u=\"arrowleft\" ...) not defined.");
        //    }

        //    if (!_ArrowRight) {
        //        throw new Error("$ArrowNavigatorOptions specified, but arrowright (<span u=\"arrowright\" ...) not defined.");
        //    }
        //}

        if ((_ArrowLeft || _ArrowRight) && !_ArrowNavigatorOptions) {
            throw new Error("arrowleft or arrowright defined, but $ArrowNavigatorOptions not specified.");
        }

        //if (_ThumbnailNavigatorOptions && !_ThumbnailNavigatorContainer) {
        //    throw new Error("$ThumbnailNavigatorOptions specified, but thumbnail navigator container (<div u=\"thumbnavigator\" ...) not defined.");
        //}

        if (_ThumbnailNavigatorContainer && !_ThumbnailNavigatorOptions) {
            throw new Error("Thumbnail navigator container defined, but $ThumbnailNavigatorOptions not specified.");
        }
    });

    var _SlidesContainerWidth = $Jssor$.$CssWidth(_SlidesContainer);
    var _SlidesContainerHeight = $Jssor$.$CssHeight(_SlidesContainer);

    $JssorDebug$.$Execute(function () {
        if (isNaN(_SlidesContainerWidth))
            $JssorDebug$.$Fail("Width of slides container wrong specification, it should be specified in pixel (like style='width: 600px;').");

        if (_SlidesContainerWidth == undefined)
            $JssorDebug$.$Fail("Width of slides container not specified, it should be specified in pixel (like style='width: 600px;').");

        if (isNaN(_SlidesContainerHeight))
            $JssorDebug$.$Fail("Height of slides container wrong specification, it should be specified in pixel (like style='height: 300px;').");

        if (_SlidesContainerHeight == undefined)
            $JssorDebug$.$Fail("Height of slides container not specified, it should be specified in pixel (like style='height: 300px;').");

        var slidesContainerOverflow = $Jssor$.$CssOverflow(_SlidesContainer);
        var slidesContainerOverflowX = $Jssor$.$Css(_SlidesContainer, "overflowX");
        var slidesContainerOverflowY = $Jssor$.$Css(_SlidesContainer, "overflowY");
        if (slidesContainerOverflow != "hidden" && (slidesContainerOverflowX != "hidden" || slidesContainerOverflowY != "hidden"))
            $JssorDebug$.$Fail("Overflow of slides container wrong specification, it should be specified as 'hidden' (style='overflow:hidden;').");
    });

    $JssorDebug$.$Execute(function () {
        if (!$Jssor$.$IsNumeric(_Options.$DisplayPieces))
            $JssorDebug$.$Fail("Option $DisplayPieces error, it should be a numeric value and greater than or equal to 1.");

        if (_Options.$DisplayPieces < 1)
            $JssorDebug$.$Fail("Option $DisplayPieces error, it should be greater than or equal to 1.");

        if (_Options.$DisplayPieces > 1 && _Options.$DragOrientation && _Options.$DragOrientation != _PlayOrientation)
            $JssorDebug$.$Fail("Option $DragOrientation error, it should be 0 or the same of $PlayOrientation when $DisplayPieces is greater than 1.");

        if (!$Jssor$.$IsNumeric(_Options.$ParkingPosition))
            $JssorDebug$.$Fail("Option $ParkingPosition error, it should be a numeric value.");

        if (_Options.$ParkingPosition && _Options.$DragOrientation && _Options.$DragOrientation != _PlayOrientation)
            $JssorDebug$.$Fail("Option $DragOrientation error, it should be 0 or the same of $PlayOrientation when $ParkingPosition is not equal to 0.");
    });

    var _StyleDef;

    var _SlideElmts = [];

    {
        var slideElmts = $Jssor$.$Children(_SlidesContainer);
        $Jssor$.$Each(slideElmts, function (slideElmt) {
            if (slideElmt.tagName == "DIV" && !$Jssor$.$AttributeEx(slideElmt, "u")) {
                _SlideElmts.push(slideElmt);
            }
            else if ($Jssor$.$IsBrowserIe9Earlier()) {
                $Jssor$.$CssZIndex(slideElmt, ($Jssor$.$CssZIndex(slideElmt) || 0) + 1);
            }
        });
    }

    $JssorDebug$.$Execute(function () {
        if (_SlideElmts.length < 1) {
            $JssorDebug$.$Error("Slides html code definition error, there must be at least 1 slide to initialize a slider.");
        }
    });

    var _SlideItemCreatedCount = 0; //for debug only
    var _SlideItemReleasedCount = 0;    //for debug only

    var _PreviousSlideIndex;
    var _CurrentSlideIndex = -1;
    var _TempSlideIndex;
    var _PrevSlideItem;
    var _CurrentSlideItem;
    var _SlideCount = _SlideElmts.length;

    var _SlideWidth = _Options.$SlideWidth || _SlidesContainerWidth;
    var _SlideHeight = _Options.$SlideHeight || _SlidesContainerHeight;

    var _SlideSpacing = _Options.$SlideSpacing;
    var _StepLengthX = _SlideWidth + _SlideSpacing;
    var _StepLengthY = _SlideHeight + _SlideSpacing;
    var _StepLength = (_PlayOrientation & 1) ? _StepLengthX : _StepLengthY;
    var _DisplayPieces = Math.min(_Options.$DisplayPieces, _SlideCount);

    var _SlideshowPanel;
    var _CurrentBoardIndex = 0;
    var _DragOrientation;
    var _DragOrientationRegistered;
    var _DragInvalid;

    var _Navigators = [];
    var _BulletNavigator;
    var _ArrowNavigator;
    var _ThumbnailNavigator;

    var _ShowLink;

    var _Frozen;
    var _AutoPlay;
    var _AutoPlaySteps = _Options.$AutoPlaySteps;
    var _HoverToPause = _Options.$PauseOnHover;
    var _AutoPlayInterval = _Options.$AutoPlayInterval;
    var _SlideDuration = _Options.$SlideDuration;

    var _SlideshowRunnerClass;
    var _TransitionsOrder;

    var _SlideshowEnabled;
    var _ParkingPosition;
    var _CarouselEnabled = _DisplayPieces < _SlideCount;
    var _Loop = _CarouselEnabled ? _Options.$Loop : 0;

    var _DragEnabled;
    var _LastDragSucceded;

    var _NotOnHover = 1;   //0 Hovering, 1 Not hovering

    //Variable Definition
    var _IsSliding;
    var _IsDragging;
    var _LoadingTicket;

    //The X position of mouse/touch when a drag start
    var _DragStartMouseX = 0;
    //The Y position of mouse/touch when a drag start
    var _DragStartMouseY = 0;
    var _DragOffsetTotal;
    var _DragOffsetLastTime;
    var _DragIndexAdjust;

    var _Carousel;
    var _Conveyor;
    var _Slideshow;
    var _CarouselPlayer;
    var _SlideContainer = new SlideContainer();
    var _ScaleRatio;

    //$JssorSlider$ Constructor
    {
        _AutoPlay = _Options.$AutoPlay;
        _SelfSlider.$Options = options;

        AdjustSlidesContainerSize();

        $Jssor$.$Attribute(elmt, "jssor-slider", true);

        $Jssor$.$CssZIndex(_SlidesContainer, $Jssor$.$CssZIndex(_SlidesContainer) || 0);
        $Jssor$.$CssPosition(_SlidesContainer, "absolute");
        _SlideshowPanel = $Jssor$.$CloneNode(_SlidesContainer, true);
        $Jssor$.$InsertBefore(_SlideshowPanel, _SlidesContainer);

        if (_SlideshowOptions) {
            _ShowLink = _SlideshowOptions.$ShowLink;
            _SlideshowRunnerClass = _SlideshowOptions.$Class;

            $JssorDebug$.$Execute(function () {
                if (!_SlideshowOptions.$Transitions || !_SlideshowOptions.$Transitions.length) {
                    $JssorDebug$.$Error("Invalid '$SlideshowOptions', no '$Transitions' specified.");
                }
            });

            _SlideshowEnabled = _DisplayPieces == 1 && _SlideCount > 1 && _SlideshowRunnerClass && (!$Jssor$.$IsBrowserIE() || $Jssor$.$BrowserVersion() >= 8);
        }

        _ParkingPosition = (_SlideshowEnabled || _DisplayPieces >= _SlideCount || !(_Loop & 1)) ? 0 : _Options.$ParkingPosition;

        _DragEnabled = ((_DisplayPieces > 1 || _ParkingPosition) ? _PlayOrientation : -1) & _Options.$DragOrientation;

        //SlideBoard
        var _SlideboardElmt = _SlidesContainer;
        var _SlideItems = [];

        var _SlideshowRunner;
        var _LinkContainer;

        var _Device = $Jssor$.$Device();
        var _IsTouchDevice = _Device.$Touchable;

        var _LastTimeMoveByDrag;
        var _Position_OnFreeze;
        var _CarouselPlaying_OnFreeze;
        var _PlayToPosition_OnFreeze;
        var _PositionToGoByDrag;

        //SlideBoard Constructor
        {
            if (_Device.$TouchActionAttr) {
                $Jssor$.$Css(_SlideboardElmt, _Device.$TouchActionAttr, [null, "pan-y", "pan-x", "none"][_DragEnabled] || "");
            }

            _Slideshow = new Slideshow();

            if (_SlideshowEnabled)
                _SlideshowRunner = new _SlideshowRunnerClass(_SlideContainer, _SlideWidth, _SlideHeight, _SlideshowOptions, _IsTouchDevice);

            $Jssor$.$AppendChild(_SlideshowPanel, _Slideshow.$Wrapper);
            $Jssor$.$CssOverflow(_SlidesContainer, "hidden");

            //link container
            {
                _LinkContainer = CreatePanel();
                $Jssor$.$Css(_LinkContainer, "backgroundColor", "#000");
                $Jssor$.$CssOpacity(_LinkContainer, 0);
                $Jssor$.$InsertBefore(_LinkContainer, _SlideboardElmt.firstChild, _SlideboardElmt);
            }

            for (var i = 0; i < _SlideElmts.length; i++) {
                var slideElmt = _SlideElmts[i];
                var slideItem = new SlideItem(slideElmt, i);
                _SlideItems.push(slideItem);
            }

            $Jssor$.$HideElement(_LoadingContainer);

            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_LoadingContainer, "debug-id", "loading-container");
            });

            _Carousel = new Carousel();
            _CarouselPlayer = new CarouselPlayer(_Carousel, _Slideshow);

            $JssorDebug$.$Execute(function () {
                $Jssor$.$Attribute(_SlideboardElmt, "debug-id", "slide-board");
            });

            if (_DragEnabled) {
                $Jssor$.$AddEvent(_SlidesContainer, "mousedown", OnDragStart);
                $Jssor$.$AddEvent(_SlidesContainer, "touchstart", OnTouchStart);
                $Jssor$.$AddEvent(_SlidesContainer, "dragstart", PreventDragSelectionEvent);
                $Jssor$.$AddEvent(_SlidesContainer, "selectstart", PreventDragSelectionEvent);
                $Jssor$.$AddEvent(document, "mouseup", OnDragEnd);
                $Jssor$.$AddEvent(document, "touchend", OnDragEnd);
                $Jssor$.$AddEvent(document, "touchcancel", OnDragEnd);
                $Jssor$.$AddEvent(window, "blur", OnDragEnd);
            }
        }
        //SlideBoard

        _HoverToPause &= (_IsTouchDevice ? 10 : 5);

        //Bullet Navigator
        if (_BulletNavigatorContainer && _BulletNavigatorOptions) {
            _BulletNavigator = new _BulletNavigatorOptions.$Class(_BulletNavigatorContainer, _BulletNavigatorOptions, OriginalWidth(), OriginalHeight());
            _Navigators.push(_BulletNavigator);
        }

        //Arrow Navigator
        if (_ArrowNavigatorOptions && _ArrowLeft && _ArrowRight) {
            _ArrowNavigatorOptions.$Loop = _Loop;
            _ArrowNavigatorOptions.$DisplayPieces = _DisplayPieces;
            _ArrowNavigator = new _ArrowNavigatorOptions.$Class(_ArrowLeft, _ArrowRight, _ArrowNavigatorOptions, OriginalWidth(), OriginalHeight());
            _Navigators.push(_ArrowNavigator);
        }

        //Thumbnail Navigator
        if (_ThumbnailNavigatorContainer && _ThumbnailNavigatorOptions) {
            _ThumbnailNavigatorOptions.$StartIndex = _Options.$StartIndex;
            _ThumbnailNavigator = new _ThumbnailNavigatorOptions.$Class(_ThumbnailNavigatorContainer, _ThumbnailNavigatorOptions);
            _Navigators.push(_ThumbnailNavigator);
        }

        $Jssor$.$Each(_Navigators, function (navigator) {
            navigator.$Reset(_SlideCount, _SlideItems, _LoadingContainer);
            navigator.$On($JssorNavigatorEvents$.$NAVIGATIONREQUEST, NavigationClickHandler);
        });

        Scale(OriginalWidth());

        $Jssor$.$AddEvent(_SlidesContainer, "click", SlidesClickEventHandler);
        $Jssor$.$AddEvent(elmt, "mouseout", $Jssor$.$MouseOverOutFilter(MainContainerMouseLeaveEventHandler, elmt));
        $Jssor$.$AddEvent(elmt, "mouseover", $Jssor$.$MouseOverOutFilter(MainContainerMouseEnterEventHandler, elmt));

        ShowNavigators();

        //Keyboard Navigation
        if (_Options.$ArrowKeyNavigation) {
            $Jssor$.$AddEvent(document, "keydown", function (e) {
                if (e.keyCode == 37/*$JssorKeyCode$.$LEFT*/) {
                    //Arrow Left
                    PlayToOffset(-1);
                }
                else if (e.keyCode == 39/*$JssorKeyCode$.$RIGHT*/) {
                    //Arrow Right
                    PlayToOffset(1);
                }
            });
        }

        var startPosition = _Options.$StartIndex;
        if (!(_Loop & 1)) {
            startPosition = Math.max(0, Math.min(startPosition, _SlideCount - _DisplayPieces));
        }
        _CarouselPlayer.$PlayCarousel(startPosition, startPosition, 0);
    }
};
var $JssorSlideo$ = window.$JssorSlideo$ = $JssorSlider$;

$JssorSlider$.$EVT_CLICK = 21;
$JssorSlider$.$EVT_DRAG_START = 22;
$JssorSlider$.$EVT_DRAG_END = 23;
$JssorSlider$.$EVT_SWIPE_START = 24;
$JssorSlider$.$EVT_SWIPE_END = 25;

$JssorSlider$.$EVT_LOAD_START = 26;
$JssorSlider$.$EVT_LOAD_END = 27;
$JssorSlider$.$EVT_FREEZE = 28;

$JssorSlider$.$EVT_POSITION_CHANGE = 202;
$JssorSlider$.$EVT_PARK = 203;

$JssorSlider$.$EVT_SLIDESHOW_START = 206;
$JssorSlider$.$EVT_SLIDESHOW_END = 207;

$JssorSlider$.$EVT_PROGRESS_CHANGE = 208;
$JssorSlider$.$EVT_STATE_CHANGE = 209;
$JssorSlider$.$EVT_ROLLBACK_START = 210;
$JssorSlider$.$EVT_ROLLBACK_END = 211;

//(function ($) {
//    jQuery.fn.jssorSlider = function (options) {
//        return this.each(function () {
//            return $(this).data('jssorSlider') || $(this).data('jssorSlider', new $JssorSlider$(this, options));
//        });
//    };
//})(jQuery);

//window.jQuery && (jQuery.fn.jssorSlider = function (options) {
//    return this.each(function () {
//        return jQuery(this).data('jssorSlider') || jQuery(this).data('jssorSlider', new $JssorSlider$(this, options));
//    });
//});

//$JssorBulletNavigator$
var $JssorNavigatorEvents$ = {
    $NAVIGATIONREQUEST: 1,
    $INDEXCHANGE: 2,
    $RESET: 3
};

var $JssorBulletNavigator$ = window.$JssorBulletNavigator$ = function (elmt, options, containerWidth, containerHeight) {
    var self = this;
    $JssorObject$.call(self);

    elmt = $Jssor$.$GetElement(elmt);

    var _Count;
    var _Length;
    var _Width;
    var _Height;
    var _CurrentIndex;
    var _CurrentInnerIndex = 0;
    var _Options;
    var _Steps;
    var _Lanes;
    var _SpacingX;
    var _SpacingY;
    var _Orientation;
    var _ItemPrototype;
    var _PrototypeWidth;
    var _PrototypeHeight;

    var _ButtonElements = [];
    var _Buttons = [];

    function Highlight(index) {
        if (index != -1)
            _Buttons[index].$Selected(index == _CurrentInnerIndex);
    }

    function OnNavigationRequest(index) {
        self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, index * _Steps);
    }

    self.$Elmt = elmt;
    self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    self.$SetCurrentIndex = function (index) {
        if (index != _CurrentIndex) {
            var lastInnerIndex = _CurrentInnerIndex;
            var innerIndex = Math.floor(index / _Steps);
            _CurrentInnerIndex = innerIndex;
            _CurrentIndex = index;

            Highlight(lastInnerIndex);
            Highlight(innerIndex);

            //self.$TriggerEvent($JssorNavigatorEvents$.$INDEXCHANGE, index);
        }
    };

    self.$Show = function (hide) {
        $Jssor$.$ShowElement(elmt, hide);
    };

    var _Located;
    self.$Relocate = function (containerWidth, containerHeight) {
        if (!_Located || _Options.$Scale == false) {
            var containerWidth = $Jssor$.$ParentNode(elmt).clientWidth;
            var containerHeight = $Jssor$.$ParentNode(elmt).clientHeight;

            if (_Options.$AutoCenter & 1) {
                $Jssor$.$CssLeft(elmt, (containerWidth - _Width) / 2);
            }
            if (_Options.$AutoCenter & 2) {
                $Jssor$.$CssTop(elmt, (containerHeight - _Height) / 2);
            }

            _Located = true;
        }
    };

    var _Initialized;
    self.$Reset = function (length) {
        if (!_Initialized) {
            _Length = length;
            _Count = Math.ceil(length / _Steps);
            _CurrentInnerIndex = 0;

            var itemOffsetX = _PrototypeWidth + _SpacingX;
            var itemOffsetY = _PrototypeHeight + _SpacingY;

            var maxIndex = Math.ceil(_Count / _Lanes) - 1;

            _Width = _PrototypeWidth + itemOffsetX * (!_Orientation ? maxIndex : _Lanes - 1);
            _Height = _PrototypeHeight + itemOffsetY * (_Orientation ? maxIndex : _Lanes - 1);

            $Jssor$.$CssWidth(elmt, _Width);
            $Jssor$.$CssHeight(elmt, _Height);

            for (var buttonIndex = 0; buttonIndex < _Count; buttonIndex++) {

                var numberDiv = $Jssor$.$CreateSpan();
                $Jssor$.$InnerText(numberDiv, buttonIndex + 1);

                var div = $Jssor$.$BuildElement(_ItemPrototype, "numbertemplate", numberDiv, true);
                $Jssor$.$CssPosition(div, "absolute");

                var columnIndex = buttonIndex % (maxIndex + 1);
                $Jssor$.$CssLeft(div, !_Orientation ? itemOffsetX * columnIndex : buttonIndex % _Lanes * itemOffsetX);
                $Jssor$.$CssTop(div, _Orientation ? itemOffsetY * columnIndex : Math.floor(buttonIndex / (maxIndex + 1)) * itemOffsetY);

                $Jssor$.$AppendChild(elmt, div);
                _ButtonElements[buttonIndex] = div;

                if (_Options.$ActionMode & 1)
                    $Jssor$.$AddEvent(div, "click", $Jssor$.$CreateCallback(null, OnNavigationRequest, buttonIndex));

                if (_Options.$ActionMode & 2)
                    $Jssor$.$AddEvent(div, "mouseover", $Jssor$.$MouseOverOutFilter($Jssor$.$CreateCallback(null, OnNavigationRequest, buttonIndex), div));

                _Buttons[buttonIndex] = $Jssor$.$Buttonize(div);
            }

            //self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
            _Initialized = true;
        }
    };

    //JssorBulletNavigator Constructor
    {
        self.$Options = _Options = $Jssor$.$Extend({
            $SpacingX: 0,
            $SpacingY: 0,
            $Orientation: 1,
            $ActionMode: 1
        }, options);

        //Sodo statement for development time intellisence only
        $JssorDebug$.$Execute(function () {
            _Options = $Jssor$.$Extend({
                $Steps: undefined,
                $Lanes: undefined
            }, _Options);
        });

        _ItemPrototype = $Jssor$.$FindChild(elmt, "prototype");

        $JssorDebug$.$Execute(function () {
            if (!_ItemPrototype)
                $JssorDebug$.$Fail("Navigator item prototype not defined.");

            if (isNaN($Jssor$.$CssWidth(_ItemPrototype))) {
                $JssorDebug$.$Fail("Width of 'navigator item prototype' not specified.");
            }

            if (isNaN($Jssor$.$CssHeight(_ItemPrototype))) {
                $JssorDebug$.$Fail("Height of 'navigator item prototype' not specified.");
            }
        });

        _PrototypeWidth = $Jssor$.$CssWidth(_ItemPrototype);
        _PrototypeHeight = $Jssor$.$CssHeight(_ItemPrototype);

        $Jssor$.$RemoveElement(_ItemPrototype, elmt);

        _Steps = _Options.$Steps || 1;
        _Lanes = _Options.$Lanes || 1;
        _SpacingX = _Options.$SpacingX;
        _SpacingY = _Options.$SpacingY;
        _Orientation = _Options.$Orientation - 1;

        if (_Options.$Scale == false) {
            $Jssor$.$Attribute(elmt, "noscale", true);
        }
    }
};

var $JssorArrowNavigator$ = window.$JssorArrowNavigator$ = function (arrowLeft, arrowRight, options, containerWidth, containerHeight) {
    var self = this;
    $JssorObject$.call(self);

    $JssorDebug$.$Execute(function () {

        if (!arrowLeft)
            $JssorDebug$.$Fail("Option '$ArrowNavigatorOptions' spepcified, but UI 'arrowleft' not defined. Define 'arrowleft' to enable direct navigation, or remove option '$ArrowNavigatorOptions' to disable direct navigation.");

        if (!arrowRight)
            $JssorDebug$.$Fail("Option '$ArrowNavigatorOptions' spepcified, but UI 'arrowright' not defined. Define 'arrowright' to enable direct navigation, or remove option '$ArrowNavigatorOptions' to disable direct navigation.");

        if (isNaN($Jssor$.$CssWidth(arrowLeft))) {
            $JssorDebug$.$Fail("Width of 'arrow left' not specified.");
        }

        if (isNaN($Jssor$.$CssWidth(arrowRight))) {
            $JssorDebug$.$Fail("Width of 'arrow right' not specified.");
        }

        if (isNaN($Jssor$.$CssHeight(arrowLeft))) {
            $JssorDebug$.$Fail("Height of 'arrow left' not specified.");
        }

        if (isNaN($Jssor$.$CssHeight(arrowRight))) {
            $JssorDebug$.$Fail("Height of 'arrow right' not specified.");
        }
    });

    var _Hide;
    var _Length;
    var _CurrentIndex;
    var _Options;
    var _Steps;
    var _ArrowWidth = $Jssor$.$CssWidth(arrowLeft);
    var _ArrowHeight = $Jssor$.$CssHeight(arrowLeft);

    function OnNavigationRequest(steps) {
        self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, steps, true);
    }

    function ShowArrows(hide) {
        $Jssor$.$ShowElement(arrowLeft, hide || !options.$Loop && _CurrentIndex == 0);
        $Jssor$.$ShowElement(arrowRight, hide || !options.$Loop && _CurrentIndex >= _Length - options.$DisplayPieces);

        _Hide = hide;
    }

    self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    self.$SetCurrentIndex = function (index, virtualIndex, temp) {
        if (temp) {
            _CurrentIndex = virtualIndex;
        }
        else {
            _CurrentIndex = index;

            ShowArrows(_Hide);
        }
        //self.$TriggerEvent($JssorNavigatorEvents$.$INDEXCHANGE, index);
    };

    self.$Show = ShowArrows;

    var _Located;
    self.$Relocate = function (conainerWidth, containerHeight) {
        if (!_Located || _Options.$Scale == false) {

            var containerWidth = $Jssor$.$ParentNode(arrowLeft).clientWidth;
            var containerHeight = $Jssor$.$ParentNode(arrowLeft).clientHeight;

            if (_Options.$AutoCenter & 1) {
                $Jssor$.$CssLeft(arrowLeft, (containerWidth - _ArrowWidth) / 2);
                $Jssor$.$CssLeft(arrowRight, (containerWidth - _ArrowWidth) / 2);
            }

            if (_Options.$AutoCenter & 2) {
                $Jssor$.$CssTop(arrowLeft, (containerHeight - _ArrowHeight) / 2);
                $Jssor$.$CssTop(arrowRight, (containerHeight - _ArrowHeight) / 2);
            }

            _Located = true;
        }
    };

    var _Initialized;
    self.$Reset = function (length) {
        _Length = length;
        _CurrentIndex = 0;

        if (!_Initialized) {

            $Jssor$.$AddEvent(arrowLeft, "click", $Jssor$.$CreateCallback(null, OnNavigationRequest, -_Steps));
            $Jssor$.$AddEvent(arrowRight, "click", $Jssor$.$CreateCallback(null, OnNavigationRequest, _Steps));

            $Jssor$.$Buttonize(arrowLeft);
            $Jssor$.$Buttonize(arrowRight);

            _Initialized = true;
        }

        //self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
    };

    //JssorArrowNavigator Constructor
    {
        self.$Options = _Options = $Jssor$.$Extend({
            $Steps: 1
        }, options);

        _Steps = _Options.$Steps;

        if (_Options.$Scale == false) {
            $Jssor$.$Attribute(arrowLeft, "noscale", true);
            $Jssor$.$Attribute(arrowRight, "noscale", true);
        }
    }
};

//$JssorThumbnailNavigator$
var $JssorThumbnailNavigator$ = window.$JssorThumbnailNavigator$ = function (elmt, options) {
    var _Self = this;
    var _Length;
    var _Count;
    var _CurrentIndex;
    var _Options;
    var _NavigationItems = [];

    var _Width;
    var _Height;
    var _Lanes;
    var _SpacingX;
    var _SpacingY;
    var _PrototypeWidth;
    var _PrototypeHeight;
    var _DisplayPieces;

    var _Slider;
    var _CurrentMouseOverIndex = -1;

    var _SlidesContainer;
    var _ThumbnailPrototype;

    $JssorObject$.call(_Self);
    elmt = $Jssor$.$GetElement(elmt);

    function NavigationItem(item, index) {
        var self = this;
        var _Wrapper;
        var _Button;
        var _Thumbnail;

        function Highlight(mouseStatus) {
            _Button.$Selected(_CurrentIndex == index);
        }

        function OnNavigationRequest(event) {
            if (!_Slider.$LastDragSucceded()) {
                var tail = _Lanes - index % _Lanes;
                var slideVirtualIndex = _Slider.$GetVirtualIndex((index + tail) / _Lanes - 1);
                var itemVirtualIndex = slideVirtualIndex * _Lanes + _Lanes - tail;
                _Self.$TriggerEvent($JssorNavigatorEvents$.$NAVIGATIONREQUEST, itemVirtualIndex);
            }

            //$JssorDebug$.$Log("navigation request");
        }

        $JssorDebug$.$Execute(function () {
            self.$Wrapper = undefined;
        });

        self.$Index = index;

        self.$Highlight = Highlight;

        //NavigationItem Constructor
        {
            _Thumbnail = item.$Thumb || item.$Image || $Jssor$.$CreateDiv();
            self.$Wrapper = _Wrapper = $Jssor$.$BuildElement(_ThumbnailPrototype, "thumbnailtemplate", _Thumbnail, true);

            _Button = $Jssor$.$Buttonize(_Wrapper);
            if (_Options.$ActionMode & 1)
                $Jssor$.$AddEvent(_Wrapper, "click", OnNavigationRequest);
            if (_Options.$ActionMode & 2)
                $Jssor$.$AddEvent(_Wrapper, "mouseover", $Jssor$.$MouseOverOutFilter(OnNavigationRequest, _Wrapper));
        }
    }

    _Self.$GetCurrentIndex = function () {
        return _CurrentIndex;
    };

    _Self.$SetCurrentIndex = function (index, virtualIndex, temp) {
        var oldIndex = _CurrentIndex;
        _CurrentIndex = index;
        if (oldIndex != -1)
            _NavigationItems[oldIndex].$Highlight();
        _NavigationItems[index].$Highlight();

        if (!temp) {
            _Slider.$PlayTo(_Slider.$GetVirtualIndex(Math.floor(virtualIndex / _Lanes)));
        }
    };

    _Self.$Show = function (hide) {
        $Jssor$.$ShowElement(elmt, hide);
    };

    _Self.$Relocate = $Jssor$.$EmptyFunction;

    var _Initialized;
    _Self.$Reset = function (length, items, loadingContainer) {
        if (!_Initialized) {
            _Length = length;
            _Count = Math.ceil(_Length / _Lanes);
            _CurrentIndex = -1;
            _DisplayPieces = Math.min(_DisplayPieces, items.length);

            var horizontal = _Options.$Orientation & 1;

            var slideWidth = _PrototypeWidth + (_PrototypeWidth + _SpacingX) * (_Lanes - 1) * (1 - horizontal);
            var slideHeight = _PrototypeHeight + (_PrototypeHeight + _SpacingY) * (_Lanes - 1) * horizontal;

            var slidesContainerWidth = slideWidth + (slideWidth + _SpacingX) * (_DisplayPieces - 1) * horizontal;
            var slidesContainerHeight = slideHeight + (slideHeight + _SpacingY) * (_DisplayPieces - 1) * (1 - horizontal);

            $Jssor$.$CssPosition(_SlidesContainer, "absolute");
            $Jssor$.$CssOverflow(_SlidesContainer, "hidden");
            if (_Options.$AutoCenter & 1) {
                $Jssor$.$CssLeft(_SlidesContainer, (_Width - slidesContainerWidth) / 2);
            }
            if (_Options.$AutoCenter & 2) {
                $Jssor$.$CssTop(_SlidesContainer, (_Height - slidesContainerHeight) / 2);
            }
            //$JssorDebug$.$Execute(function () {
            //    if (!_Options.$AutoCenter) {
            //        var slidesContainerTop = $Jssor$.$CssTop(_SlidesContainer);
            //        var slidesContainerLeft = $Jssor$.$CssLeft(_SlidesContainer);

            //        if (isNaN(slidesContainerTop)) {
            //            $JssorDebug$.$Fail("Position 'top' wrong specification of thumbnail navigator slides container (<div u=\"thumbnavigator\">...<div u=\"slides\">), \r\nwhen option $ThumbnailNavigatorOptions.$AutoCenter set to 0, it should be specified in pixel (like <div u=\"slides\" style=\"top: 0px;\">)");
            //        }

            //        if (isNaN(slidesContainerLeft)) {
            //            $JssorDebug$.$Fail("Position 'left' wrong specification of thumbnail navigator slides container (<div u=\"thumbnavigator\">...<div u=\"slides\">), \r\nwhen option $ThumbnailNavigatorOptions.$AutoCenter set to 0, it should be specified in pixel (like <div u=\"slides\" style=\"left: 0px;\">)");
            //        }
            //    }
            //});
            $Jssor$.$CssWidth(_SlidesContainer, slidesContainerWidth);
            $Jssor$.$CssHeight(_SlidesContainer, slidesContainerHeight);

            var slideItemElmts = [];
            $Jssor$.$Each(items, function (item, index) {
                var navigationItem = new NavigationItem(item, index);
                var navigationItemWrapper = navigationItem.$Wrapper;

                var columnIndex = Math.floor(index / _Lanes);
                var laneIndex = index % _Lanes;

                $Jssor$.$CssLeft(navigationItemWrapper, (_PrototypeWidth + _SpacingX) * laneIndex * (1 - horizontal));
                $Jssor$.$CssTop(navigationItemWrapper, (_PrototypeHeight + _SpacingY) * laneIndex * horizontal);

                if (!slideItemElmts[columnIndex]) {
                    slideItemElmts[columnIndex] = $Jssor$.$CreateDiv();
                    $Jssor$.$AppendChild(_SlidesContainer, slideItemElmts[columnIndex]);
                }

                $Jssor$.$AppendChild(slideItemElmts[columnIndex], navigationItemWrapper);

                _NavigationItems.push(navigationItem);
            });

            var thumbnailSliderOptions = $Jssor$.$Extend({
                $HWA: false,
                $AutoPlay: false,
                $NaviQuitDrag: false,
                $SlideWidth: slideWidth,
                $SlideHeight: slideHeight,
                $SlideSpacing: _SpacingX * horizontal + _SpacingY * (1 - horizontal),
                $MinDragOffsetToSlide: 12,
                $SlideDuration: 200,
                $PauseOnHover: 1,
                $PlayOrientation: _Options.$Orientation,
                $DragOrientation: _Options.$DisableDrag ? 0 : _Options.$Orientation
            }, _Options);

            _Slider = new $JssorSlider$(elmt, thumbnailSliderOptions);

            _Initialized = true;
        }

        //_Self.$TriggerEvent($JssorNavigatorEvents$.$RESET);
    };

    //JssorThumbnailNavigator Constructor
    {
        _Self.$Options = _Options = $Jssor$.$Extend({
            $SpacingX: 3,
            $SpacingY: 3,
            $DisplayPieces: 1,
            $Orientation: 1,
            $AutoCenter: 3,
            $ActionMode: 1
        }, options);

        //going to use $Rows instead of $Lanes
        if (_Options.$Rows != undefined)
            _Options.$Lanes = _Options.$Rows;

        //Sodo statement for development time intellisence only
        $JssorDebug$.$Execute(function () {
            _Options = $Jssor$.$Extend({
                $Lanes: undefined,
                $Width: undefined,
                $Height: undefined
            }, _Options);
        });

        _Width = $Jssor$.$CssWidth(elmt);
        _Height = $Jssor$.$CssHeight(elmt);

        $JssorDebug$.$Execute(function () {
            if (!_Width)
                $JssorDebug$.$Fail("width of 'thumbnavigator' container not specified.");
            if (!_Height)
                $JssorDebug$.$Fail("height of 'thumbnavigator' container not specified.");
        });

        _SlidesContainer = $Jssor$.$FindChild(elmt, "slides", true);
        _ThumbnailPrototype = $Jssor$.$FindChild(_SlidesContainer, "prototype");

        $JssorDebug$.$Execute(function () {
            if (!_ThumbnailPrototype)
                $JssorDebug$.$Fail("prototype of 'thumbnavigator' not defined.");
        });

        _PrototypeWidth = $Jssor$.$CssWidth(_ThumbnailPrototype);
        _PrototypeHeight = $Jssor$.$CssHeight(_ThumbnailPrototype);

        $Jssor$.$RemoveElement(_ThumbnailPrototype, _SlidesContainer);

        _Lanes = _Options.$Lanes || 1;
        _SpacingX = _Options.$SpacingX;
        _SpacingY = _Options.$SpacingY;
        _DisplayPieces = _Options.$DisplayPieces;

        if (_Options.$Scale == false) {
            $Jssor$.$Attribute(elmt, "noscale", true);
        }
    }
};

//$JssorCaptionSliderBase$
function $JssorCaptionSliderBase$() {
    $JssorAnimator$.call(this, 0, 0);
    this.$Revert = $Jssor$.$EmptyFunction;
}

var $JssorCaptionSlider$ = window.$JssorCaptionSlider$ = function (container, captionSlideOptions, playIn) {
    $JssorDebug$.$Execute(function () {
        if (!captionSlideOptions.$CaptionTransitions) {
            $JssorDebug$.$Error("'$CaptionSliderOptions' option error, '$CaptionSliderOptions.$CaptionTransitions' not specified.");
        }
    });

    var _Self = this;
    var _ImmediateOutCaptionHanger;
    var _PlayMode = playIn ? captionSlideOptions.$PlayInMode : captionSlideOptions.$PlayOutMode;

    var _CaptionTransitions = captionSlideOptions.$CaptionTransitions;
    var _CaptionTuningFetcher = { $Transition: "t", $Delay: "d", $Duration: "du", x: "x", y: "y", $Rotate: "r", $Zoom: "z", $Opacity: "f", $BeginTime: "b" };
    var _CaptionTuningTransfer = {
        $Default: function (value, tuningValue) {
            if (!isNaN(tuningValue.$Value))
                value = tuningValue.$Value;
            else
                value *= tuningValue.$Percent;

            return value;
        },
        $Opacity: function (value, tuningValue) {
            return this.$Default(value - 1, tuningValue);
        }
    };
    _CaptionTuningTransfer.$Zoom = _CaptionTuningTransfer.$Opacity;

    $JssorAnimator$.call(_Self, 0, 0);

    function GetCaptionItems(element, level) {

        var itemsToPlay = [];
        var lastTransitionName;
        var namedTransitions = [];
        var namedTransitionOrders = [];

        function FetchRawTransition(captionElmt, index) {
            var rawTransition = {};

            $Jssor$.$Each(_CaptionTuningFetcher, function (fetchAttribute, fetchProperty) {
                var attributeValue = $Jssor$.$AttributeEx(captionElmt, fetchAttribute + (index || ""));
                if (attributeValue) {
                    var propertyValue = {};

                    if (fetchAttribute == "t") {
                        propertyValue.$Value = attributeValue;
                    }
                    else if (attributeValue.indexOf("%") + 1)
                        propertyValue.$Percent = $Jssor$.$ParseFloat(attributeValue) / 100;
                    else
                        propertyValue.$Value = $Jssor$.$ParseFloat(attributeValue);

                    rawTransition[fetchProperty] = propertyValue;
                }
            });

            return rawTransition;
        }

        function GetRandomTransition() {
            return _CaptionTransitions[Math.floor(Math.random() * _CaptionTransitions.length)];
        }

        function EvaluateCaptionTransition(transitionName) {

            var transition;

            if (transitionName == "*") {
                transition = GetRandomTransition();
            }
            else if (transitionName) {

                //indexed transition allowed, just the same as named transition
                var tempTransition = _CaptionTransitions[$Jssor$.$ParseInt(transitionName)] || _CaptionTransitions[transitionName];

                if ($Jssor$.$IsArray(tempTransition)) {
                    if (transitionName != lastTransitionName) {
                        lastTransitionName = transitionName;
                        namedTransitionOrders[transitionName] = 0;

                        namedTransitions[transitionName] = tempTransition[Math.floor(Math.random() * tempTransition.length)];
                    }
                    else {
                        namedTransitionOrders[transitionName]++;
                    }

                    tempTransition = namedTransitions[transitionName];

                    if ($Jssor$.$IsArray(tempTransition)) {
                        tempTransition = tempTransition.length && tempTransition[namedTransitionOrders[transitionName] % tempTransition.length];

                        if ($Jssor$.$IsArray(tempTransition)) {
                            //got transition from array level 3, random for all captions
                            tempTransition = tempTransition[Math.floor(Math.random() * tempTransition.length)];
                        }
                        //else {
                        //    //got transition from array level 2, in sequence for all adjacent captions with same name specified
                        //    transition = tempTransition;
                        //}
                    }
                    //else {
                    //    //got transition from array level 1, random but same for all adjacent captions with same name specified
                    //    transition = tempTransition;
                    //}
                }
                //else {
                //    //got transition directly from a simple transition object
                //    transition = tempTransition;
                //}

                transition = tempTransition;

                if ($Jssor$.$IsString(transition))
                    transition = EvaluateCaptionTransition(transition);
            }

            return transition;
        }

        var captionElmts = $Jssor$.$Children(element);
        $Jssor$.$Each(captionElmts, function (captionElmt, i) {

            var transitionsWithTuning = [];
            transitionsWithTuning.$Elmt = captionElmt;
            var isCaption = $Jssor$.$AttributeEx(captionElmt, "u") == "caption";

            $Jssor$.$Each(playIn ? [0, 3] : [2], function (j, k) {

                if (isCaption) {
                    var transition;
                    var rawTransition;

                    if (j != 2 || !$Jssor$.$AttributeEx(captionElmt, "t3")) {
                        rawTransition = FetchRawTransition(captionElmt, j);

                        if (j == 2 && !rawTransition.$Transition) {
                            rawTransition.$Delay = rawTransition.$Delay || { $Value: 0 };
                            rawTransition = $Jssor$.$Extend(FetchRawTransition(captionElmt, 0), rawTransition);
                        }
                    }

                    if (rawTransition && rawTransition.$Transition) {

                        transition = EvaluateCaptionTransition(rawTransition.$Transition.$Value);

                        if (transition) {

                            //var transitionWithTuning = $Jssor$.$Extend({ $Delay: 0, $ScaleHorizontal: 1, $ScaleVertical: 1 }, transition);
                            var transitionWithTuning = $Jssor$.$Extend({ $Delay: 0 }, transition);

                            $Jssor$.$Each(rawTransition, function (rawPropertyValue, propertyName) {
                                var tuningPropertyValue = (_CaptionTuningTransfer[propertyName] || _CaptionTuningTransfer.$Default).apply(_CaptionTuningTransfer, [transitionWithTuning[propertyName], rawTransition[propertyName]]);
                                if (!isNaN(tuningPropertyValue))
                                    transitionWithTuning[propertyName] = tuningPropertyValue;
                            });

                            if (!k) {
                                if (rawTransition.$BeginTime)
                                    transitionWithTuning.$BeginTime = rawTransition.$BeginTime.$Value || 0;
                                else if ((_PlayMode) & 2)
                                    transitionWithTuning.$BeginTime = 0;
                            }
                        }
                    }

                    transitionsWithTuning.push(transitionWithTuning);
                }

                if ((level % 2) && !k) {
                    transitionsWithTuning.$Children = GetCaptionItems(captionElmt, level + 1);
                }
            });

            itemsToPlay.push(transitionsWithTuning);
        });

        return itemsToPlay;
    }

    function CreateAnimator(item, transition, immediateOut) {

        var animatorOptions = {
            $Easing: transition.$Easing,
            $Round: transition.$Round,
            $During: transition.$During,
            $Reverse: playIn && !immediateOut
        };

        $JssorDebug$.$Execute(function () {
            animatorOptions.$CaptionAnimator = true;
        });

        var captionItem = item;
        var captionParent = $Jssor$.$ParentNode(item);

        var captionItemWidth = $Jssor$.$CssWidth(captionItem);
        var captionItemHeight = $Jssor$.$CssHeight(captionItem);
        var captionParentWidth = $Jssor$.$CssWidth(captionParent);
        var captionParentHeight = $Jssor$.$CssHeight(captionParent);

        var fromStyles = {};
        var difStyles = {};
        var scaleClip = transition.$ScaleClip || 1;

        //Opacity
        if (transition.$Opacity) {
            difStyles.$Opacity = 1 - transition.$Opacity;
        }

        animatorOptions.$OriginalWidth = captionItemWidth;
        animatorOptions.$OriginalHeight = captionItemHeight;

        //Transform
        if (transition.$Zoom || transition.$Rotate) {
            difStyles.$Zoom = (transition.$Zoom || 2) - 2;

            if ($Jssor$.$IsBrowserIe9Earlier() || $Jssor$.$IsBrowserOpera()) {
                difStyles.$Zoom = Math.min(difStyles.$Zoom, 1);
            }

            fromStyles.$Zoom = 1;

            var rotate = transition.$Rotate || 0;

            difStyles.$Rotate = rotate * 360;
            fromStyles.$Rotate = 0;
        }
            //Clip
        else if (transition.$Clip) {
            var fromStyleClip = { $Top: 0, $Right: captionItemWidth, $Bottom: captionItemHeight, $Left: 0 };
            var toStyleClip = $Jssor$.$Extend({}, fromStyleClip);

            var blockOffset = toStyleClip.$Offset = {};

            var topBenchmark = transition.$Clip & 4;
            var bottomBenchmark = transition.$Clip & 8;
            var leftBenchmark = transition.$Clip & 1;
            var rightBenchmark = transition.$Clip & 2;

            if (topBenchmark && bottomBenchmark) {
                blockOffset.$Top = captionItemHeight / 2 * scaleClip;
                blockOffset.$Bottom = -blockOffset.$Top;
            }
            else if (topBenchmark)
                blockOffset.$Bottom = -captionItemHeight * scaleClip;
            else if (bottomBenchmark)
                blockOffset.$Top = captionItemHeight * scaleClip;

            if (leftBenchmark && rightBenchmark) {
                blockOffset.$Left = captionItemWidth / 2 * scaleClip;
                blockOffset.$Right = -blockOffset.$Left;
            }
            else if (leftBenchmark)
                blockOffset.$Right = -captionItemWidth * scaleClip;
            else if (rightBenchmark)
                blockOffset.$Left = captionItemWidth * scaleClip;

            animatorOptions.$Move = transition.$Move;
            difStyles.$Clip = toStyleClip;
            fromStyles.$Clip = fromStyleClip;
        }

        //Fly
        {
            var toLeft = 0;
            var toTop = 0;

            if (transition.x)
                toLeft -= captionParentWidth * transition.x;

            if (transition.y)
                toTop -= captionParentHeight * transition.y;

            if (toLeft || toTop || animatorOptions.$Move) {
                difStyles.$Left = toLeft;
                difStyles.$Top = toTop;
            }
        }

        //duration
        var duration = transition.$Duration;

        fromStyles = $Jssor$.$Extend(fromStyles, $Jssor$.$GetStyles(captionItem, difStyles));

        animatorOptions.$Setter = $Jssor$.$StyleSetterEx();

        return new $JssorAnimator$(transition.$Delay, duration, animatorOptions, captionItem, fromStyles, difStyles);
    }

    function CreateAnimators(streamLineLength, captionItems) {

        $Jssor$.$Each(captionItems, function (captionItem, i) {

            $JssorDebug$.$Execute(function () {
                if (captionItem.length) {
                    var top = $Jssor$.$CssTop(captionItem.$Elmt);
                    var left = $Jssor$.$CssLeft(captionItem.$Elmt);
                    var width = $Jssor$.$CssWidth(captionItem.$Elmt);
                    var height = $Jssor$.$CssHeight(captionItem.$Elmt);

                    var error = null;

                    if (isNaN(top))
                        error = "Style 'top' for caption not specified. Please always specify caption like 'position: absolute; top: ...px; left: ...px; width: ...px; height: ...px;'.";
                    else if (isNaN(left))
                        error = "Style 'left' not specified. Please always specify caption like 'position: absolute; top: ...px; left: ...px; width: ...px; height: ...px;'.";
                    else if (isNaN(width))
                        error = "Style 'width' not specified. Please always specify caption like 'position: absolute; top: ...px; left: ...px; width: ...px; height: ...px;'.";
                    else if (isNaN(height))
                        error = "Style 'height' not specified. Please always specify caption like 'position: absolute; top: ...px; left: ...px; width: ...px; height: ...px;'.";

                    if (error)
                        $JssorDebug$.$Error("Caption " + (i + 1) + " definition error, \r\n" + error + "\r\n" + captionItem.$Elmt.outerHTML);
                }
            });

            var animator;
            var captionElmt = captionItem.$Elmt;
            var transition = captionItem[0];
            var transition3 = captionItem[1];

            if (transition) {

                animator = CreateAnimator(captionElmt, transition);
                streamLineLength = animator.$Locate(transition.$BeginTime == undefined ? streamLineLength : transition.$BeginTime, 1);
            }

            streamLineLength = CreateAnimators(streamLineLength, captionItem.$Children);

            if (transition3) {
                var animator3 = CreateAnimator(captionElmt, transition3, 1);
                animator3.$Locate(streamLineLength, 1);
                _Self.$Combine(animator3);
                _ImmediateOutCaptionHanger.$Combine(animator3);
            }

            if (animator)
                _Self.$Combine(animator);
        });

        return streamLineLength;
    }

    _Self.$Revert = function () {
        _Self.$GoToPosition(_Self.$GetPosition_OuterEnd() * (playIn || 0));
        _ImmediateOutCaptionHanger.$GoToPosition(0);
    };

    //Constructor
    {
        _ImmediateOutCaptionHanger = new $JssorAnimator$(0, 0);

        CreateAnimators(0, _PlayMode ? GetCaptionItems(container, 1) : []);
    }
};

var $JssorCaptionSlideo$ = function (container, captionSlideoOptions, playIn) {
    $JssorDebug$.$Execute(function () {
        if (!captionSlideoOptions.$CaptionTransitions) {
            $JssorDebug$.$Error("'$CaptionSlideoOptions' option error, '$CaptionSlideoOptions.$CaptionTransitions' not specified.");
        }
        else if (!$Jssor$.$IsArray(captionSlideoOptions.$CaptionTransitions)) {
            $JssorDebug$.$Error("'$CaptionSlideoOptions' option error, '$CaptionSlideoOptions.$CaptionTransitions' is not an array.");
        }
    });

    var _This = this;

    var _Easings;
    var _TransitionConverter = {};
    var _CaptionTransitions = captionSlideoOptions.$CaptionTransitions;

    $JssorAnimator$.call(_This, 0, 0);

    function ConvertTransition(transition, isEasing) {
        $Jssor$.$Each(transition, function (property, name) {
            var performName = _TransitionConverter[name];
            if (performName) {
                if (isEasing || name == "e") {
                    if ($Jssor$.$IsNumeric(property)) {
                        property = _Easings[property];
                    }
                    else if ($Jssor$.$IsPlainObject(property)) {
                        ConvertTransition(property, true);
                    }
                }

                transition[performName] = property;
                delete transition[name];
            }
        });
    }

    function GetCaptionItems(element, level) {

        var itemsToPlay = [];

        var captionElmts = $Jssor$.$Children(element);
        $Jssor$.$Each(captionElmts, function (captionElmt, i) {
            var isCaption = $Jssor$.$AttributeEx(captionElmt, "u") == "caption";
            if (isCaption) {
                var transitionName = $Jssor$.$AttributeEx(captionElmt, "t");
                var transition = _CaptionTransitions[$Jssor$.$ParseInt(transitionName)] || _CaptionTransitions[transitionName];

                var transitionName2 = $Jssor$.$AttributeEx(captionElmt, "t2");
                var transition2 = _CaptionTransitions[$Jssor$.$ParseInt(transitionName2)] || _CaptionTransitions[transitionName2];

                var itemToPlay = { $Elmt: captionElmt, $Transition: transition, $Transition2: transition2 };
                if (level < 3) {
                    itemsToPlay.concat(GetCaptionItems(captionElmt, level + 1));
                }
                itemsToPlay.push(itemToPlay);
            }
        });

        return itemsToPlay;
    }

    function CreateAnimator(captionElmt, transitions, lastStyles, forIn) {

        $Jssor$.$Each(transitions, function (transition) {
            ConvertTransition(transition);

            var animatorOptions = {
                $Easing: transition.$Easing,
                $Round: transition.$Round,
                $During: transition.$During,
                $Setter: $Jssor$.$StyleSetterEx()
            };

            var fromStyles = $Jssor$.$Extend($Jssor$.$GetStyles(captionItem, transition), lastStyles);

            var animator = new $JssorAnimator$(transition.b || 0, transition.d, animatorOptions, captionElmt, fromStyles, transition);

            !forIn == !playIn && _This.$Combine(animator);

            var castOptions;
            lastStyles = $Jssor$.$Extend(lastStyles, $Jssor$.$Cast(fromStyles, transition, 1, animatorOptions.$Easing, animatorOptions.$During, animatorOptions.$Round, animatorOptions, castOptions));
        });

        return lastStyles;
    }

    function CreateAnimators(captionItems) {

        $Jssor$.$Each(captionItems, function (captionItem, i) {

            $JssorDebug$.$Execute(function () {
                if (captionItem.length) {
                    var top = $Jssor$.$CssTop(captionItem.$Elmt);
                    var left = $Jssor$.$CssLeft(captionItem.$Elmt);
                    var width = $Jssor$.$CssWidth(captionItem.$Elmt);
                    var height = $Jssor$.$CssHeight(captionItem.$Elmt);

                    var error = null;

                    if (isNaN(top))
                        error = "style 'top' not specified";
                    else if (isNaN(left))
                        error = "style 'left' not specified";
                    else if (isNaN(width))
                        error = "style 'width' not specified";
                    else if (isNaN(height))
                        error = "style 'height' not specified";

                    if (error)
                        throw new Error("Caption " + (i + 1) + " definition error, " + error + ".\r\n" + captionItem.$Elmt.outerHTML);
                }
            });

            var captionElmt = captionItem.$Elmt;

            var captionItemWidth = $Jssor$.$CssWidth(captionItem);
            var captionItemHeight = $Jssor$.$CssHeight(captionItem);
            var captionParentWidth = $Jssor$.$CssWidth(captionParent);
            var captionParentHeight = $Jssor$.$CssHeight(captionParent);

            var lastStyles = { $Zoom: 1, $Rotate: 0, $Clip: { $Top: 0, $Right: captionItemWidth, $Bottom: captionItemHeight, $Left: 0 } };

            lastStyles = CreateAnimator(captionElmt, captionItem.$Transition, lastStyles, true);
            CreateAnimator(captionElmt, captionItem.$Transition2, lastStyles, false);
        });
    }

    _This.$Revert = function () {
        _This.$GoToPosition(-1, true);
    }

    //Constructor
    {
        _Easings = [
            $JssorEasing$.$EaseSwing,
            $JssorEasing$.$EaseLinear,
            $JssorEasing$.$EaseInQuad,
            $JssorEasing$.$EaseOutQuad,
            $JssorEasing$.$EaseInOutQuad,
            $JssorEasing$.$EaseInCubic,
            $JssorEasing$.$EaseOutCubic,
            $JssorEasing$.$EaseInOutCubic,
            $JssorEasing$.$EaseInQuart,
            $JssorEasing$.$EaseOutQuart,
            $JssorEasing$.$EaseInOutQuart,
            $JssorEasing$.$EaseInQuint,
            $JssorEasing$.$EaseOutQuint,
            $JssorEasing$.$EaseInOutQuint,
            $JssorEasing$.$EaseInSine,
            $JssorEasing$.$EaseOutSine,
            $JssorEasing$.$EaseInOutSine,
            $JssorEasing$.$EaseInExpo,
            $JssorEasing$.$EaseOutExpo,
            $JssorEasing$.$EaseInOutExpo,
            $JssorEasing$.$EaseInCirc,
            $JssorEasing$.$EaseOutCirc,
            $JssorEasing$.$EaseInOutCirc,
            $JssorEasing$.$EaseInElastic,
            $JssorEasing$.$EaseOutElastic,
            $JssorEasing$.$EaseInOutElastic,
            $JssorEasing$.$EaseInBack,
            $JssorEasing$.$EaseOutBack,
            $JssorEasing$.$EaseInOutBack,
            $JssorEasing$.$EaseInBounce,
            $JssorEasing$.$EaseOutBounce,
            $JssorEasing$.$EaseInOutBounce//,
            //$JssorEasing$.$EaseGoBack,
            //$JssorEasing$.$EaseInWave,
            //$JssorEasing$.$EaseOutWave,
            //$JssorEasing$.$EaseOutJump,
            //$JssorEasing$.$EaseInJump
        ];

        var translater = {
            $Top: "y",          //top
            $Left: "x",         //left
            $Bottom: "m",       //bottom
            $Right: "t",        //right
            $Zoom: "s",         //zoom/scale
            $Rotate: "r",       //rotate
            $Opacity: "o",      //opacity
            $Easing: "e",       //easing
            $ZIndex: "i",       //zindex
            $Round: "rd",       //round
            $During: "du",      //during
            $Duration: "d"//,   //duration
            //$Begin: "b"
        };

        $Jssor$.$Each(translater, function (prop, newProp) {
            _TransitionConverter[prop] = newProp;
        });

        CreateAnimators(GetCaptionItems(container, 1));
    }
};

//Event Table

//$EVT_CLICK = 21;			    function(slideIndex[, event])
//$EVT_DRAG_START = 22;		    function(position[, virtualPosition, event])
//$EVT_DRAG_END = 23;		    function(position, startPosition[, virtualPosition, virtualStartPosition, event])
//$EVT_SWIPE_START = 24;		function(position[, virtualPosition])
//$EVT_SWIPE_END = 25;		    function(position[, virtualPosition])

//$EVT_LOAD_START = 26;			function(slideIndex)
//$EVT_LOAD_END = 27;			function(slideIndex)

//$EVT_POSITION_CHANGE = 202;	function(position, fromPosition[, virtualPosition, virtualFromPosition])
//$EVT_PARK = 203;			    function(slideIndex, fromIndex)

//$EVT_PROGRESS_CHANGE = 208;	function(slideIndex, progress[, progressBegin, idleBegin, idleEnd, progressEnd])
//$EVT_STATE_CHANGE = 209;	    function(slideIndex, progress[, progressBegin, idleBegin, idleEnd, progressEnd])

//$EVT_ROLLBACK_START = 210;	function(slideIndex, progress[, progressBegin, idleBegin, idleEnd, progressEnd])
//$EVT_ROLLBACK_END = 211;	    function(slideIndex, progress[, progressBegin, idleBegin, idleEnd, progressEnd])

//$EVT_SLIDESHOW_START = 206;   function(slideIndex[, progressBegin, slideshowBegin, slideshowEnd, progressEnd])
//$EVT_SLIDESHOW_END = 207;     function(slideIndex[, progressBegin, slideshowBegin, slideshowEnd, progressEnd])

//http://www.jssor.com/development/reference-api.html
;window.baidu = window.baidu || {};
baidu.template = baidu.template || {};

//HTML转义
baidu.template._encodeHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
};

//转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
baidu.template._encodeEventHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\\\\/g,'\\')
        .replace(/\\\//g,'\/')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r');
};

;define('bigba:widget/common/ui/cartAlert/cartAlert.js', function(require, exports, module){ /**
 * @file Address.
 * @author boye.liu
 * @date 2014.07.23
 * @评论：
 * 耦合性太高，卡片与编辑应该分开;
 * 事件绑定写的太固化
 * 无数据监控
 */
var Dialog = require("jsmod/ui/dialog");
var alertDialog;
var timerDialog;
var alertTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<p class="mc-desc">',typeof(error_msg) === 'undefined'?'':baidu.template._encodeHTML(error_msg),'</p><div class="submitBtns"><a class="mc-btn" href="http://waimai.baidu.com">看看其它餐厅</a><a class="mc-btn-dis closeBtn" href="javascript:;">取消</a></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
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
//弹出错误提示 
function dialogAlert(data){
    var tmpData = {};
    tmpData.error_msg = "非常抱歉，"+data.error_msg;
    var html = alertTpl(tmpData);
    if(!alertDialog){
        alertDialog = new Dialog({
            html:html,
            width:250
        });
        var $dialogEl = alertDialog.getElement();
        $dialogEl.addClass("alertDialog");
    }else{
        var $dialogEl = alertDialog.getElement();
        $dialogEl.html(html);
    }
    clearTimeout(timerDialog);
    timerDialog = setTimeout(
        function(){
            alertDialog.show({
                fade: true
            });
        },
    500);
}
module.exports = {
    alert:dialogAlert
}; 
});
;define('bigba:widget/common/ui/citybar/citybar.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
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
;define('bigba:widget/common/ui/search/search.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
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
;define('bigba:widget/common/nav/nav.js', function(require, exports, module){ /**
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
;define('bigba:widget/common/ui/address/address.js', function(require, exports, module){ /**
 * @file Address.
 * @author boye.liu
 * @date 2014.07.23
 * @评论：
 * 耦合性太高，卡片与编辑应该分开;
 * 事件绑定写的太固化
 * 无数据监控
 */
var Dialog = require("jsmod/ui/dialog");
var listTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('<li class="addr-item" data-id="',typeof(item.id) === 'undefined'?'':baidu.template._encodeHTML(item.id),'" data-msg = "',typeof(item.user_name) === 'undefined'?'':baidu.template._encodeHTML(item.user_name),'$',typeof(item.gender) === 'undefined'?'':baidu.template._encodeHTML(item.gender),'$',typeof(item.user_phone) === 'undefined'?'':baidu.template._encodeHTML(item.user_phone),'$',typeof(item.sug_address) === 'undefined'?'':baidu.template._encodeHTML(item.sug_address),'$',typeof(item.detail_address) === 'undefined'?'':baidu.template._encodeHTML(item.detail_address),'$',typeof(item.location) === 'undefined'?'':baidu.template._encodeHTML(item.location),'">    <div class="addr-title">        <div class="addr-user">            <span class="name">',typeof(item.user_name) === 'undefined'?'':baidu.template._encodeHTML(item.user_name),'</span>            <span class="sex">',typeof((item.gender == 2 ? "女士" : "先生")) === 'undefined'?'':baidu.template._encodeHTML((item.gender == 2 ? "女士" : "先生")),'</span>        </div>        <div class="addr-action">            <a class="addr-edit">编辑</a>            <a class="addr-remove">删除</a>        </div>    </div>    <div class="addr-con">        <p class="phone">',typeof(item.user_phone) === 'undefined'?'':baidu.template._encodeHTML(item.user_phone),'</p>        <p class="addr-desc">',typeof(item.address) === 'undefined'?'':baidu.template._encodeHTML(item.address),'</p>    </div>    <span class="select-ico"></span></li>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var detailTeml = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="addr-detail" id="new-address-section">    <form>        <table class="addr-table" border="0">            <tr>                <td valign="top"><span class="l-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span></td>                <td>                    <input type="hidden" value="',typeof(data.id) === 'undefined'?'':baidu.template._encodeHTML(data.id),'" name="adrr_id">                    <div class="form-group">                        <div class="input-control">                            <input type="text" name="user_name" placeholder="您的姓名" value="',typeof(data.user_name) === 'undefined'?'':baidu.template._encodeHTML(data.user_name),'" class="placeholder-con">                            <span class="star">*</span>                        </div>                        <div class="error-msg v-hide">请填写您的姓名，不能超过8个字符</div>                    </div>                    <div class="form-group">                        <div class="input-control">                                                        <input type="hidden" name="gender" value="',typeof((data.gender?data.gender:1)) === 'undefined'?'':baidu.template._encodeHTML((data.gender?data.gender:1)),'">                            <div class="s-gender ');if(parseInt(data.gender,10) === 1 || isNaN(parseInt(data.gender,10))){_template_fun_array.push(' selected ');}_template_fun_array.push('" data-gender="1"  >                                <i></i><span>先生</span>                            </div>                            <div class="s-gender ');if(data.gender == 2){_template_fun_array.push(' selected ');}_template_fun_array.push('" data-gender="2">                                <i></i><span>女士</span>                            </div>                        </div>                        <div class="error-msg v-hide">请选择您的性别</div>                    </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</span></td>                <td>                    <div class="form-group">                        <div class="input-control">                            <input type="text" name="user_phone" placeholder="11位手机号" value="',typeof(data.user_phone) === 'undefined'?'':baidu.template._encodeHTML(data.user_phone),'" class="placeholder-con">                            <span class="star">*</span>                        </div>                        <div class="error-msg v-hide">请填写正确的手机号</div>                    </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置</span></td>                <td>                    <div class="form-group">                        <div class="input-control poi_address">                            <i class="addr-icon-input"></i>                            <input type="text" name="sug_address" id="poi_address" placeholder="请输入小区、大厦或学校" value="',typeof(data.sug_address) === 'undefined'?'':baidu.template._encodeHTML(data.sug_address),'" class="placeholder-con">                            <span class="star">*</span>                                                        <input type="hidden" name="hide_sug_address" value="',typeof(data.lat) === 'undefined'?'':baidu.template._encodeHTML(data.lat),'-',typeof(data.lng) === 'undefined'?'':baidu.template._encodeHTML(data.lng),'" id="hide_poi_address">                        </div>                        <div class="error-msg v-hide">请输入地址并在下拉框中进行选择</div>                        <div class="s-search-container2"></div>                                            </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">详细地址</span></td>                <td>                    <div class="form-group">                        <div class="input-control">                                                        <input type="text" name="detail_address" placeholder="请输入门牌号等详细信息" value="',typeof(data.detail_address) === 'undefined'?'':baidu.template._encodeHTML(data.detail_address),'" class="placeholder-con">                        </div>                        <div class="error-msg v-hide">请输入门牌号等详细信息</div>                    </div>                </td>            </tr>        </table>        <div class="form-group form-submit">            <input type="button" class="saveBtn" data-node="saveBtn" value="');if(!!confirmTxt){_template_fun_array.push('',typeof(confirmTxt) === 'undefined'?'':baidu.template._encodeHTML(confirmTxt),'');}else{_template_fun_array.push('保存');}_template_fun_array.push('">            ');if(!noCancel){_template_fun_array.push('                <input type="button" class="escBtn versa" value="取消">            ');}_template_fun_array.push('        </div>    </form></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var GlobalTips = require('bigba:static/utils/GlobalTips.js');
var cacheDialog;
window.NOBLUR = "NOPE";

var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
var Search = require("bigba:widget/common/ui/search/search.js");
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
    data: [],
    $listEl: null,
    $addBtn: null,
    $detailEl: null,
    listComplete: null,
    itemRemove: null,
    dialogShow: null,
    saveSuccess: null,
    reForm: true
}

function Address(opt) {
    this.opt = $.extend({}, _opt, opt);
    this.bindEvent();
    this.initList();
}
$.extend(Address.prototype, {
    /*暂时未用到*/
    checkTotal: function() {
        var len = this.opt.$listEl.find("li.addr-item:not('.addr-add')").length;
        if (len >= 10) {
            this.opt.$addBtn.addClass('hide');
        } else {
            this.opt.$addBtn.removeClass('hide');
        }
    },
    bindEvent: function() {
        var $me = this.opt.$listEl;
        var self = this;
        $me.on("click", ".addr-edit", function(event) {
            var _data = {};
            var _msg = $(this).closest('li').attr("data-msg");
            var _arr = _msg.split("$");
            _data.id = $(this).closest('li').attr("data-id");
            _data.user_name = _arr[0];
            _data.gender = _arr[1];
            _data.user_phone = _arr[2];
            _data.sug_address = _arr[3];
            _data.detail_address = _arr[4];
            _data.lng = _arr[5].split(",")[0];
            _data.lat = _arr[5].split(",")[1];

            self.showDetailDialog(_data);
            event.preventDefault();
            event.stopPropagation();
        });
        $me.on("click", ".addr-remove", function(event) {
            self.removeAddress($(this).closest('li'));
            event.preventDefault();
            event.stopPropagation();
        });
        this.opt.$addBtn && this.opt.$addBtn.on("click", function() {
            var len = self.opt.$listEl.find("li.addr-item:not('.addr-add')").length;
            if (len >= 10) {
                self.errorTip("最多只能添加10个送货地址");
                return;
            };
            self.showDetailDialog();
        });
        /**
         * 列表加载完成触发
         */
        $(this).on("listComplete", function() {
            this.opt.listComplete && this.opt.listComplete(self);
            var $poiaddressEl = $("#new-address-section");
            this.initSugEvent($poiaddressEl);

            $(document).on("click", function() {
                $poiaddressEl.find(".s-selected").hide();
                $poiaddressEl.find(".s-search-container2").hide();
            });
        });
        /**
         * 对话框弹出
         */
        $(this).on("dialogShow", function() {
            this.opt.dialogShow && this.opt.dialogShow(self);
        });
        /**
         * 内嵌网页显示触发
         */
        if (this.opt.$detailEl) {
            this.opt.$detailEl.on("click", ".saveBtn", function() {
                self.saveAddress();
            });
            this.opt.$detailEl.on("click", ".escBtn", function() {
                self.cacheDialog.hide({
                    fade: true
                });
                //self.cacheDialog.destory();
            });
        }
        /**
         * 保存成功触发
         */
        $(this).on("saveSuccess", function(e, data) {
            if (this.opt.saveSuccess) {
                this.opt.saveSuccess(self, data);
            } else {
                self.cacheDialog.hide({
                    fade: true
                });
                this.successTip("保存成功，正在刷新...");
                setTimeout(function() {
                    window.location.reload();
                }, 1500);
            }
        });
        /**
         * 删除地址触发
         */
        $(this).on("itemRemove", function(e, id) {
            if (this.opt.itemRemove) {
                self.opt.itemRemove(self, id);
            } else {
                //$li.fadeOut();
            }
        });
    },
    initList: function() {
        var data = this.opt.data;
        if (this.opt.data && this.opt.data.length > 0) {
            this.opt.$listEl.prepend(listTmpl({
                data: this.opt.data
            }));
        }
        /*else if(this.opt.reForm){
            //如果地址数据为空，
            this.opt.$detailE.append(detailTeml());
        }*/
        $(this).trigger('listComplete');
    },
    initSugEvent: function(obj) {
        var self = this;
        var $poiaddressEl = obj;
        var $resultEl = $poiaddressEl.find(".s-search-container2");
        var $searchConEl = $poiaddressEl.find('#poi_address');
        var $searchPOI = $poiaddressEl.find("#poi_address");
        var $hiddenSearchPOI = $poiaddressEl.find("#hide_poi_address");

        Search.init({
            $resultEl: $resultEl,
            $searchConEl: $searchConEl,
            showHistoryTrg: 'address.show.history',
            hideHistoryTrg: 'address.hide.history',
            NOListLiJump: 'NOPE',
            $hiddenSearchPOI: $hiddenSearchPOI
        });

        $searchPOI.on("click", function(e) {
            self.showSearch($poiaddressEl);
            e.stopPropagation();
        });

        $('.mod-dialog-wrap').on("click", function(e) {
            $resultEl.hide();
            e.stopPropagation();

        });

        $searchConEl.on('blur', function() {
            if (window.NOBLUR == "NOPE") {
                self.checkForm("SUG");
            }
        })

    },
    showSearch: function(obj) {
        var self = this;
        var $searchPOI = obj.find("#poi_address");
        //$searchPOI.val("");
        $searchPOI.focus();

        $(Search).trigger('hide.history');

    },
    bindGenderEvent: function($detail) {
        $detail.on("click", ".s-gender", function() {
            if ($(this).hasClass('selected')) {
                return;
            } else {
                $(".s-gender").removeClass('selected');
                $(this).addClass('selected');
                var _gender = $(this).attr("data-gender");
                $(this).parent().find("[name='gender']").val(_gender);
            }
        });
    },
    showDetailDialog: function(data) {
        var _data = data ? data : {}; /*{user_name:"李利德",gender:"1",user_phone:"15201116963",address:"百度测试百度测试"}*/ ;
        var _html = detailTeml({
            data: _data,
            noCancel: false,
            confirmTxt: "保存"
        });
        this.cacheDialog = new Dialog({
            html: _html,
            width: 560,
            height: 400
        });
        this.cacheDialog.show({
            fade: true
        });
        this.opt.$detailEl = $(".addr-detail");
        $(".placeholder-con").placeholder();
        this.bindGenderEvent(this.opt.$detailEl);
        $(this).trigger('dialogShow');

        this.initSugEvent(this.opt.$detailEl);
    },
    removeAddress: function($li) {
        var _id = $li.attr("data-id");
        $.ajax({
            url: REMOVE_AJAX,
            type: "GET",
            dataType: "json",
            data: {
                id: _id,
                bdstoken: $("#bdstoken").val()
            },
            context: this,
            success: function(rs) {
                if (rs.error_no == 0) {
                    $li.fadeOut();
                    $li.remove();
                    this.successTip("送餐地址删除成功");
                    $(this).trigger("itemRemove", _id);
                } else {
                    var msg = rs.error_msg ? rs.error_msg : "服务器累了，请稍后重试";
                    this.errorTip(msg);
                }
            }
        });
    },
    saveAddress: function() {
        this.errorHide();
        if (this.checkForm()) {
            var data = this.getFormData();
            data.bdstoken = $("#bdstoken").val();
            var ajaxUrl = data.id ? UPDATE_AJAX : ADD_AJAX;
            $.ajax({
                url: ajaxUrl,
                type: "POST",
                dataType: "json",
                data: data,
                context: this,
                success: function(rs) {
                    if (rs.error_no == 0) {
                        data.__type = data.id ? "update" : "add";
                        data.id = data.id || rs.result.id || "";
                        $(this).trigger("saveSuccess", data);
                    } else {
                        var msg = rs.error_msg ? rs.error_msg : "服务器累了，请稍后重试";
                        this.errorTip(msg);
                    }
                }
            })
        }
    },
    checkForm: function(SUG) {
        var sug = SUG ? 1 : 0;
        if (sug) {
            var sug_address = this.getInputValue("sug_address");
            var loc = this.opt.$detailEl.find("#hide_poi_address").val();
            if (!$.trim(sug_address) || sug_address.length > 40 || !loc) {
                this.errorShow("sug_address");
            }
            return false;
        }

        var user_name = this.getInputValue("user_name");
        if (!$.trim(user_name) || user_name.length > 8) {
            this.errorShow("user_name");
            return false;
        }
        var gender = this.getInputValue("gender");
        if (!gender) {
            this.errorShow("gender");
            return false;
        }
        var user_phone = this.getInputValue("user_phone");
        if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(user_phone))) {
            this.errorShow("user_phone");
            return false;
        }
        var sug_address = this.getInputValue("sug_address");
        var loc = this.opt.$detailEl.find("#hide_poi_address").val();
        if (!$.trim(sug_address) || sug_address.length > 40 || !loc) {
            this.errorShow("sug_address");
            return false;
        }
        return true;
    },
    getFormData: function() {
        var $inputEls = this.opt.$detailEl.find(".input-control");
        var result = {};
        for (var i = 0, len = $inputEls.length; i < len; i++) {
            var _$tmp = $inputEls.eq(i);
            var _name = _$tmp.find("input").length ? _$tmp.find("input").attr("name") : _$tmp.find("textarea").attr("name");
            result[_name] = this.getInputValue(_name);
        }
        result.id = this.getInputValue("adrr_id");
        var loc = $inputEls.find("#hide_poi_address").val();
        result.lat = loc.split('-')[0] ? loc.split('-')[0] : "";
        result.lng = loc.split('-')[1] ? loc.split('-')[1] : "";

        result.address = result.sug_address + " " + result.detail_address;
        return result;
    },
    successTip: function(msg) {
        GlobalTips.tip(msg);
    },
    errorTip: function(msg) {
        GlobalTips.tip(msg);
    },
    errorShow: function(name) {
        $("[name='" + name + "']").parent().next().removeClass('v-hide');
        $("[name='" + name + "']").addClass('caution-line');
        this.errorHide(2500, name);
    },
    errorHide: function(duration, name) {
        var duration = duration ? duration : 0;
        var name = name ? name : '';

        if (duration) {
            setTimeout(function() {
                $(".error-msg").addClass('v-hide');
                if (name) {
                    $("[name='" + name + "']").removeClass('caution-line');
                }
            }, duration);
            return;
        }

        $(".error-msg").addClass('v-hide');
    },
    getInputValue: function(name) {
        var inputEl = this.opt.$detailEl.find("[name='" + name + "']");
        var tagName = inputEl.get(0).tagName.toLowerCase(),
            type = inputEl.attr('type'),
            getRadioValue = function() {
                var radioEl = $(" input[name='" + name + "']").filter(':checked');
                if (radioEl.length) {
                    return radioEl.val();
                }
                return null;
            },
            getCheckBoxValueByArray = function() {
                var result = [],
                    chxEl = $(" input[name='" + name + "']:checkbox");
                len = chxEl.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (chxEl[i].checked) {
                            result.push(chxEl[i].value);
                        }
                    }
                }
                return result;
            },
            getRedirectValue = function() {
                return inputEl.val();
            };
        switch (tagName) {
            case "input":
                switch (type) {
                    case "radio":
                        return getRadioValue();
                        break;
                    case "checkbox":
                        return getCheckBoxValueByArray();
                        break;
                    default:
                        return getRedirectValue();
                        break;
                };
                break;
            case "select":
                return getRedirectValue();
                break;
            case "textarea":
                return getRedirectValue();
                break;
            default:
                return null;
                break;
        }
    },
    addFormHtml: function() {
        //user_name:"李利德",gender:"1",user_phone:"15201116963",address:"百度测试百度测试"
        return detailTeml({
            data: {},
            noCancel: true,
            confirmTxt: "保存送餐信息"
        });
    },
    updateOpt: function(data) {
        this.opt = $.extend({}, this.opt, data);
    }
});
module.exports = Address; 
});
;define('bigba:widget/common/ui/feedback/feedback.js', function(require, exports, module){ var GlobalTips = require('bigba:static/utils/GlobalTips.js');
var FEEDBACK_AJAX = "/waimai?qt=feedback";
var feedbackTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="feedback-wrap">    <div class="f-form">        <div class="form-group">            <label>功能建议：</label>            <div class="input-control">                <textarea name="content" placeholder="百度外卖还在不断完善和成长，我们真诚的期望听到您的反馈和建议" class="input placeholder-con"></textarea>            </div>            <div class="error-msg v-hide"></div>        </div>        <div class="form-group">            <label>联系方式：</label>            <div class="input-control">                <input type="text" name="contact" placeholder="请留下您的手机号或邮箱" class="input placeholder-con"/>            </div>            <div class="error-msg  v-hide"></div>        </div>        <div class="form-submit">            <input type="button" value="提交" class="submitBtn"/>            <input type="button" value="取消" class="cancelBtn versa"/>        </div>    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

var LISTENER=window.listener;

var opt = {
    $el : null,
    saveSuccess : null
}
function Feedback(arg){
    $.extend(opt,arg);
    bindEvent();
    initContent();
}
function bindEvent(){
    var $el = opt.$el;
    $el.on("saveSuccess",function(){
        opt.saveSuccess($el);
    });
    $el.on("click",".submitBtn",function(){
        commitForm();
    });
    $el.on("focus",".input",function(){
        var _name = $(this).attr("name");
        removeError(_name);
    });

}
function initContent(){
    var _html = feedbackTmpl();
    opt.$el.append(_html);
}
function showError(name,msg){
    var $el = opt.$el;
    $el.find("[name='"+name+"']").parent().next().removeClass("v-hide").text(msg);
    return;
}
function removeError(name){
    var $el = opt.$el;
    $el.find("[name='"+name+"']").parent().next().addClass("v-hide").empty();
    return;
}
function commitForm(){
    var $el = opt.$el;
    var _content = $el.find("[name='content']").val();
    var _contact = $el.find("[name='contact']").val();
    var _from = "pc";
    if(!$.trim(_content)){
        showError("content","请填写功能建议");
        return;
    }
    if(_content.length > 800){
        showError("content","功能建议最多不能超过800个字");
        return;
    }
    if(!checkContact(_contact)){
        showError("contact","请填写正确的联系方式");
        return;
    }
    $.ajax({
        url: FEEDBACK_AJAX,
        type: "POST",
        dataType: "json",
        data:{content:_content,contact:_contact,from:_from},
        success: function(rs){
            if(rs.error_no == 0){
                $el.trigger('saveSuccess');
                LISTENER.trigger("waimai-contact-feedback","feedback",{
                    succ:true
                });
                return;
            }else{
                GlobalTips.tip(rs.error_msg);
                return false;
            }
        },
        error:function(){
            GlobalTips.tip("操作失败1");
        }
    });
}
function checkContact(v){
    var regEmailInvalid = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
    var regEmailValid = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
    var regMobileValid = /^1[3|4|5|7|8][0-9]\d{8}$/;
    var regPhoneValid = /^0[\d]{2,3}-[\d]{7,8}/;///^0[\d]{10,12}/
    if(!$.trim(v)){
        return false;
    }
    if(!regEmailInvalid.test(v) && regEmailValid.test(v)){
        return true;
    }
    if(regMobileValid.test(v)){
        return true;
    }
    if(regPhoneValid.test(v)){
        return true;
    }
    return false;
}
module.exports = Feedback;
 
});
;define('bigba:widget/common/ui/multiSetmeal/setmeal.js', function(require, exports, module){ /**
 * 商户列表&商户卡片
 * @author boye.liu
 */
var cookie = require("bigba:static/utils/Cookie.js");
var localStore = require("bigba:static/utils/store.js");
var setMealTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="setMeal">    <div class="dish-title" data-node="setMeal-title">    </div>    <div class="content" data-node="setMeal-content">        <div class="groups" data-node="setMeal-content-groups">        </div>        <div class="dishes" data-node="setMeal-content-dishes">        </div>    </div>    <div class="bottom" data-node="setMeal-bottom">    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealTitleTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<span class="closeBtn"></span><h2>',typeof(data.itemName) === 'undefined'?'':baidu.template._encodeHTML(data.itemName),'</h2>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealDishTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="list-title">    <div class="big-tip">        ');if(parseInt(data.min_num)>=1){_template_fun_array.push('            必选        ');}else{_template_fun_array.push('            可选        ');}_template_fun_array.push('        ');if(parseInt(data.min_num)==parseInt(data.max_num)){_template_fun_array.push('            ');if(data.min_num==1){_template_fun_array.push('            (单选)            ');}else{_template_fun_array.push('            (多选 ',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)            ');}_template_fun_array.push('        ');}else{_template_fun_array.push('            (多选 ',typeof(data.min_num) === 'undefined'?'':baidu.template._encodeHTML(data.min_num),'-',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)        ');}_template_fun_array.push('    </div>    <span class="select-msg" data-node="selectmsg">&nbsp;            </span></div><div class="dishes-list ');if(selected && selected.total && selected.total.count>=data.max_num){_template_fun_array.push(' enough');}_template_fun_array.push('">    '); if(data.ids.length>0){var len = data.ids.length;var divider = Math.ceil(len/2)-1;_template_fun_array.push('        ');for(var i=0,len=data.ids.length;i<len;i++){var item = data.ids[i];_template_fun_array.push('            ');if(i==0){_template_fun_array.push('                <div class="dish-c">            ');}_template_fun_array.push('            ');if(parseInt(item.have_attr) || parseInt(item.have_feature)){_template_fun_array.push('            <div class="dish-item mutiple" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <div class="mutiple-title" data-node="mutipletitle">                    <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                    <span class="right-side">                        <span class="mutiple-box">                            多规格                        </span>                        <span class="dish-cost" data-node="dishCost">￥');if(selected && selected[item.item_id] && selected[item.item_id].realPrice){_template_fun_array.push('',typeof(selected[item.item_id].realPrice) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].realPrice),'');}else{_template_fun_array.push('',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'');}_template_fun_array.push('</span>                        <span class="select-icon"></span>                    </span>                </div>                <div class="mutiple-content">                    <table class="size-table" data-node="sizeTable">                        ');for(var da in item.dish_attr){item.dish_attr[da].mainK=1;}_template_fun_array.push('                        ');var attrs = _.extend(item.dish_features,item.dish_attr);for(var att in attrs){;_template_fun_array.push('                        <tr data-key="',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'" data-maink="');if(attrs[att].mainK){_template_fun_array.push('1');}else{_template_fun_array.push('0');}_template_fun_array.push('">                            <td class="attr-title" valign="top">',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'：</td>                            <td>                                ');for(var j=0,attrlen=attrs[att].length;j<attrlen;j++){_template_fun_array.push('                                    <span class="s-item ');if(selected && selected[item.item_id] && _.indexOf(selected[item.item_id].features,attrs[att][j]['id'])!=-1){_template_fun_array.push(' sec');}_template_fun_array.push('" data-price="',typeof(attrs[att][j]['price']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['price']),'"  data-id="',typeof(attrs[att][j]['id']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['id']),'"  data-name="',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'">',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'</span>                                ');}_template_fun_array.push('                            </td>                        </tr>                        ');}_template_fun_array.push('                        <tr>                            <td colspan="2">                                <span class="select-box">                                    ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                                        <span class="minusicon" data-node="minusIcon"></span>                                        <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                                        <span class="addicon" data-node="addIcon"></span>                                    ');}else{_template_fun_array.push('                                        <span class="minusicon v-hide" data-node="minusIcon"></span>                                        <span class="select_count v-hide">0</span>                                        <span class="addicon disable" data-node="addIcon"></span>                                    ');}_template_fun_array.push('                                </span>                            </td>                        </tr>                    </table>                </div>            </div>            ');}else{_template_fun_array.push('            <div class="dish-item" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                <span class="right-side">                    <span class="select-box">                        ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                            <span class="minusicon" data-node="minusIcon"></span>                            <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}else{_template_fun_array.push('                            <span class="minusicon v-hide" data-node="minusIcon"></span>                            <span class="select_count v-hide">0</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}_template_fun_array.push('                    </span>                    <span class="dish-cost">￥',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'</span>                </span>            </div>            ');}_template_fun_array.push('            ');if(i==divider){_template_fun_array.push('                </div><div class="dish-c">            ');}_template_fun_array.push('            ');if(i==len-1){_template_fun_array.push('                </div>            ');}_template_fun_array.push('        ');}_template_fun_array.push('    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealGrpsTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('    <div class="group-item ');if(curIndex==i){_template_fun_array.push(' select');}_template_fun_array.push('" data-index="',typeof(i) === 'undefined'?'':baidu.template._encodeHTML(i),'" data-grps-id="',typeof(item.dish_group_id) === 'undefined'?'':baidu.template._encodeHTML(item.dish_group_id),'">        <span class="top-tip"></span>        ');if(parseInt(item.min_num)>0){_template_fun_array.push('            <p class="gtitle">必选</p>        ');}else{_template_fun_array.push('            <p class="gtitle-not">可选</p>        ');}_template_fun_array.push('        <p class="gname">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</p>    </div>    ');if(i<len-1){_template_fun_array.push('        <div class="group-divider">            +        </div>    ');}_template_fun_array.push('');}_template_fun_array.push('<span class="group-arrow" data-node="groupArrow"></span>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealBotmTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<table width="100%">    <tr>        <td width="300">            套餐价：<span class="price" data-node="bottomprice" data-type="',typeof(data.isFixedPrice) === 'undefined'?'':baidu.template._encodeHTML(data.isFixedPrice),'">￥');if(parseInt(data.isFixedPrice)==1){_template_fun_array.push('',typeof(data.itemPrice) === 'undefined'?'':baidu.template._encodeHTML(data.itemPrice),'');}else{_template_fun_array.push('0');}_template_fun_array.push('</span>        </td>        <td>            ');if(data.itemStock<50){_template_fun_array.push('库存',typeof(data.itemStock) === 'undefined'?'':baidu.template._encodeHTML(data.itemStock),'份');}_template_fun_array.push('            ');if(data.itemStock<50 && data.minOrderNumber>1){_template_fun_array.push(' | ');}_template_fun_array.push('            ');if(data.minOrderNumber>1){_template_fun_array.push('',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'份起订');}_template_fun_array.push('        </td>        <td>            <div class="select-outer disable" data-node="selectouter">                <div class="select-con">                    <div class="select-inner">                        <strong class="minusfrcart" data-node="minusfrcart"></strong>                        <strong class="select_count" data-node="selectCount">',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'</strong>                        <strong class="addtocart" data-node="addtocart"></strong>                    </div>                </div>            </div>        </td>        <td width="170" align="center"><span class="submit-btn disable"  data-node="submitBtn">加入购物车</span></td>    </tr></table>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var dishListClass = ".dishes-list";
var dishItemClass = ".dish-item";
var mulItemClass = "mutiple";
var grpItemClass = ".group-item";
var seboxItemCls = ".select-box";
var countItemCls = ".select_count";
var EventCenter;
var GlobalTips = require('bigba:static/utils/GlobalTips.js');
var pindan_id = $('[data-node=pinDanId]').html();
/*
* opt = {
*   data : data
*   $el : 列表父元素 必须是ul
*   selectData:{
    "9364224917068359757": {//套餐中的组id
        "total": {
            "count": 2
        },
        "1663427882012019110": {
            "count": 1,
            "realId": "1663427882012019110_105867",//真正的id来自规格id
            "realPrice": "2.00",
            "features": [
                "13663338480194713593",
                "13663338480194713599",
                "1663427882012019110_105867"//规格id
            ],
            "featueNames": [
                "冷",
                "酸",
                3 //规格名称
            ],
            "dname": "折扣单品"
        },
        "10763787674842328466": {
            "count": 1,
            "dname": "测试2"
        }
    },
    "1711681714380835476": {
        "total": {
            "count": 1
        },
        "13793538995861552031": {
            "count": 1,
            "dname": "test555"
        }
    }
* curGrp：当前group所在data中的index，
*}
*/

function setMeal(opt){
    var _opt = {
        data : [],
        $el : null,
        selectData:{},
        curGrp:0,
        selectBasic:{}
    };
    EventCenter = $({});
    this.opt = $.extend(_opt,opt);
    this.renderList(this.opt.data);
    this.bindEvent();
}
$.extend(setMeal.prototype, {
    renderList: function(data){
        var _$el = this.opt.$el;
        if(data && data.groups.length > 0){
            var _html = setMealTmpl();
            _$el.html(_html);
            _$el.find("[data-node=setMeal-title]").html(setMealTitleTmpl({data:data.basics}));
            _$el.find("[data-node=setMeal-content-groups]").html(setMealGrpsTmpl({data:data.groups,curIndex:this.opt.curGrp}));
            _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:data.groups[this.opt.curGrp],selected:{}}));
            _$el.find("[data-node=setMeal-bottom]").html(setMealBotmTmpl({data:data.basics}));

            $(this).trigger('list.complete');
        }
    },
    getRealLeftNum: function(id){

    },
    bindEvent: function(){
        var self = this;
        var $me = self.opt.$el;
        $me.find("[data-node=setMeal-title]").on("click",function(){});
        //切换groups
        $me.find("[data-node=setMeal-content-groups]").on("click", grpItemClass,function(e){
            var _target=$(e.currentTarget);
            self.switchGrps(_target,$me.find("[data-node=setMeal-content-groups]"));
        });
        //多规格展示
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=mutipletitle]", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            _target.parents(dishItemClass).toggleClass("selected");
        });
        //选择属性
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=sizeTable] .s-item", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            if(_target.hasClass("sec"))return;
            _target.parents("tr").find(".s-item").removeClass("sec");
            _target.addClass("sec");
            self.selectAttr(_target);
            EventCenter.trigger("selectAttr");
        });
        $me.find("[data-node=setMeal-bottom]").on("click","[data-node]",function(e){
            var _target=$(e.currentTarget);
            self.handleBottomeClick(_target);
        });
        //加菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=addIcon]",function(e){
            var _target=$(e.currentTarget);
            var _par = _target.parents(dishListClass);
            if(_par.hasClass("enough")) {
                GlobalTips.tip("已到达可选菜品上限");
            } else if(_target.hasClass("disable")) {
                GlobalTips.tip("多规格菜品需要先选择规格");
            }
            self.addIconClick(_target);
        });
        //减菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=minusIcon]",function(e){
            var _target=$(e.currentTarget);
            self.minusIconClick(_target);
        });
        //属性选择后 需要执行的处理
        EventCenter.on("selectAttr",function(){
            self.refreshSelectMsg();
            self.refreshBottom();
        });
        //增加菜品后 需要的执行处理
        EventCenter.on("addDish",function(){
            self.onAddDish();
        });
        //减少菜品后 需要的执行处理
        EventCenter.on("minusDish",function(){
            self.onMinusDish();
        });
        //切换菜品组后 需要的执行处理
        EventCenter.on("switchGrps",function(){
            self.refreshSelectMsg();
        });
    },
    switchGrps: function(cur,par){
        var self = this;
        var _$el = self.opt.$el;
        var data = self.opt.data;
        par.find(grpItemClass).removeClass("select");
        cur.addClass("select");

        self.opt.curGrp = cur.data("index");
        var grpData = data.groups[self.opt.curGrp];
        _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:grpData,selected:self.opt.selectData[grpData.dish_group_id]}));
        self.setArrowPos(cur);
        EventCenter.trigger("selectAttr");
        //console.log(self.opt.selectData[grpData.dish_group_id]);
    },
    setArrowPos: function(cur){
        var self = this;
        var _$el = self.opt.$el;
        var _pos = cur.position();
        var $arrow = _$el.find("[data-node=groupArrow]");
        $arrow.css({left:(_pos.left+cur.width()/2-$arrow.width()/2)+"px"});
    },
    selectAttr: function(cur){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var rows = cur.parents("[data-node=sizeTable]").find("[data-key]");
        var features = cur.parents("[data-node=sizeTable]").find(".sec");
        var priceDom = cur.parents(dishItemClass).find("[data-node=dishCost]");
        if(features.length<rows.length){cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").addClass("disable");return false;}
        cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").removeClass("disable");
        var itemInfo = self.getItemInfo(cur);
        var itemId = itemInfo.id;
        var featueIds = [];
        var featueNames = [];
        //选择数据的判断初始化
        //selectData[itemId] = selectData[itemId] || {count:0};
        selectData[itemId] =self.getItemSelectData(itemInfo,selectData[itemId]);
        //遍历所有属性
        for(var i=0,len=rows.length;i<len;i++){
            if($(rows[i]).data("maink") == "1"){
                selectData[itemId].realId = $(rows[i]).find(".sec").data("id")+"";
                selectData[itemId].realPrice = $(rows[i]).find(".sec").data("price");
                //selectData[itemId].attrName = $(rows[i]).find(".sec").data("name");
                priceDom.text("￥"+$(rows[i]).find(".sec").data("price"));
            }else{}
            featueIds.push($(rows[i]).find(".sec").data("id")+"");
            featueNames.push($(rows[i]).find(".sec").data("name"));
        }
        selectData[itemId].features = featueIds;
        selectData[itemId].featueNames = featueNames;
        if(cur.data("node")=="addIcon"){
            selectData[itemId].count++;
        }else if(cur.data("node")=="minusIcon"){
            selectData[itemId].count--;
        }
        self.opt.selectData[curGrpsId] = selectData;
        return true;
    },
    onAddDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    onMinusDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    //用户选择信息总汇
    refreshSelectMsg: function(){
        var self = this;
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品
        //菜品选择区域控制
        if(_csdata && _csdata.total && parseInt(_csdata.total.count) >= parseInt(_cdata.max_num)){
            self.opt.$el.find(dishListClass).addClass("enough");
        }else{
            self.opt.$el.find(dishListClass).removeClass("enough");
        }
        
        var _str = "&nbsp;";
        for(var i in _csdata){
            if(i=="total"){continue;}
            //数量大于0再展示
            if(_csdata[i].count){
                _str += _csdata[i].dname;//+"_"+(_csdata[i].attrName || "");
                if(_csdata[i].featueNames && _csdata[i].featueNames.length){
                    _str+="_"+_csdata[i].featueNames.join("_");
                }
                _str += "*"+_csdata[i].count+"、";
            }
        }
        self.opt.$el.find("[ data-node=selectmsg]").html(_str);
    },
    //刷新用户选择信息top tip
    refreshTopTip: function(){
        var self = this;
        var _sdata = self.opt.selectData;
        var _data = self.opt.data;
        for(var i=0,len=_data.groups.length;i<len;i++){
            var _tipDom = $("[data-grps-id="+_data.groups[i].dish_group_id+"]").find(".top-tip");
            if(_sdata[_data.groups[i].dish_group_id]){
                var _totalC = _sdata[_data.groups[i].dish_group_id].total.count;
                if(_totalC && _data.groups[i].min_num<=_totalC && _totalC<=_data.groups[i].max_num){
                    _tipDom.addClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else if(_totalC && _sdata[_data.groups[i].dish_group_id].total.count>=0){
                    _tipDom.removeClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else{
                    _tipDom.hide();
                }
            }
        }
    },
    refreshBottom: function(){
        var self = this;
        var $el = self.opt.$el;
        var $price = $el.find("[data-node=bottomprice]");
        var $select = $el.find("[data-node=selectouter]");
        var $submitBtn = $el.find("[data-node=submitBtn]");
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        /*var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品*/
        var checkArr = [];//也可以用与元算来处理
        var _price = 0;
        //对groups进行check，看是否符合下单规则
        for(var i=0,len=_data.length;i<len;i++){
            if(parseInt(_data[i].min_num)){
                if(_sdata[_data[i].dish_group_id] && _sdata[_data[i].dish_group_id].total.count>=_data[i].min_num){
                    checkArr.push(1);
                }else{
                    checkArr.push(0);
                }
            }
            if(Math.min.apply(null,checkArr)===1){
                //通过检查
                $select.removeClass("disable");
                $submitBtn.removeClass("disable");
            }else{
                $select.addClass("disable");
                $submitBtn.addClass("disable");
            }
        }
        //处理非固定价格套餐
        if(parseInt($price.data("type"))!==1){
            for(var item in _sdata){
                //_sdata第一层为套餐组id
                var tmpItem = _sdata[item];
                if(!tmpItem.total.count){continue;}
                //_sdata第二层为单菜品，计算价格主要在此
                for(var ditem in tmpItem){
                    if(ditem==="total" || !tmpItem[ditem].count){continue;}
                    _price+= (parseFloat(tmpItem[ditem].realPrice || tmpItem[ditem].price))*(parseInt(tmpItem[ditem].count));
                }
            }
            $price.html("￥"+(_price).toFixed(2));
            self.opt.selectBasic.price = _price;
        } else {
            self.opt.selectBasic.price = self.opt.data.basics.itemPrice;
        }
    },
    //菜品增加，减少按钮的逻辑控制
    refreshSelectArea: function(cur,selectData,itemInfo){
        var _par = cur.parent();
        if(selectData[itemInfo.id].count>0){
            _par.find("[data-node=minusIcon]").removeClass("v-hide");
            _par.find(countItemCls).text(selectData[itemInfo.id].count).removeClass("v-hide");
        }else{
            cur.parent().find(countItemCls).text(selectData[itemInfo.id].count).addClass("v-hide");
            _par.find("[data-node=minusIcon]").addClass("v-hide");
        }
    },
    addIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _max = parseInt(data.max_num);
        var curGrpsId = data.dish_group_id;

        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData.total.count<_max){
            if(self.selectAttr(curDom)){
                selectData.total.count++;
            }
        }else if(selectData.total.count<_max){
            selectData.total.count++;
            selectData[itemInfo.id].count++;
        }else{
            return;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("addDish");
    },
    //判断选择数据是否存在，不存在则初始化
    getItemSelectData:function(itemInfo,selectData){
        selectData = selectData || {count:0,dname:itemInfo.name,price:itemInfo.price};
        return selectData;
    },
    //针对需要存到cookie中的值在此获取
    getItemInfo:function(curDom){
        var parItem = curDom.parents(dishItemClass);
        var _id = "";
        /*if(parItem.hasClass(mulItemClass)){
            _id = parItem.find("[data-maink=1] .s-item.sec").data("id");
        }else{*/
        _id = parItem.data("id")+"";
        var _name = parItem.data("name");
        var _price = parItem.data("price");
        //}
        return {id:_id,name:_name,price:_price,count:0};
    },
    minusIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _min = parseInt(data.min_num);
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData[itemInfo.id].count>=1){
            if(self.selectAttr(curDom)){
                selectData.total.count--;
            }
        }else if(selectData[itemInfo.id].count<=0){
            selectData[itemInfo.id].count=0;
            return;
        }else{
            selectData.total.count--;
            selectData[itemInfo.id].count--;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("minusDish");
    },
    //底部区域按钮点击
    handleBottomeClick : function(cur){
        var self = this;
        var data = self.opt.data.basics;
        var nodeType = cur.data("node");
        var $sCount = self.opt.$el.find("[data-node=selectCount]");
        var curCount = parseInt($sCount.html()) || 0;
        //if(!$.isNumeric(curCount)){curCount = data.minOrderNumber;}
        if(nodeType==="addtocart"){
            if(curCount && curCount<data.itemStock){
                $sCount.html(++curCount);
            }else if(!curCount){
                $sCount.html(data.minOrderNumber);
            }
        }else if(nodeType==="minusfrcart"){
            if(curCount<=data.minOrderNumber){
                $sCount.html(0);
            }else{
                $sCount.html(--curCount);
            }
        }
        self.opt.data.basics.itemCount = curCount;
        if(nodeType==="submitBtn"){
            !cur.hasClass("disable") && self.submitSetMeal();
        }
    },
    //调整数据结构来适应购物车结构
    //bdata结构
    //basic：包含选中菜品基本信息，与单菜品相同的属性key
    //data：选择的套餐信息
    adjustDataStructure: function(bdata){
        var _tmpId = "";
        //id赋值给变量记住
        bdata.orignItemId = bdata.itemId;
        bdata.grpsInfo.basic.id = bdata.itemId;
        //真实价格
        bdata.itemPrice = bdata.grpsInfo.basic.price;
        //采用append方式
        bdata.type = "append";
        //文件顶部有selectData的机构，下面要做的是把这个结构转换成一个字符串
        //字符串中包含所有的id，组id，菜id，属性id；并且id按顺序拼接
        //id之后由 _p 接个数
        var grpsIds = [];
        var dishIds = [];
        var featureIds = [];
        for(var i in bdata.grpsInfo.data){
            var tmpData = bdata.grpsInfo.data[i];
            grpsIds.push(i+"_p"+tmpData.total.count);
            for(var ix in tmpData){
                if(ix==="total")continue;
                dishIds.push(ix+"_p"+tmpData[ix].count);
                if(tmpData[ix].features && tmpData[ix].features.length){
                    featureIds.concat(tmpData[ix].features);
                }
            }
        }
        bdata.itemId = grpsIds.sort().join("__")+"___"+dishIds.sort().join("__")+"___"+featureIds.sort().join("__");
    },
    //套餐数据存到cookie中
    saveGrpsData: function(data){
        if (data.grpsInfo) {
            localStore.set('p' + pindan_id + data.itemId + 'p',data.grpsInfo);
            /*cookie.set('s' + data.itemId + 's', JSON.stringify(data.grpsInfo), {
                path: '/'
            });*/
        };
    },
    submitSetMeal:function(){
        var self = this;
        //console.log(self.opt);
        var _res = {};
        _res = $.extend(_res,self.opt.data.basics);
        _res.grpsInfo = {basic:self.opt.selectBasic,data:self.opt.selectData};
        self.adjustDataStructure(_res);
        self.saveGrpsData(_res);
        self.opt.onSubmitBtn(_res);
    }
});

module.exports = setMeal;
 
});
;define('bigba:widget/common/ui/muticities/muti.js', function(require, exports, module){ var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");

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
;define('bigba:widget/common/ui/noresult/noresult.js', function(require, exports, module){ var tmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="no-result">    <div class="no-result-image" style="padding:80px 0 20px;">        <img src="" alt="无结果" style="display:block;margin:auto;">    </div>    <div class="no-result-notice" style="text-align:center;padding-bottom: 50px;"></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var img_src = '/static/images/noresult.png';
module.exports = {
    show: function(msg, container,imgsrc) {
        if(imgsrc){
            img_src = imgsrc;
        }
        $container = $(container);
        $container.html(tmpl()).find('.no-result-notice').html(msg);
        $container.find('img').attr('src', img_src);
        this.$container = $container;
    },
    hide: function() {
        this.$container.find('.no-result').remove();
    }
}; 
});
;define('bigba:widget/common/ui/popCarousel/popCarousel.js', function(require, exports, module){ /**
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
;define('bigba:widget/common/ui/setmeal/setmeal.js', function(require, exports, module){ /**
 * 商户列表&商户卡片
 * @author boye.liu
 */
var cookie = require("bigba:static/utils/Cookie.js");
var localStore = require("bigba:static/utils/store.js");
var setMealTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="setMeal">    <div class="dish-title" data-node="setMeal-title">    </div>    <div class="content" data-node="setMeal-content">        <div class="groups" data-node="setMeal-content-groups">        </div>        <div class="dishes" data-node="setMeal-content-dishes">        </div>    </div>    <div class="bottom" data-node="setMeal-bottom">    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealTitleTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<span class="closeBtn"></span><h2>',typeof(data.itemName) === 'undefined'?'':baidu.template._encodeHTML(data.itemName),'</h2>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealDishTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="list-title">    <div class="big-tip">        ');if(parseInt(data.min_num)>=1){_template_fun_array.push('            必选        ');}else{_template_fun_array.push('            可选        ');}_template_fun_array.push('        ');if(parseInt(data.min_num)==parseInt(data.max_num)){_template_fun_array.push('            ');if(data.min_num==1){_template_fun_array.push('            (单选)            ');}else{_template_fun_array.push('            (多选 ',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)            ');}_template_fun_array.push('        ');}else{_template_fun_array.push('            (多选 ',typeof(data.min_num) === 'undefined'?'':baidu.template._encodeHTML(data.min_num),'-',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)        ');}_template_fun_array.push('    </div>    <span class="select-msg" data-node="selectmsg">&nbsp;            </span></div><div class="dishes-list ');if(selected && selected.total && selected.total.count>=data.max_num){_template_fun_array.push(' enough');}_template_fun_array.push('">    '); if(data.ids.length>0){var len = data.ids.length;var divider = Math.ceil(len/2)-1;_template_fun_array.push('        ');for(var i=0,len=data.ids.length;i<len;i++){var item = data.ids[i];_template_fun_array.push('            ');if(i==0){_template_fun_array.push('                <div class="dish-c">            ');}_template_fun_array.push('            ');if(parseInt(item.have_attr) || parseInt(item.have_feature)){_template_fun_array.push('            <div class="dish-item mutiple" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <div class="mutiple-title" data-node="mutipletitle">                    <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                    <span class="right-side">                        <span class="mutiple-box">                            多规格                        </span>                        <span class="dish-cost" data-node="dishCost">￥');if(selected && selected[item.item_id] && selected[item.item_id].realPrice){_template_fun_array.push('',typeof(selected[item.item_id].realPrice) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].realPrice),'');}else{_template_fun_array.push('',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'');}_template_fun_array.push('</span>                        <span class="select-icon"></span>                    </span>                </div>                <div class="mutiple-content">                    <table class="size-table" data-node="sizeTable">                        ');for(var da in item.dish_attr){item.dish_attr[da].mainK=1;}_template_fun_array.push('                        ');var attrs = _.extend(item.dish_features,item.dish_attr);for(var att in attrs){;_template_fun_array.push('                        <tr data-key="',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'" data-maink="');if(attrs[att].mainK){_template_fun_array.push('1');}else{_template_fun_array.push('0');}_template_fun_array.push('">                            <td class="attr-title" valign="top">',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'：</td>                            <td>                                ');for(var j=0,attrlen=attrs[att].length;j<attrlen;j++){_template_fun_array.push('                                    <span class="s-item ');if(selected && selected[item.item_id] && _.indexOf(selected[item.item_id].features,attrs[att][j]['id'])!=-1){_template_fun_array.push(' sec');}_template_fun_array.push('" data-price="',typeof(attrs[att][j]['price']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['price']),'"  data-id="',typeof(attrs[att][j]['id']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['id']),'"  data-name="',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'">',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'</span>                                ');}_template_fun_array.push('                            </td>                        </tr>                        ');}_template_fun_array.push('                        <tr>                            <td colspan="2">                                <span class="select-box">                                    ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                                        <span class="minusicon" data-node="minusIcon"></span>                                        <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                                        <span class="addicon" data-node="addIcon"></span>                                    ');}else{_template_fun_array.push('                                        <span class="minusicon v-hide" data-node="minusIcon"></span>                                        <span class="select_count v-hide">0</span>                                        <span class="addicon disable" data-node="addIcon"></span>                                    ');}_template_fun_array.push('                                </span>                            </td>                        </tr>                    </table>                </div>            </div>            ');}else{_template_fun_array.push('            <div class="dish-item" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                <span class="right-side">                    <span class="select-box">                        ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                            <span class="minusicon" data-node="minusIcon"></span>                            <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}else{_template_fun_array.push('                            <span class="minusicon v-hide" data-node="minusIcon"></span>                            <span class="select_count v-hide">0</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}_template_fun_array.push('                    </span>                    <span class="dish-cost">￥',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'</span>                </span>            </div>            ');}_template_fun_array.push('            ');if(i==divider){_template_fun_array.push('                </div><div class="dish-c">            ');}_template_fun_array.push('            ');if(i==len-1){_template_fun_array.push('                </div>            ');}_template_fun_array.push('        ');}_template_fun_array.push('    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealGrpsTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('    <div class="group-item ');if(curIndex==i){_template_fun_array.push(' select');}_template_fun_array.push('" data-index="',typeof(i) === 'undefined'?'':baidu.template._encodeHTML(i),'" data-grps-id="',typeof(item.dish_group_id) === 'undefined'?'':baidu.template._encodeHTML(item.dish_group_id),'">        <span class="top-tip"></span>        ');if(parseInt(item.min_num)>0){_template_fun_array.push('            <p class="gtitle">必选</p>        ');}else{_template_fun_array.push('            <p class="gtitle-not">可选</p>        ');}_template_fun_array.push('        <p class="gname">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</p>    </div>    ');if(i<len-1){_template_fun_array.push('        <div class="group-divider">            +        </div>    ');}_template_fun_array.push('');}_template_fun_array.push('<span class="group-arrow" data-node="groupArrow"></span>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealBotmTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<table width="100%">    <tr>        <td width="300">            套餐价：<span class="price" data-node="bottomprice" data-type="',typeof(data.isFixedPrice) === 'undefined'?'':baidu.template._encodeHTML(data.isFixedPrice),'">￥');if(parseInt(data.isFixedPrice)==1){_template_fun_array.push('',typeof(data.itemPrice) === 'undefined'?'':baidu.template._encodeHTML(data.itemPrice),'');}else{_template_fun_array.push('0');}_template_fun_array.push('</span>        </td>        <td>            ');if(data.itemStock<50){_template_fun_array.push('库存',typeof(data.itemStock) === 'undefined'?'':baidu.template._encodeHTML(data.itemStock),'份');}_template_fun_array.push('            ');if(data.itemStock<50 && data.minOrderNumber>1){_template_fun_array.push(' | ');}_template_fun_array.push('            ');if(data.minOrderNumber>1){_template_fun_array.push('',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'份起订');}_template_fun_array.push('        </td>        <td>            <div class="select-outer disable" data-node="selectouter">                <div class="select-con">                    <div class="select-inner">                        <strong class="minusfrcart" data-node="minusfrcart"></strong>                        <strong class="select_count" data-node="selectCount">',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'</strong>                        <strong class="addtocart" data-node="addtocart"></strong>                    </div>                </div>            </div>        </td>        <td width="170" align="center"><span class="submit-btn disable"  data-node="submitBtn">加入购物车</span></td>    </tr></table>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var dishListClass = ".dishes-list";
var dishItemClass = ".dish-item";
var mulItemClass = "mutiple";
var grpItemClass = ".group-item";
var seboxItemCls = ".select-box";
var countItemCls = ".select_count";
var EventCenter;
var GlobalTips = require('bigba:static/utils/GlobalTips.js');
/*
* opt = {
*   data : data
*   $el : 列表父元素 必须是ul
*   selectData:{
    "9364224917068359757": {//套餐中的组id
        "total": {
            "count": 2
        },
        "1663427882012019110": {
            "count": 1,
            "realId": "1663427882012019110_105867",//真正的id来自规格id
            "realPrice": "2.00",
            "features": [
                "13663338480194713593",
                "13663338480194713599",
                "1663427882012019110_105867"//规格id
            ],
            "featueNames": [
                "冷",
                "酸",
                3 //规格名称
            ],
            "dname": "折扣单品"
        },
        "10763787674842328466": {
            "count": 1,
            "dname": "测试2"
        }
    },
    "1711681714380835476": {
        "total": {
            "count": 1
        },
        "13793538995861552031": {
            "count": 1,
            "dname": "test555"
        }
    }
* curGrp：当前group所在data中的index，
*}
*/

function setMeal(opt){
    var _opt = {
        data : [],
        $el : null,
        selectData:{},
        curGrp:0,
        selectBasic:{}
    };
    EventCenter = $({});
    this.opt = $.extend(_opt,opt);
    this.renderList(this.opt.data);
    this.bindEvent();
}
$.extend(setMeal.prototype, {
    renderList: function(data){
        var _$el = this.opt.$el;
        if(data && data.groups.length > 0){
            var _html = setMealTmpl();
            _$el.html(_html);
            _$el.find("[data-node=setMeal-title]").html(setMealTitleTmpl({data:data.basics}));
            _$el.find("[data-node=setMeal-content-groups]").html(setMealGrpsTmpl({data:data.groups,curIndex:this.opt.curGrp}));
            _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:data.groups[this.opt.curGrp],selected:{}}));
            _$el.find("[data-node=setMeal-bottom]").html(setMealBotmTmpl({data:data.basics}));

            $(this).trigger('list.complete');
        }
    },
    getRealLeftNum: function(id){

    },
    bindEvent: function(){
        var self = this;
        var $me = self.opt.$el;
        $me.find("[data-node=setMeal-title]").on("click",function(){});
        //切换groups
        $me.find("[data-node=setMeal-content-groups]").on("click", grpItemClass,function(e){
            var _target=$(e.currentTarget);
            self.switchGrps(_target,$me.find("[data-node=setMeal-content-groups]"));
        });
        //多规格展示
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=mutipletitle]", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            _target.parents(dishItemClass).toggleClass("selected");
        });
        //选择属性
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=sizeTable] .s-item", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            if(_target.hasClass("sec"))return;
            _target.parents("tr").find(".s-item").removeClass("sec");
            _target.addClass("sec");
            self.selectAttr(_target);
            EventCenter.trigger("selectAttr");
        });
        $me.find("[data-node=setMeal-bottom]").on("click","[data-node]",function(e){
            var _target=$(e.currentTarget);
            self.handleBottomeClick(_target);
        });
        //加菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=addIcon]",function(e){
            var _target=$(e.currentTarget);
            var _par = _target.parents(dishListClass);
            if(_par.hasClass("enough")) {
                GlobalTips.tip("已到达可选菜品上限");
            } else if(_target.hasClass("disable")) {
                GlobalTips.tip("多规格菜品需要先选择规格");
            }
            self.addIconClick(_target);
        });
        //减菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=minusIcon]",function(e){
            var _target=$(e.currentTarget);
            self.minusIconClick(_target);
        });
        //属性选择后 需要执行的处理
        EventCenter.on("selectAttr",function(){
            self.refreshSelectMsg();
            self.refreshBottom();
        });
        //增加菜品后 需要的执行处理
        EventCenter.on("addDish",function(){
            self.onAddDish();
        });
        //减少菜品后 需要的执行处理
        EventCenter.on("minusDish",function(){
            self.onMinusDish();
        });
        //切换菜品组后 需要的执行处理
        EventCenter.on("switchGrps",function(){
            self.refreshSelectMsg();
        });
    },
    switchGrps: function(cur,par){
        var self = this;
        var _$el = self.opt.$el;
        var data = self.opt.data;
        par.find(grpItemClass).removeClass("select");
        cur.addClass("select");

        self.opt.curGrp = cur.data("index");
        var grpData = data.groups[self.opt.curGrp];
        _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:grpData,selected:self.opt.selectData[grpData.dish_group_id]}));
        self.setArrowPos(cur);
        EventCenter.trigger("selectAttr");
        //console.log(self.opt.selectData[grpData.dish_group_id]);
    },
    setArrowPos: function(cur){
        var self = this;
        var _$el = self.opt.$el;
        var _pos = cur.position();
        var $arrow = _$el.find("[data-node=groupArrow]");
        $arrow.css({left:(_pos.left+cur.width()/2-$arrow.width()/2)+"px"});
    },
    selectAttr: function(cur){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var rows = cur.parents("[data-node=sizeTable]").find("[data-key]");
        var features = cur.parents("[data-node=sizeTable]").find(".sec");
        var priceDom = cur.parents(dishItemClass).find("[data-node=dishCost]");
        if(features.length<rows.length){cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").addClass("disable");return false;}
        cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").removeClass("disable");
        var itemInfo = self.getItemInfo(cur);
        var itemId = itemInfo.id;
        var featueIds = [];
        var featueNames = [];
        //选择数据的判断初始化
        //selectData[itemId] = selectData[itemId] || {count:0};
        selectData[itemId] =self.getItemSelectData(itemInfo,selectData[itemId]);
        //遍历所有属性
        for(var i=0,len=rows.length;i<len;i++){
            if($(rows[i]).data("maink") == "1"){
                selectData[itemId].realId = $(rows[i]).find(".sec").data("id")+"";
                selectData[itemId].realPrice = $(rows[i]).find(".sec").data("price");
                //selectData[itemId].attrName = $(rows[i]).find(".sec").data("name");
                priceDom.text("￥"+$(rows[i]).find(".sec").data("price"));
            }else{}
            featueIds.push($(rows[i]).find(".sec").data("id")+"");
            featueNames.push($(rows[i]).find(".sec").data("name"));
        }
        selectData[itemId].features = featueIds;
        selectData[itemId].featueNames = featueNames;
        if(cur.data("node")=="addIcon"){
            selectData[itemId].count++;
        }else if(cur.data("node")=="minusIcon"){
            selectData[itemId].count--;
        }
        self.opt.selectData[curGrpsId] = selectData;
        return true;
    },
    onAddDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    onMinusDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    //用户选择信息总汇
    refreshSelectMsg: function(){
        var self = this;
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品
        //菜品选择区域控制
        if(_csdata && _csdata.total && parseInt(_csdata.total.count) >= parseInt(_cdata.max_num)){
            self.opt.$el.find(dishListClass).addClass("enough");
        }else{
            self.opt.$el.find(dishListClass).removeClass("enough");
        }
        
        var _str = "&nbsp;";
        for(var i in _csdata){
            if(i=="total"){continue;}
            //数量大于0再展示
            if(_csdata[i].count){
                _str += _csdata[i].dname;//+"_"+(_csdata[i].attrName || "");
                if(_csdata[i].featueNames && _csdata[i].featueNames.length){
                    _str+="_"+_csdata[i].featueNames.join("_");
                }
                _str += "*"+_csdata[i].count+"、";
            }
        }
        self.opt.$el.find("[ data-node=selectmsg]").html(_str);
    },
    //刷新用户选择信息top tip
    refreshTopTip: function(){
        var self = this;
        var _sdata = self.opt.selectData;
        var _data = self.opt.data;
        for(var i=0,len=_data.groups.length;i<len;i++){
            var _tipDom = $("[data-grps-id="+_data.groups[i].dish_group_id+"]").find(".top-tip");
            if(_sdata[_data.groups[i].dish_group_id]){
                var _totalC = _sdata[_data.groups[i].dish_group_id].total.count;
                if(_totalC && _data.groups[i].min_num<=_totalC && _totalC<=_data.groups[i].max_num){
                    _tipDom.addClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else if(_totalC && _sdata[_data.groups[i].dish_group_id].total.count>=0){
                    _tipDom.removeClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else{
                    _tipDom.hide();
                }
            }
        }
    },
    refreshBottom: function(){
        var self = this;
        var $el = self.opt.$el;
        var $price = $el.find("[data-node=bottomprice]");
        var $select = $el.find("[data-node=selectouter]");
        var $submitBtn = $el.find("[data-node=submitBtn]");
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        /*var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品*/
        var checkArr = [];//也可以用与元算来处理
        var _price = 0;
        //对groups进行check，看是否符合下单规则
        for(var i=0,len=_data.length;i<len;i++){
            if(parseInt(_data[i].min_num)){
                if(_sdata[_data[i].dish_group_id] && _sdata[_data[i].dish_group_id].total.count>=_data[i].min_num){
                    checkArr.push(1);
                }else{
                    checkArr.push(0);
                }
            }
            if(Math.min.apply(null,checkArr)===1){
                //通过检查
                $select.removeClass("disable");
                $submitBtn.removeClass("disable");
            }else{
                $select.addClass("disable");
                $submitBtn.addClass("disable");
            }
        }
        //处理非固定价格套餐
        if(parseInt($price.data("type"))!==1){
            for(var item in _sdata){
                //_sdata第一层为套餐组id
                var tmpItem = _sdata[item];
                if(!tmpItem.total.count){continue;}
                //_sdata第二层为单菜品，计算价格主要在此
                for(var ditem in tmpItem){
                    if(ditem==="total" || !tmpItem[ditem].count){continue;}
                    _price+= (parseFloat(tmpItem[ditem].realPrice || tmpItem[ditem].price))*(parseInt(tmpItem[ditem].count));
                }
            }
            $price.html("￥"+(_price).toFixed(2));
            self.opt.selectBasic.price = _price;
        } else {
            self.opt.selectBasic.price = self.opt.data.basics.itemPrice;
        }
    },
    //菜品增加，减少按钮的逻辑控制
    refreshSelectArea: function(cur,selectData,itemInfo){
        var _par = cur.parent();
        if(selectData[itemInfo.id].count>0){
            _par.find("[data-node=minusIcon]").removeClass("v-hide");
            _par.find(countItemCls).text(selectData[itemInfo.id].count).removeClass("v-hide");
        }else{
            cur.parent().find(countItemCls).text(selectData[itemInfo.id].count).addClass("v-hide");
            _par.find("[data-node=minusIcon]").addClass("v-hide");
        }
    },
    addIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _max = parseInt(data.max_num);
        var curGrpsId = data.dish_group_id;

        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData.total.count<_max){
            if(self.selectAttr(curDom)){
                selectData.total.count++;
            }
        }else if(selectData.total.count<_max){
            selectData.total.count++;
            selectData[itemInfo.id].count++;
        }else{
            return;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("addDish");
    },
    //判断选择数据是否存在，不存在则初始化
    getItemSelectData:function(itemInfo,selectData){
        selectData = selectData || {count:0,dname:itemInfo.name,price:itemInfo.price};
        return selectData;
    },
    //针对需要存到cookie中的值在此获取
    getItemInfo:function(curDom){
        var parItem = curDom.parents(dishItemClass);
        var _id = "";
        /*if(parItem.hasClass(mulItemClass)){
            _id = parItem.find("[data-maink=1] .s-item.sec").data("id");
        }else{*/
        _id = parItem.data("id")+"";
        var _name = parItem.data("name");
        var _price = parItem.data("price");
        //}
        return {id:_id,name:_name,price:_price,count:0};
    },
    minusIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _min = parseInt(data.min_num);
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData[itemInfo.id].count>=1){
            if(self.selectAttr(curDom)){
                selectData.total.count--;
            }
        }else if(selectData[itemInfo.id].count<=0){
            selectData[itemInfo.id].count=0;
            return;
        }else{
            selectData.total.count--;
            selectData[itemInfo.id].count--;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("minusDish");
    },
    //底部区域按钮点击
    handleBottomeClick : function(cur){
        var self = this;
        var data = self.opt.data.basics;
        var nodeType = cur.data("node");
        var $sCount = self.opt.$el.find("[data-node=selectCount]");
        var curCount = parseInt($sCount.html()) || 0;
        //if(!$.isNumeric(curCount)){curCount = data.minOrderNumber;}
        if(nodeType==="addtocart"){
            if(curCount && curCount<data.itemStock){
                $sCount.html(++curCount);
            }else if(!curCount){
                $sCount.html(data.minOrderNumber);
            }
        }else if(nodeType==="minusfrcart"){
            if(curCount<=data.minOrderNumber){
                $sCount.html(0);
            }else{
                $sCount.html(--curCount);
            }
        }
        self.opt.data.basics.itemCount = curCount;
        if(nodeType==="submitBtn"){
            !cur.hasClass("disable") && self.submitSetMeal();
        }
    },
    //调整数据结构来适应购物车结构
    //bdata结构
    //basic：包含选中菜品基本信息，与单菜品相同的属性key
    //data：选择的套餐信息
    adjustDataStructure: function(bdata){
        var _tmpId = "";
        //id赋值给变量记住
        bdata.orignItemId = bdata.itemId;
        bdata.grpsInfo.basic.id = bdata.itemId;
        //真实价格
        bdata.itemPrice = bdata.grpsInfo.basic.price;
        //采用append方式
        bdata.type = "append";
        //文件顶部有selectData的机构，下面要做的是把这个结构转换成一个字符串
        //字符串中包含所有的id，组id，菜id，属性id；并且id按顺序拼接
        //id之后由 _p 接个数
        var grpsIds = [];
        var dishIds = [];
        var featureIds = [];
        for(var i in bdata.grpsInfo.data){
            var tmpData = bdata.grpsInfo.data[i];
            grpsIds.push(i+"_p"+tmpData.total.count);
            for(var ix in tmpData){
                if(ix==="total")continue;
                dishIds.push(ix+"_p"+tmpData[ix].count);
                if(tmpData[ix].features && tmpData[ix].features.length){
                    featureIds.concat(tmpData[ix].features);
                }
            }
        }
        bdata.itemId = grpsIds.sort().join("__")+"___"+dishIds.sort().join("__")+"___"+featureIds.sort().join("__");
    },
    //套餐数据存到cookie中
    saveGrpsData: function(data){
        if (data.grpsInfo) {
            localStore.set('s' + data.itemId + 's',data.grpsInfo);
            /*cookie.set('s' + data.itemId + 's', JSON.stringify(data.grpsInfo), {
                path: '/'
            });*/
        };
    },
    submitSetMeal:function(){
        var self = this;
        //console.log(self.opt);
        var _res = {};
        _res = $.extend(_res,self.opt.data.basics);
        _res.grpsInfo = {basic:self.opt.selectBasic,data:self.opt.selectData};
        self.adjustDataStructure(_res);
        self.saveGrpsData(_res);
        self.opt.onSubmitBtn(_res);
    }
});

module.exports = setMeal;
 
});
;define('bigba:widget/common/ui/shopcard/shopcard.js', function(require, exports, module){ /**
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
;define('bigba:widget/common/ui/topbar/topbar.js', function(require, exports, module){ module.exports = {
    /**
     * widget js 入口函数
     */
    init : function() {
        
    }
}
 
});
;define('bigba:widget/common/userinfo/UserMgr.js', function(require, exports, module){ /**
 * UserMgr 管理用户登录 退出 等状态
 * @author jican
 * @author fms
 * @author jason、xinjing
 * @date 2011/11/28
 * @date 2013.3.28
 * @date 2013.7.5
 */

(function(win) {

    // PASSPORT常量 私有
    var PASSPORT_URL_HOST = 'https://passport.baidu.com',
        PASSPORT_VERSION = 'v2/',
        PASSPORT_TPL = '&tpl=ma',
        PASSPORT_ACTION_LOGIN = '?login',
        PASSPORT_ACTION_LOGOUT = '?logout';
    T_ORDER_LIST = [
        '<ul class="order-list">',
        '<li><a target="_blank" class="order-list-cater" href="/detail?qt=orderlist&type=cater&detail=order_list">餐饮订单</a></li>',
        // '<li><a target="_blank" class="order-list-hotel" stat="click|{da_src:hotel.hotelorder}" href="/detail?qt=orderlogin&type=hotel&detail=hotel_order_login">酒店订单</a></li>',
        '<li><a target="_blank" class="order-list-movie" href="/detail?qt=orderlist&type=movie">电影订单</a></li>',
        //'<li><a target="_blank" class="order-list-movie" href="/waimai?qt=orderlist&type=suc">外卖订单</a></li>',
        '</ul>'
    ].join("");


    var PASS_UI_API = PASSPORT_URL_HOST + '/passApi/js/uni_login_wrapper.js?cdnversion='; //通用登录浮窗 api by fms

    //登录跳转页本地测试地址
    var V3_JUMP_PAGE = 'http://' + win.location.host + '/static/common/widget/userinfo/v3Jump.html';

    //用户登录状态    
    var USER_STATE_API = '/waimai/checklogin'
        //'http://mc.map.baidu.com/passport/Session3.php', // 用户登录状态获取
        USER_CENTER_HREF = 'http://passport.baidu.com/center', //PASSPORT_URL_HOST+'?center&tpl=ma&aid=7&default_tab=4', // 用户账号设置
        USER_STATE_LOGIN = '1',
        USER_STATE_LOGOUT = '0';

    // 获取用户登录状态中间回调
    var _getStateCBK = null;
    // 存储其它相关参数、用于登录改造
    var param = {};
    var loginPop = null;
    /*var partnerLinks = ['qzone', 'tqq', 'tsina', 'renren']; */// 关联账户
    var partnerLinks = []; 
    var isInit = false; //是否已初始化
    /**
     * 加载V3登录浮窗(适配tangram 2.X版本)
     * @param {Object} opts
     * @opts.onSuccess 成功回调函数
     * @opts.url       成功跳转地址
     */
    function showV3Pass(opts) {
        var url = PASS_UI_API + new Date().getTime(),
            opts = opts || {},
            jumpurl = opts.url || win.location.href;
            sucCallBack = opts.sucessCB || function(){};

        if (loginPop) {
            loginPop.show();
            var plt = $('#place-login-tips');
            if (plt.length) {
                if (UserMgr.getParam('tip')) {
                    plt.show();
                } else {
                    plt.hide();
                }
            }
        } else {
            var newWindow, // 新打开页面 by jason
                loadLogin = function() {
                    var config = {
                        tangram: true, // 标识是否加载tangram2.0。页面使用的基础库不是tangram2.0时应设为true        
                        id: 'login',
                        cache: true,
                        apiOpt: {
                            product: 'ma', //产品线标志，原tpl
                            staticPage: V3_JUMP_PAGE, //jump地址，注意大小写
                            u: jumpurl, //登录成功跳转地址
                            sms: 2
                        },
                        authsite: partnerLinks,
                        authsiteCfg: {
                            act: 'implicit',
                            u: jumpurl
                        },
                        onSubmitStart: function() {
                            if (UserMgr.getParam('purl')) {
                                newWindow = win.open('about:blank');
                            }
                        },
                        onLoginSuccess: function(e) {
                            var loginEvent = $.Event("onLoginSuccess");
                            sucCallBack();
                            // 触发事件使得用户可以自定义后续行为
                            $(UserMgr).trigger(loginEvent);
                            if (!loginEvent.isDefaultPrevented()) {
                                newWindow && (newWindow.location.href = UserMgr.getParam('purl'));
                            } else {
                                e.returnValue = false;
                            }
                        },
                        onSubmitedErr: function(err) {
                            newWindow && newWindow.close();
                        }
                    };
                    var passport = window.passport || null;
                    if (!passport || !passport.pop) {
                        return;
                    }
                    loginPop = passport.pop.init(config);
                    loginPop.show();
                    (function() {
                        var plp = $('#passport-login-pop'),
                            args = arguments,
                            purl = UserMgr.getParam('purl'),
                            tip = UserMgr.getParam('tip');
                        if (plp.length && tip) {
                            setTimeout(function() {
                                $('<div id="place-login-tips" class="place-login-tips">' + tip + '</div>').appendTo(plp);
                            }, 100);
                        } else {
                            setTimeout(function() {
                                args.callee();
                            }, 10);
                        }
                    })();
                };
            baidu.phoenix.require(partnerLinks, {
                target: 'otherLogin',
                tpl: 'map',
                act: "implicit",
                u: location.href
            });

            $.ajax({
                url: url, //请求地址
                type: "get", //请求方式
                dataType: "script", //请求数据类型
                crossDomain: true, //是否跨域
                data: null,
                async: true, //是否异步请求，默认为异步
                error: function(__data) {},
                success: function(__data) {
                    loadLogin();
                }

            });
        }
    }

    /**
     * 获取登录成功后展现的HTML
     * @param {Object} userState 用户登录状态数据
     */
    function getLoginHtml(userState) {
        if (!userState) {
            return '';
        }
        var text = '',
            name = userState.uName || userState.displayname,
            email = userState.email,
            mobile = userState.mobile;

        if (name) {
            text = name;
        } else if (email || mobile) {
            text = email || mobile;
        }

        var htmls = ['<ul class="login_info"><li id="usernameInfo" class="uname mn-lk-w">'];
        if (name) {
            htmls.push('<a id="username" class="mn-lk" href="/waimai/trade/orderlist">你好，' + text + '</a>');
        } else {
            htmls.push('<a id="username" class="mn-lk" href="https:/passport.baidu.com/v2/?ucenteradduname">' + text + '</a>');
        }
        htmls.push('<div id="popUserInfoId" class="mn-tip"><div class="top-arrow"></div><ul class="mn">');
        /*if (name) {
            htmls.push('<a class="my-info" target="_blank" href="http://www.baidu.com/p/' + name + '?from=map">我的主页</a>');
        } else {
            htmls.push('<a class="my-info" target="_blank" href="https:/passport.baidu.com/v2/?ucenteradduname">我的主页</a>');
        }*/
        htmls.push('<li><a class="my-info" href="/waimai?qt=orderlist&type=wait"><span class="icon order-icon"></span>我的订单</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=addressmanage&type=select"><span class="icon address-icon"></span>送餐地址</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=myfavorite"><span class="icon favorite-icon"></span>收藏夹</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=couponinfo"><span class="icon coupon-icon"></span>代金券</a></li>');
        htmls.push('<li><a class="my-info" href="/trade/refundlist"><span class="icon refund-icon"></span>我的退款</a></li>');
        htmls.push('<li><a id="logout" class="logout" href="javascript:void(0)"><span class="icon account-icon"></span>退出</a></li>');
        htmls.push('</ul></div>');
        return htmls.join('');
    }
    /**
     * 获取连接到passport各种URL
     * @param {String} action 操作类型
     * @param {Object} opts 可选参数
     */
    function getPortUrl(action, opts) {
        var temp = '',
            param = opts ? ('&' + encodeURIComponent(opts)) : '';
        switch (action) {
            case 'login':
                //登录
                temp = PASSPORT_VERSION + PASSPORT_ACTION_LOGIN;
                break;
            case 'logout':
                //退出
                temp = PASSPORT_ACTION_LOGOUT;
                break;
            default:
                break;
        }
        return PASSPORT_URL_HOST + temp + PASSPORT_TPL + encodeURIComponent(param);
    }


    // 用户管理对象
    var UserMgr = {

        /**
         * 用户登录状态 初始化
         */
        init: function() {
            var bookTimer;

            if (isInit) return;

            this.update({
                onsuccess: function() {}
            });

            // 订单
            $("#user_info").delegate(".book-order", "mouseenter.order", function() {
                var content = $(this).find(".order-list"),
                    online;

                online = UserMgr.userState && UserMgr.userState.isOnline || "0";

                bookTimer && clearTimeout(bookTimer);

                if (content.length == 0) {
                    content = $(this).append($(T_ORDER_LIST));
                }

                content.show();
                content.find(".order-list-hotel").attr("stat", "click|{da_src:inf.order_hotel, user: " + online + "}");
            }).delegate(".book-order", "mouseleave.order", function() {
                var content = $(this).find(".order-list");

                if (content.length > 0) {
                    bookTimer = setTimeout(function() {
                        content.hide();
                    }, 50);
                }
            });

            isInit = true;
        },
        /**
         * 设置查询订单的单条内容
         */
        setSearchOrder: function(html) {
            $(this).on("setlogin", function() {
                $("#user_info .book-order").html(html);
            });
            $("#user_info .book-order").html(html);
            setTimeout(function() {
                $("#user_info").undelegate(".book-order", "mouseenter.order").undelegate(".book-order", "mouseleave.order");
            }, 100);
        },
        /**
         * 更新用户登录状态 对外公开 其他模块可直接调用
         */
        update: function(opts) {
            opts = opts || {};
            this.getState(function(userState) {
                if (!userState) {
                    return;
                }
                UserMgr.userState = userState;
                var me = this,
                    callback = opts.onsuccess,
                    scope = opts.scope;
                switch (userState.isOnline) {
                    case USER_STATE_LOGIN:
                        me.isLogin(userState);
                        break;
                    case USER_STATE_LOGOUT:
                        me.isLogout(userState);
                        break;
                }
                //回调函数
                if (opts && callback && scope) {
                    callback.call(scope, userState);
                }
            });
        },
        /**
         * 获取当前用户登录状态 对外公开 其他模块可直接调用
         * @param {Function} cbk 回调函数 必选
         */
        getState: function(cbk) {
            $.ajax({
                url: USER_STATE_API, //请求地址
                type: "get", //请求方式
                dataType: "jsonp", //请求数据类型
                crossDomain: true, //是否跨域
                data: null,
                async: true, //是否异步请求，默认为异步
                error: function() {},
                success: function(__data) {
                    UserMgr._getState(__data)
                }

            });
            this._getStateCBK = cbk;
        },

        /**
         * 获取用户登录状态 内部callback调用
         * @param {Object} state 用户登录状态数据
         */
        _getState: function(userState) {
            if (userState) {
                this._getStateCBK && this._getStateCBK(userState)
            }
        },

        // 绑定相关事件
        bindEvents: function() {
            var me = this;
            var mouseout = function() {
                me.tipTimer = setTimeout(function() {
                    $('#popUserInfoId').css('visibility', 'hidden');
                }, 200);
            };

            $('#username').on('mouseover', function(e) {
                $('#popUserInfoId').css({"display":"none","visibility":"visible"}).fadeIn();
            });
            $('#popUserInfoId').on('mouseover', function(e) {
                win.clearTimeout(me.tipTimer);
            });
            $('#username').on('mouseout', mouseout);
            $('#popUserInfoId').on('mouseout', mouseout);
            $('#logout').on('click', function(e) {
                UserMgr.logout();
                return false;
            });
        },

        //添加用户登录部分
        addLoginEvt: function() {
            var me = this;
            $("#login").off("click").on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                // 删除key
                me.removeAll();
                //显示登录浮窗                             
                me.login();
            });
        },

        /**
         * 登录 对外公开 其他模块可直接调用
         * @modifydate
         * @param {Object} opts 可选参数
         * @opts.onSuccess 成功回调函数 暂时不用
         * @opts.url       成功跳转地址
         * @opts.isOnline  如果为true则强制显示登录窗口
         *
         */
        login: function(opts) {
            opts = opts || {};

            /*  by jason.zhou  和龚伟沟通后 注释掉
            if (!opts.isOnline) {
                showV3Pass(opts);
                return;
            }
            */
            if (UserMgr.userState && UserMgr.userState.isOnline == '0') {
                showV3Pass(opts);
            } else {
                opts.url && (location.href = opts.url);
            }
        },

        /**
         * 退出登录 对外公开 其他模块可直接调用
         */
        logout: function() {
            win.location.href = getPortUrl('logout', {
                u: win.location.href
            });
        },

        /**
         * 设置登录成功后的状态
         * @param {Object} userState 用户登录状态数据
         */
        isLogin: function(userState) {
            var me = this,
                logout_info = $('#logout_user_info'),
                login_info = $('#login_user_info');
            if (logout_info) {
                logout_info.hide();
            }
            if (login_info) {
                login_info.show();
                login_info.html(getLoginHtml(userState));
            }
            $(me).trigger("setlogin");
            //绑定事件
            this.bindEvents();
        },

        /**
         * 设置未登录时的状态
         * @param {Object} userState 用户登录状态数据
         */
        isLogout: function(userState) {
            var me = this,
                logout_info = $('#logout_user_info'),
                login_info = $('#login_user_info');
            if (logout_info) {
                logout_info.show();
            }
            if (login_info) {
                login_info.hide();
            }
            //添加用户登录事件
            this.addLoginEvt();
        },

        /**
         * 不同的登录方式
         */
        clickPage: function(type, pageID) {
            if (type == "normal") { //普通登录
                $("#loginIframe_iph" + pageID).hide();
                $("#passports" + pageID).show();
                $("#normal_login" + pageID).addClass("login_hover");
                $("#phone_login" + pageID).removeClass("login_hover");
            } else if (type == "iph") { //手机登录
                $("#loginIframe_iph" + pageID).show();
                $("#passports" + pageID).hide();
                $("#phone_login" + pageID).addClass("login_hover");
                $("#normal_login" + pageID).removeClass("login_hover");
            }
        },
        /**
         * 设置参数
         */
        setParam: function(key, value) {
            param[key] = value;
        },
        /**
         * 得到对应key的值
         */
        getParam: function(key) {
            return param[key];
        },
        /**
         * 删除参数指定key
         */
        removeParam: function(keys) {
            for (var i = 0, key; key = keys[i]; i++) {
                delete param[key];
            }
        },
        /**
         * 删除所有key
         */
        removeAll: function() {
            param = {};
        }
    };

    module.exports = UserMgr;
})(window);
 
});
;define('bigba:widget/common/verifyphone/verifyphone.js', function(require, exports, module){ /**
 * 订单提交回调
 * @author jason.zhou
 * @date 2014.02.12
 */
var Template = require("bigba:static/utils/Template.js"),
    Pagination = require("jsmod/ui/pagination"),
    util = require("bigba:static/util.js"),
    Dialog = require("jsmod/ui/dialog"),
    cacheDialog, // 缓存的dialog
    cacheTipDialog,
    from;//来源 coupon or first_order

/**
 * 生成弹窗html 提示
 * @param {Object} json
 */
function generateTipHtml(json) {
    var status = DataHelper(json).prop('result.first_order_status'),
        html = '',
        //desc = '该手机号已享受过首单优惠';
        desc = "";
    // if (status == 2) {
    //     desc = '';
    // }
    html = Template('wm_succbind_tpl', {
        desc: desc,
        url: window.location.href
    });
    return html;
}
/**
 * 验证成功回调
 * @param  {Object} json 请求结果数据
 * @return {[type]}      [description]
 */
function vcallback(json) {
    var html = generateTipHtml(json);
    Dialog.disableKeyEvent();
    cacheTipDialog = new Dialog({
        html: html
    });
    cacheTipDialog.show({
        fade: true
    });
    setTimeout(function() {
        window.location.href = window.location.href;
    }, 2000)
}
/**
 * 事件绑定
 * @return {[type]} [description]
 *
 * todo：手机号码、验证码  验证
 */
function bindEvent() {
    var $el = $('#common_verifyphone'),
        $phone = $el.find('.verify-phone'),
        $vCode = $el.find('.verify-code'),
        $vBtn = $el.find('.verify-btn'),
        $errorMsg = $el.find('.error-msg'),
        errorCls = 'verify-input-error';
    // 
    function errorMsg(msg) {
        $errorMsg.html(msg);
        setTimeout(function(){
            $errorMsg.html("");
        },3000);
    }
    // 手机号验证
    function vphone() {
        var phoneValue = $phone.val(),
            re = new RegExp('^\\d{11}$');
        if (!phoneValue || !re.test(phoneValue)) {
            $phone.next(".error-input").removeClass("v-hide");
            return false;
        }
        return phoneValue;
    }
    $el.find('.verify-btn').on('click', function() {
        var phoneValue = vphone();
        if ($vBtn.hasClass('btn-disable')) {
            return;
        }
        if (phoneValue === false) {
            return;
        }
        $.ajax({
            url: '/waimai?qt=sendphonecode',
            data: {
                mobile: phoneValue
            },
            dataType: "json",
            success: function(res) {
                var count = 60;
                if (res.error_no != 0) {
                    errorMsg(res.error_msg);
                    return;
                }
                (function() {
                    if (count <= 0) { // 如果超出60秒则停止轮训
                        $vBtn.removeClass('btn-disable').html('发送动态码');
                    } else {
                        $vBtn.addClass('btn-disable').html('重新发送' + count--);
                        setTimeout(arguments.callee, 1000);
                    }
                })();
            }
        });
    });
    $el.find('.commit-btn').on('click', function() {
        var vCode = $vCode.val(),
            phoneValue = vphone();
        if (phoneValue === false) {
            return;
        }
        if (!vCode) {
            $vCode.parent().find(".error-input").removeClass("v-hide");
            return;
        }
        $.ajax({
            url: '/waimai?qt=verifyphonecode',
            data: {
                mobile: phoneValue,
                code: vCode,
                from: from
            },
            dataType: "json",
            success: function(res) {
                if (res.error_no != 0) {
                    errorMsg(res.error_msg);
                    return;
                }
                vcallback(res);
            }
        });
    });
    $phone.focus(function() {
        $(this).next(".error-input").addClass("v-hide");
    });
    $vCode.focus(function() {
        $(this).parent().find(".error-input").addClass("v-hide");
    });
}
/**
 * 生成弹窗html 绑定手机
 * @param {Object} json
 */
function generateBindPhoneHtml(json) {
    var _text = json && json.cancel_text ? json.cancel_text : "取消";
    var html = Template('wm_bindphone_tpl', {cancel_text:_text});
    return html;
}
/**
 * 生成弹窗html 绑定手机
 * @param {Object} json
 */
function generateBindPhoneWidget(json) {
    if(!passport || !passport.pop)return;
    var token = $("#bindstoken").val();
    var widget = passport.pop.ArmorWidget("bindmobile", {
        token: token,
        title: "绑定手机",
        msg: "",
        auth_title: "绑定手机",
        auth_msg: "为了保证您的帐号安全，绑定手机前请先进行安全验证",
        onSubmitSuccess: function(self, data) {
            window.location.reload();
            void(self);
            void(data);
        },
        onSubmitFail: function() {
        },
        onHide: function(self){

        }
        
    });
    widget.show();
}
/**
* 设置来源
*/
function setFrom(json){
    if(json && json.from){
        from = json.from;
    }
}
module.exports = {
    /**
     *
     * 手机绑定浮层
     */
    bindPhone: function(json) {
        var defaultCancelCb = function(dialog){
            dialog.hide({
                fade: true
            });
        }
        var html = generateBindPhoneHtml(json);
        var cancelCb = (json && json.cancelCb) ? json.cancelCb : defaultCancelCb;
        var cacheDialog = new Dialog({
            html: html
        });
        cacheDialog.getElement().delegate("#common_verifyphone .cancel-btn", "click", function(argument) {
            cancelCb(cacheDialog);
        });
        cacheDialog.show({
            fade: true
        });
        setTimeout(function(){
            $(".placeholder-con").placeholder();
        },0);
        //设置来源
        setFrom(json);
        // 事件绑定
        bindEvent();
    },
    bindPhoneWidget:function(json){
        generateBindPhoneWidget(json);
    }
}; 
});
;var GlobalErrorMonitor = require('bigba:static/utils/GlobalErrorMonitor.js');
var Dialog = require("jsmod/ui/dialog");
$('#content').css('min-height', $(window).height() - 290);
window.onerror1 = function() {
	GlobalErrorMonitor.error.apply(GlobalErrorMonitor, arguments);
	return true;
}
window.onresize = function() {
    $('#content').css('min-height', $(window).height() - 290);
}
$(function(){
    Dialog && Dialog.setOpacity(0.55);
    $(".placeholder-con").placeholder();
});