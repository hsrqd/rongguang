<?php /* Smarty version Smarty-3.1.21-dev, created on 2015-06-20 15:13:27
         compiled from "\wamp\www\HSR\rongguang\template\bigba\widget\index\topbar\topbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:478055858317f18c52-63592500%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '8d2f88245d2a80e0d4f795f278fb595d58003463' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\topbar\\topbar.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '478055858317f18c52-63592500',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.21-dev',
  'unifunc' => 'content_55858317f260a6_80108066',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_55858317f260a6_80108066')) {function content_55858317f260a6_80108066($_smarty_tpl) {?><div class="banner-con">
<div class="big_bg">
<?php if(!class_exists('FISResource')){require_once('D:/wamp/www/HSR/rongguang/plugin/FISResource.class.php');}$_tpl_path=FISResource::getUri("bigba:widget/common/nav/nav.tpl",$_smarty_tpl->smarty);if(isset($_tpl_path)){echo $_smarty_tpl->getSubTemplate($_tpl_path, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, $_smarty_tpl->caching, $_smarty_tpl->cache_lifetime, array('className'=>'topbar'), Smarty::SCOPE_LOCAL);}else{trigger_error('unable to locale resource "'."bigba:widget/common/nav/nav.tpl".'"', E_USER_ERROR);}FISResource::load("bigba:widget/common/nav/nav.tpl", $_smarty_tpl->smarty);?>
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
<?php ob_start(); ?>
    var nav = require("bigba:widget/index/topbar/topbar.js").init();
<?php $script=ob_get_clean();if($script!==false){if(!class_exists('FISResource')){require_once('D:/wamp/www/HSR/rongguang/plugin/FISResource.class.php');}FISResource::addScriptPool($script);}?>
<?php }} ?>
