{%extends file="bigba/page/layout.tpl"%} 
{%block name="commonStyle"%}
{%require name="bigba:static/css/page.less"%}
{%require name="bigba:static/plugin/jquery.placeholder.js"%}
{%/block%}
{%block name="header"%}
{%widget name="bigba:widget/common/ui/topbar/topbar.tpl"%}
{%widget name="bigba:widget/common/nav/nav.tpl"%}
{%/block%}
{%block name="body"%}
<div class="main">
<div class="left">
{%widget name="bigba:widget/usercenter/menu/menu.tpl"%}
</div>
<div class="right">
{%widget name="bigba:widget/usercenter/order/order.tpl"%}
</div>
</div>
{%require name='bigba:page/usercenter.tpl'%}{%/block%}