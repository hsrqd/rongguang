<div id="user_info" class="user-info-widget">
    

<div id="login_user_info" style="display:none;"></div>
<div id="logout_user_info">
    <ul class="logout_info">
        <li>
            <a id="login" href="javascript:void(0);" >&nbsp;登录</a>
        </li>
        <li>
            <a href="https://passport.baidu.com/v2/?reg&amp;regType=1&amp;tpl=ma" target="_blank">注册</a>
        </li>
    </ul>
</div>
</div>
<script type="text/javascript" src="http://passport.baidu.com/phoenix/account/jsapi"></script>
{%script%}
// domready 后加载
$(function(){
     require.async('bigba:widget/common/userinfo/UserMgr.js', function(user) {
        user.init();
    });
});
{%/script%}
