define("bigba:widget/common/userinfo/UserMgr.js",function(o,e,i){!function(o){function e(e){var i=c+(new Date).getTime(),e=e||{},n=e.url||o.location.href;if(sucCallBack=e.sucessCB||function(){},m){m.show();var t=$("#place-login-tips");t.length&&(v.getParam("tip")?t.show():t.hide())}else{var a,s=function(){var e={tangram:!0,id:"login",cache:!0,apiOpt:{product:"ma",staticPage:p,u:n,sms:2},authsite:g,authsiteCfg:{act:"implicit",u:n},onSubmitStart:function(){v.getParam("purl")&&(a=o.open("about:blank"))},onLoginSuccess:function(o){var e=$.Event("onLoginSuccess");sucCallBack(),$(v).trigger(e),e.isDefaultPrevented()?o.returnValue=!1:a&&(a.location.href=v.getParam("purl"))},onSubmitedErr:function(){a&&a.close()}},i=window.passport||null;i&&i.pop&&(m=i.pop.init(e),m.show(),function(){var o=$("#passport-login-pop"),e=arguments,i=(v.getParam("purl"),v.getParam("tip"));o.length&&i?setTimeout(function(){$('<div id="place-login-tips" class="place-login-tips">'+i+"</div>").appendTo(o)},100):setTimeout(function(){e.callee()},10)}())};baidu.phoenix.require(g,{target:"otherLogin",tpl:"map",act:"implicit",u:location.href}),$.ajax({url:i,type:"get",dataType:"script",crossDomain:!0,data:null,async:!0,error:function(){},success:function(){s()}})}}function n(o){if(!o)return"";var e="",i=o.uName||o.displayname,n=o.email,t=o.mobile;i?e=i:(n||t)&&(e=n||t);var a=['<ul class="login_info"><li id="usernameInfo" class="uname mn-lk-w">'];return a.push(i?'<a id="username" class="mn-lk" href="/waimai/trade/orderlist">你好，'+e+"</a>":'<a id="username" class="mn-lk" href="https:/passport.baidu.com/v2/?ucenteradduname">'+e+"</a>"),a.push('<div id="popUserInfoId" class="mn-tip"><div class="top-arrow"></div><ul class="mn">'),a.push('<li><a class="my-info" href="/waimai?qt=orderlist&type=wait"><span class="icon order-icon"></span>我的订单</a></li>'),a.push('<li><a class="my-info" href="/waimai?qt=addressmanage&type=select"><span class="icon address-icon"></span>送餐地址</a></li>'),a.push('<li><a class="my-info" href="/waimai?qt=myfavorite"><span class="icon favorite-icon"></span>收藏夹</a></li>'),a.push('<li><a class="my-info" href="/waimai?qt=couponinfo"><span class="icon coupon-icon"></span>代金券</a></li>'),a.push('<li><a class="my-info" href="/trade/refundlist"><span class="icon refund-icon"></span>我的退款</a></li>'),a.push('<li><a id="logout" class="logout" href="javascript:void(0)"><span class="icon account-icon"></span>退出</a></li>'),a.push("</ul></div>"),a.join("")}function t(o,e){var i="",n=e?"&"+encodeURIComponent(e):"";switch(o){case"login":i=s+l;break;case"logout":i=u}return a+i+r+encodeURIComponent(n)}var a="https://passport.baidu.com",s="v2/",r="&tpl=ma",l="?login",u="?logout";T_ORDER_LIST=['<ul class="order-list">','<li><a target="_blank" class="order-list-cater" href="/detail?qt=orderlist&type=cater&detail=order_list">餐饮订单</a></li>','<li><a target="_blank" class="order-list-movie" href="/detail?qt=orderlist&type=movie">电影订单</a></li>',"</ul>"].join("");var c=a+"/passApi/js/uni_login_wrapper.js?cdnversion=",p="http://"+o.location.host+"/static/common/widget/userinfo/v3Jump.html",d="/waimai/checklogin";USER_CENTER_HREF="http://passport.baidu.com/center",USER_STATE_LOGIN="1",USER_STATE_LOGOUT="0";var f={},m=null,g=[],h=!1,v={init:function(){var o;h||(this.update({onsuccess:function(){}}),$("#user_info").delegate(".book-order","mouseenter.order",function(){var e,i=$(this).find(".order-list");e=v.userState&&v.userState.isOnline||"0",o&&clearTimeout(o),0==i.length&&(i=$(this).append($(T_ORDER_LIST))),i.show(),i.find(".order-list-hotel").attr("stat","click|{da_src:inf.order_hotel, user: "+e+"}")}).delegate(".book-order","mouseleave.order",function(){var e=$(this).find(".order-list");e.length>0&&(o=setTimeout(function(){e.hide()},50))}),h=!0)},setSearchOrder:function(o){$(this).on("setlogin",function(){$("#user_info .book-order").html(o)}),$("#user_info .book-order").html(o),setTimeout(function(){$("#user_info").undelegate(".book-order","mouseenter.order").undelegate(".book-order","mouseleave.order")},100)},update:function(o){o=o||{},this.getState(function(e){if(e){v.userState=e;var i=this,n=o.onsuccess,t=o.scope;switch(e.isOnline){case USER_STATE_LOGIN:i.isLogin(e);break;case USER_STATE_LOGOUT:i.isLogout(e)}o&&n&&t&&n.call(t,e)}})},getState:function(o){$.ajax({url:d,type:"get",dataType:"jsonp",crossDomain:!0,data:null,async:!0,error:function(){},success:function(o){v._getState(o)}}),this._getStateCBK=o},_getState:function(o){o&&this._getStateCBK&&this._getStateCBK(o)},bindEvents:function(){var e=this,i=function(){e.tipTimer=setTimeout(function(){$("#popUserInfoId").css("visibility","hidden")},200)};$("#username").on("mouseover",function(){$("#popUserInfoId").css({display:"none",visibility:"visible"}).fadeIn()}),$("#popUserInfoId").on("mouseover",function(){o.clearTimeout(e.tipTimer)}),$("#username").on("mouseout",i),$("#popUserInfoId").on("mouseout",i),$("#logout").on("click",function(){return v.logout(),!1})},addLoginEvt:function(){var o=this;$("#login").off("click").on("click",function(e){e.stopPropagation(),e.preventDefault(),o.removeAll(),o.login()})},login:function(o){o=o||{},v.userState&&"0"==v.userState.isOnline?e(o):o.url&&(location.href=o.url)},logout:function(){o.location.href=t("logout",{u:o.location.href})},isLogin:function(o){var e=this,i=$("#logout_user_info"),t=$("#login_user_info");i&&i.hide(),t&&(t.show(),t.html(n(o))),$(e).trigger("setlogin"),this.bindEvents()},isLogout:function(){var o=$("#logout_user_info"),e=$("#login_user_info");o&&o.show(),e&&e.hide(),this.addLoginEvt()},clickPage:function(o,e){"normal"==o?($("#loginIframe_iph"+e).hide(),$("#passports"+e).show(),$("#normal_login"+e).addClass("login_hover"),$("#phone_login"+e).removeClass("login_hover")):"iph"==o&&($("#loginIframe_iph"+e).show(),$("#passports"+e).hide(),$("#phone_login"+e).addClass("login_hover"),$("#normal_login"+e).removeClass("login_hover"))},setParam:function(o,e){f[o]=e},getParam:function(o){return f[o]},removeParam:function(o){for(var e,i=0;e=o[i];i++)delete f[e]},removeAll:function(){f={}}};i.exports=v}(window)});