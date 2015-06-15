<div class="widget-selectcar-usecar">
<div class="tit-con">
提交订单</div>
<div class="divider"></div>
<div class="content-box">
<table class="con-table">
<tr>
<th width="230">联系人</th><td><input placeholder="请输入您的姓名" /><label class="subtips"><input name="saveasusual" type="checkbox" checked>保存为常用联系人</label></td>
</tr>
<tr>
<th>手机号</th><td><input placeholder="用来联系您的手机号码"  /></td>
</tr>
<tr>
<th>验证码</th><td><input placeholder="请输入手机获取的验证码"  /><button class="code-btn">获取验证码</button></td>
</tr>
<tr>
<th>服务留言</th><td><textarea placeholder="请输入您的姓名"></textarea></td>
</tr>
<tr>
<th></th>
<td>
<p><label class="subtips"><input name="agree" type="checkbox" checked>同意《荣光巴士服务条例》</label></p>
<button class="submit-btn">提交订单</button>
<span class="subtips">我们的客服会在10分钟之内与您联系，请耐心等待！</span>
</td>
</tr>
</table>
<div class="success-con">
<img src="/static/bigba/images/sucess.jpg">
<p>
<span class="btxt">恭喜您，已经成功提交订单啦！</span>
</p>
<p>
<span class="stxt">我们的客服会在10分钟内与您联系，请耐心等待！</span>
</p>
<div class="btn-con">
<button class="gores-btn">现在注册</button>
<p>
<a href="#">返回首页</a>
</p>
</div>
</div>
</div>
</div>
{%script%}
    require("bigba:widget/selectcar/submit/submit.js").init();
{%/script%}
