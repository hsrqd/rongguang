<?php /*%%SmartyHeaderCode:1358855858317d581b6-50294446%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '77ea7fcdb05ea29d429a7f800b2bc0d0dac988d5' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\page\\index.tpl',
      1 => 1434809875,
      2 => 'file',
    ),
    '4d18fee3c121bc3bd331c29a93de353d530d8b27' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\page\\layout.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '82b88f7a15891403e0cfc7ad5d117411e2722cb9' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\layout\\jslib.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '6b1b83afc40ad670ae3f189c51fcd88097c77e34' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\common\\fuckie\\html5shiv.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    'c0efdbfcf876c2b8aab7317478760f5af766720b' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\common\\ui\\topbar\\topbar.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '8d2f88245d2a80e0d4f795f278fb595d58003463' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\topbar\\topbar.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    'ab23405630bd4bba76673823fcd54addef5cc79c' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\common\\nav\\nav.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    'c0d1de6f7053e69d532df05a393c48eece9c3e42' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\filter\\filter.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '1697092533a01fb05c7224e0986d49ea0e7ce15d' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\tuijian\\tuijian.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '7351ea8c60b9e29d7725337e2cc1b4394e94777a' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\fengcai\\fengcai.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '771089022765ec0422677db53de50c38948d06f4' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\hezuo\\hezuo.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '60b2135355e92f545a5ec982acd3aaf898f7193a' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\bottom\\bottom.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
    '75e745c516eb93b0e9ca99f08ee15099b0fe97f4' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\common\\footer\\footer.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1358855858317d581b6-50294446',
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.21-dev',
  'unifunc' => 'content_5585831805e141_40478770',
  'cache_lifetime' => 3600,
),true); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5585831805e141_40478770')) {function content_5585831805e141_40478770($_smarty_tpl) {?><!doctype html>
<html>
<head>



<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
<meta name="keywords" content="大巴车，租大巴"/>
<meta name="description" content="大巴车租赁网站，为您提供优质服务">

<title>荣光伟业</title>
<!--[if lt IE 9]>
<style type="text/css">
article,aside,dialog,footer,header,section,footer,nav,figure,menu{display:block}
</style>
<script type="text/javascript">
/*
 HTML5 Shiv v3.7.0 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);
if(g)return a.createDocumentFragment();for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document);
</script>
<![endif]-->
<link rel="stylesheet" type="text/css" href="/static/bigba/css/base.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/css/utility.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/common.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/topbar/topbar.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/filter/filter.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/tuijian/tuijian.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/fengcai/fengcai.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/hezuo/hezuo.css"/><link rel="stylesheet" type="text/css" href="/static/bigba/widget/index/bottom/bottom.css"/></head>
<body>

<header class="header">
<div class="ui-width header-wrap">
<span class="wel text">欢迎光临荣光巴士网，请<a href="#">登陆</a>或<a href="#">注册</a></span>
<span class="text right">订车服务热线：<span class="phone">400-800-8888</span></span>
</div>
</header>
<div class="banner-con">
<div class="big_bg">
<header class="nav-header topbar">
<nav>
<div class="logo"></div>
<ul class="nav">
<li class="nav-item">
<a href="/waimai" class="nav-item-link">首页</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">企业包车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">团体包车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">活动用车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">旅游用车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">接送机站</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">企业简介</a>
</li>
</ul>
</nav>
</header>
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
<header class="nav-header topbar">
<nav>
<div class="logo"></div>
<ul class="nav">
<li class="nav-item">
<a href="/waimai" class="nav-item-link">首页</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">企业包车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">团体包车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">活动用车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">旅游用车</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">接送机站</a>
</li>
<li class="nav-item">
<a href="/waimai" class="nav-item-link">企业简介</a>
</li>
</ul>
</nav>
</header>



<div id="content" class="clearfix">
<div class="main">
<div class="filter-con">
<div class="filter_bg item3">
<div class="normal-text">
<h1>企业用车</h1>
</div>
<div class="hover-text">
<h1>企业用车</h1>
<p>通勤／会议／团建／访问</p>
<p><span class="box">查看详情</span></p>
</div>
</div>
<div class="filter_bg item2">
<div class="normal-text">
<h1>团体用车</h1>
</div>
<div class="hover-text">
<h1>团体用车</h1>
<p>通勤／会议／团建／访问</p>
<p><span class="box">查看详情</span></p>
</div>
</div>
<div class="filter_bg item1">
<div class="normal-text">
<h1>活动用车</h1>
</div>
<div class="hover-text">
<h1>活动用车</h1>
<p>通勤／会议／团建／访问</p>
<p><span class="box">查看详情</span></p>
</div>
</div>
</div>
<div class="widget-recommend">
<div class="sec-top">
<h2 class="tit">推荐车型</h2>
<a href="#" class="fr">更多车型</a>
</div>
<div class="divider"></div>
<div class="box-list">
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
<div class="box">
<div class="bpic">
<img src="/static/bigba/images/bus.png">
</div>
<div class="bdesc">
<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
<p class="desc2">6000元保险，预定立减100元</p>
<div class="btn-desc">
<span class="ora1">¥ 300起</span>
<span class="fr desc2">预定立减</span>
</div>
</div>
</div>
</div>
<div class="divider"></div>
</div>
<div class="widget-feicai">
<div class="sec-top">
<h2 class="tit">车队风采</h2>
</div>
<div class="divider"></div>
<div class="content">
<div class="con-box">
<img src="/static/bigba/images/fengcai.jpg">
<p>车队视频介绍</p>
</div>
<div class="con-box sm">
<img src="/static/bigba/images/fengcai.jpg">
<p>车队视频介绍</p>
</div>
<div class="con-box sm">
<img src="/static/bigba/images/fengcai.jpg">
<p>车队视频介绍</p>
</div>
<div class="con-box sm">
<img src="/static/bigba/images/fengcai.jpg">
<p>车队视频介绍</p>
</div>
</div>
<div class="divider"></div>
</div>
<div class="widget-hezuo">
<div class="sec-top">
<h2 class="tit">合作客户</h2>
</div>
<div class="divider"></div>
<div class="content">
<div class="line">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
</div>
<div class="line">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
<img src="/static/bigba/images/bdlogo.jpg">
</div>
</div>
<div class="divider"></div>
</div>
</div>

</div>

<div class="widget-bottom">
<div class="long-bar"></div>
<div>
<div class="address">
<img src="/static/bigba/images/map-bottom.jpg">
<table width="410">
<tr>
<td width="50" valign="top">地址：</td>
<td>北京市海淀区上地西路后场村路口向北300米路东<br>（东大救援中心院内）</td>
</tr>
<tr>
<td>电话：</td>
<td>010-82770325</td>
</tr>
<tr>
<td>邮箱：</td>
<td>rgwy1021@163.com</td>
</tr>
</table>
</div>
</div>
</div>
<footer class="footer-con">
<div class="footer-items">
<div class="footer-items-snippet footer-item">
<img src="/static/bigba/images/logo-color.png">
</div>
<div class="footer-items-snippet footer-item">
<a>租车攻略</a>
</div>
<div class="footer-items-snippet footer-item">
<a>车队风采</a>
</div>
<div class="footer-items-snippet footer-item">
<a>上地专区</a>
</div>
<div class="footer-items-snippet footer-item">
<a>关于我们</a>
</div>
</div>
</footer><div class="mask"></div>


</body><script type="text/javascript" src="/static/bigba/libs/mod.js"></script>
<script type="text/javascript" src="/static/bigba/libs/jquery.js"></script>
<script type="text/javascript" src="/static/bigba/libs/plugin/placeholder/jquery.placeholder.js"></script>
<script type="text/javascript" src="/static/bigba/libs/jsmod.js"></script>
<script type="text/javascript" src="/static/bigba/libs/underscore.js"></script>
<script type="text/javascript" src="/static/bigba/libs/listener.js"></script>
<script type="text/javascript" src="/static/bigba/util.js"></script>
<script type="text/javascript" src="/static/bigba/lib.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/topbar/topbar.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/filter/filter.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/tuijian/tuijian.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/fengcai/fengcai.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/hezuo/hezuo.js"></script>
<script type="text/javascript" src="/static/bigba/widget/index/bottom/bottom.js"></script>
<script type="text/javascript" src="/static/bigba/page/index.js"></script>
<script type="text/javascript">!function(){try{    var nav = require("bigba:widget/common/ui/topbar/topbar.js").init();
}catch(e){/*TODO*/}}();
!function(){try{    var nav = require("bigba:widget/index/topbar/topbar.js").init();
}catch(e){/*TODO*/}}();
!function(){try{    var nav = require("bigba:widget/index/filter/filter.js").init();
}catch(e){/*TODO*/}}();
!function(){try{        require("bigba:page/index.js");
    }catch(e){/*TODO*/}}();
!function(){try{        require("bigba:page/layout.js");
    }catch(e){/*TODO*/}}();</script></html>
<?php }} ?>
