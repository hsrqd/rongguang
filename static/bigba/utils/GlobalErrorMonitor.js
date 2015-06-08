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