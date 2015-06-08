define('bigba:widget/contact/feedback/feedback.js', function(require, exports, module){ var GlobalTips = require('bigba:static/utils/GlobalTips.js');
var Feedback = require("bigba:widget/common/ui/feedback/feedback.js");
// var $el = $(".mod-dialog-wrap .contact-feedback");
function saveCb(el) {
    el.find(".input").val("");
    setTimeout(function() {
        GlobalTips.tip("感谢您对百度外卖的支持，我们会继续努力！");
    }, 20);
}
module.exports = {
    init: function(obj) {
        new Feedback({
            $el: obj,
            saveSuccess: saveCb
        });
        $(".placeholder-con").placeholder();
    }
} 
});