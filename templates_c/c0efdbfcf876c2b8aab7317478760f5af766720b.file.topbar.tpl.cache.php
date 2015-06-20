<?php /* Smarty version Smarty-3.1.21-dev, created on 2015-06-20 15:13:27
         compiled from "\wamp\www\HSR\rongguang\template\bigba\widget\common\ui\topbar\topbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2671955858317f01b76-11952731%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c0efdbfcf876c2b8aab7317478760f5af766720b' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\common\\ui\\topbar\\topbar.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2671955858317f01b76-11952731',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.21-dev',
  'unifunc' => 'content_55858317f09694_42388232',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_55858317f09694_42388232')) {function content_55858317f09694_42388232($_smarty_tpl) {?><header class="header">
<div class="ui-width header-wrap">
<span class="wel text">欢迎光临荣光巴士网，请<a href="#">登陆</a>或<a href="#">注册</a></span>
<span class="text right">订车服务热线：<span class="phone">400-800-8888</span></span>
</div>
</header>
<?php ob_start(); ?>
    var nav = require("bigba:widget/common/ui/topbar/topbar.js").init();
<?php $script=ob_get_clean();if($script!==false){if(!class_exists('FISResource')){require_once('D:/wamp/www/HSR/rongguang/plugin/FISResource.class.php');}FISResource::addScriptPool($script);}?>
<?php }} ?>
