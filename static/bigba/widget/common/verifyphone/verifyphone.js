define('bigba:widget/common/verifyphone/verifyphone.js', function(require, exports, module){ /**
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