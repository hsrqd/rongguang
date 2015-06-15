{%extends file="bigba/page/layout.tpl"%} 
{%block name="commonStyle"%}
{%require name="bigba:static/css/page.less"%}
{%require name="bigba:static/plugin/jquery.placeholder.js"%}
{%/block%}
{%block name="header"%}
{%widget name="bigba:widget/common/ui/topbar/topbar.tpl"%}
{%widget name="bigba:widget/index/topbar/topbar.tpl"%}
{%widget name="bigba:widget/common/nav/nav.tpl"%}
{%/block%}
{%block name="body"%}
<div class="main">
{%widget name="bigba:widget/index/filter/filter.tpl"%}
{%widget name="bigba:widget/index/tuijian/tuijian.tpl"%}
{%widget name="bigba:widget/index/fengcai/fengcai.tpl"%}
{%widget name="bigba:widget/index/hezuo/hezuo.tpl"%}
</div>
{%/block%}
{%block name="bottomArea"%}
{%widget name="bigba:widget/index/bottom/bottom.tpl"%}
{%require name='bigba:page/index.tpl'%}{%/block%}