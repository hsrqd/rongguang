define('bigba:widget/common/ui/cartAlert/cartAlert.js', function(require, exports, module){ /**
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