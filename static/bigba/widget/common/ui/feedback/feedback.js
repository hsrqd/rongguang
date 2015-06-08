define('bigba:widget/common/ui/feedback/feedback.js', function(require, exports, module){ var GlobalTips = require('bigba:static/utils/GlobalTips.js');
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