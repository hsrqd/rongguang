define('bigba:widget/contact/list/list.js', function(require, exports, module){ var Dialog = require("jsmod/ui/dialog");
var WeChatTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="contact-dialog wm-wechat">    <a class=\'closeBtn\'>×</a>    <h3>百度外卖官方微信二维码</h3>    <img src="',typeof('/static/images/wm_wechat.jpg') === 'undefined'?'':baidu.template._encodeHTML('/static/images/wm_wechat.jpg'),'" width="370" height="370"></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

var feedbackTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<section class="contact-feedback" id="contact-feedback"></section>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var Feedb = require("bigba:widget/contact/feedback/feedback.js");

var LISTENER=window.listener;


var $el = $(".contact-list");
var cacheDialog1;
var cacheDialog2;
var timer = null;

function closeDialog() {
    clearTimeout(timer);
    cacheDialog.hide({
        fade: true
    });
}

function showWeChat() {
    var _html = WeChatTmpl();
    cacheDialog1 = new Dialog({
        html: _html,
        width: 370,
        height: 450
    });
    cacheDialog1.show({
        fade: true
    });
}

function showfeedback() {
    var _html = feedbackTmpl();
    var contentD;

    cacheDialog2 = new Dialog({
        html: _html,
        width: 500,
        height: 420
    });
    cacheDialog2.show({
        fade: true
    });

    contentD = cacheDialog2.getElement();

    var contactFeedback = contentD.find('.contact-feedback');
    setTimeout(function() {
        Feedb.init(contactFeedback);
    }, 0);


}

function initEvent() {
    $el.on("click", ".wechat", function() {
        showWeChat();
    });
    $(".mod-dialog-frame").on("click", ".closeBtn", function() {
        closeDialog();
    });
    $(".mod-dialog-frame").on("click", function() {
        closeDialog();
    });
    $(".mod-dialog-frame").on("click", ".mod-dialog-wrap", function(e) {
        e.stopPropagation();
    });
    $el.on("click", ".advice", function() {
        showfeedback();
    });

    LISTENER.on("waimai-contact-feedback","feedback",function(type,data){
        if(data.succ){
            cacheDialog2.hide({
                fade:true
            });
        }
    });

}

function initDialog() {
    cacheDialog = new Dialog();
}
module.exports = {
    init: function() {
        initDialog();
        initEvent();
    }
} 
});