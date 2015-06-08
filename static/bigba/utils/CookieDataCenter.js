define('bigba:static/utils/CookieDataCenter.js', function(require, exports, module){ /**
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