define("bigba:widget/common/verifyphone/verifyphone.js",function(n,e,o){function t(n){var e=(DataHelper(n).prop("result.first_order_status"),""),o="";return e=l("wm_succbind_tpl",{desc:o,url:window.location.href})}function i(n){var e=t(n);f.disableKeyEvent(),d=new f({html:e}),d.show({fade:!0}),setTimeout(function(){window.location.href=window.location.href},2e3)}function r(){function n(n){c.html(n),setTimeout(function(){c.html("")},3e3)}function e(){var n=t.val(),e=new RegExp("^\\d{11}$");return n&&e.test(n)?n:(t.next(".error-input").removeClass("v-hide"),!1)}var o=$("#common_verifyphone"),t=o.find(".verify-phone"),r=o.find(".verify-code"),a=o.find(".verify-btn"),c=o.find(".error-msg");o.find(".verify-btn").on("click",function(){var o=e();a.hasClass("btn-disable")||o!==!1&&$.ajax({url:"/waimai?qt=sendphonecode",data:{mobile:o},dataType:"json",success:function(e){var o=60;return 0!=e.error_no?void n(e.error_msg):void function(){0>=o?a.removeClass("btn-disable").html("发送动态码"):(a.addClass("btn-disable").html("重新发送"+o--),setTimeout(arguments.callee,1e3))}()}})}),o.find(".commit-btn").on("click",function(){var o=r.val(),t=e();if(t!==!1)return o?void $.ajax({url:"/waimai?qt=verifyphonecode",data:{mobile:t,code:o,from:u},dataType:"json",success:function(e){return 0!=e.error_no?void n(e.error_msg):void i(e)}}):void r.parent().find(".error-input").removeClass("v-hide")}),t.focus(function(){$(this).next(".error-input").addClass("v-hide")}),r.focus(function(){$(this).parent().find(".error-input").addClass("v-hide")})}function a(n){var e=n&&n.cancel_text?n.cancel_text:"取消",o=l("wm_bindphone_tpl",{cancel_text:e});return o}function c(){if(passport&&passport.pop){var n=$("#bindstoken").val(),e=passport.pop.ArmorWidget("bindmobile",{token:n,title:"绑定手机",msg:"",auth_title:"绑定手机",auth_msg:"为了保证您的帐号安全，绑定手机前请先进行安全验证",onSubmitSuccess:function(n,e){window.location.reload()},onSubmitFail:function(){},onHide:function(){}});e.show()}}function s(n){n&&n.from&&(u=n.from)}var d,u,l=n("bigba:static/utils/Template.js"),f=(n("jsmod/ui/pagination"),n("bigba:static/util.js"),n("jsmod/ui/dialog"));o.exports={bindPhone:function(n){var e=function(n){n.hide({fade:!0})},o=a(n),t=n&&n.cancelCb?n.cancelCb:e,i=new f({html:o});i.getElement().delegate("#common_verifyphone .cancel-btn","click",function(){t(i)}),i.show({fade:!0}),setTimeout(function(){$(".placeholder-con").placeholder()},0),s(n),r()},bindPhoneWidget:function(n){c(n)}}});