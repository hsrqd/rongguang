<?php /* Smarty version Smarty-3.1.21-dev, created on 2015-06-20 15:13:28
         compiled from "\wamp\www\HSR\rongguang\template\bigba\widget\index\filter\filter.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1409055858318008bb4-16818105%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c0d1de6f7053e69d532df05a393c48eece9c3e42' => 
    array (
      0 => '\\wamp\\www\\HSR\\rongguang\\template\\bigba\\widget\\index\\filter\\filter.tpl',
      1 => 1434722108,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1409055858318008bb4-16818105',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.21-dev',
  'unifunc' => 'content_558583180109e8_01650849',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_558583180109e8_01650849')) {function content_558583180109e8_01650849($_smarty_tpl) {?><div class="filter-con">
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
<?php ob_start(); ?>
    var nav = require("bigba:widget/index/filter/filter.js").init();
<?php $script=ob_get_clean();if($script!==false){if(!class_exists('FISResource')){require_once('D:/wamp/www/HSR/rongguang/plugin/FISResource.class.php');}FISResource::addScriptPool($script);}?>
<?php }} ?>
