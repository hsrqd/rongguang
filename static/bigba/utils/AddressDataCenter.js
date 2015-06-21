define('bigba:static/utils/AddressDataCenter.js', function(require, exports, module){ /**
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