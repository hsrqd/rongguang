<div class="banner-con">
<div class="big_bg">
{%widget name="bigba:widget/common/nav/nav.tpl" className='topbar'%}
<div class="login-box">
<div class="login-title">60秒快速订车</div>
<table class="login-form">
<tr><td>出发地：</td><td><input placeholder="出发地点"></td></tr>
<tr><td>目的地：</td><td><input placeholder="目的地点"></td></tr>
<tr>
<td colspan="2" align="center">
<button class="submit-btn">下一步</button>
</td>
</tr>
</table>
</div>
</div>
</div>
{%script%}
    var nav = require("bigba:widget/index/topbar/topbar.js").init();
{%/script%}
