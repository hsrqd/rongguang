{%*提供最基本的layout*%}
<!doctype html>
{%html framework="bigba:static/libs/mod.js"%}
{%head%}
{%block name="jslib"%}
{%widget name="bigba:widget/layout/jslib.tpl" %}
{%/block%}
{%block name="meta"%}
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
<meta name="keywords" content="大巴车，租大巴"/>
<meta name="description" content="大巴车租赁网站，为您提供优质服务">
{%/block%}
<title>{%block name="title"%}荣光伟业{%/block%}</title>
{%widget name="bigba:widget/common/fuckie/html5shiv.tpl" %}
{%/head%}
{%body%}
{%block name="header"%}{%/block%}
{%block name="commonStyle"%}
{%/block%}
<div id="content" class="clearfix">{%block name="body"%}{%/block%}
</div>
{%block name="bottomArea"%}{%/block%}
{%widget name="bigba:widget/common/footer/footer.tpl"%}
<div class="mask"></div>
{%block name="stat"%}
{%/block%}
{%script%}
        require("bigba:page/layout.js");
    {%/script%}
{%require name='bigba:page/layout.tpl'%}{%/body%}
{%/html%}
