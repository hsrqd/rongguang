<textarea id="wm_bindphone_tpl" class="hide">
    <section id="common_verifyphone" class="common-verifyphone">
        <div class="verify-title">
            <p>绑定手机号才可享受立减、代金券等优惠哦！</p>
        </div>
        <div class="verify-body">
            <div class="error-msg"></div>
            <p class="form-row">
                <input class="verify-phone placeholder-con" type="text" placeholder="请输入手机号">
                <span class="error-input v-hide">请填写正确的手机号</span>
            </p>
            <p class="form-row">
                <input class="verify-code placeholder-con" type="text" placeholder="请输入动态码">
                <button class="verify-btn">发送动态码</button>
                <span class="error-input v-hide">请填写正确的动态码</span>
            </p>
        </div>
        <div class="verify-submit">
            <button class="commit-btn action-btn">确认</button>
            <input type="button" class="cancel-btn action-btn versa" value="<&=cancel_text&>">
        </div>
    </section>
</textarea>
<textarea id="wm_succbind_tpl" class="hide">
    <section id="bindphone_cb" class="bindphone-cb">
        <h3>恭喜您已成功绑定手机号</h3>
        <&if (desc) {&>
	        <p class="oc-desc"><&=desc&></p>
        <&}&>
        <a class="oc-btn" href="<&=url&>">确定</a>
        <figure class="oc-icon oc-icon-succ"></figure>
    </section>
</textarea>
{%script%}
    require('bigba:widget/common/verifyphone/verifyphone.js');
{%/script%}
