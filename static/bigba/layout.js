define('bigba:page/layout.js', function(require, exports, module){ var GlobalErrorMonitor = require('bigba:static/utils/GlobalErrorMonitor.js');
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
});