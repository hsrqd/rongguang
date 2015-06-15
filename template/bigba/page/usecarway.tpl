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
{%widget name="bigba:widget/selectcar/progress/progress.tpl" step="2"%}
{%widget name="bigba:widget/selectcar/usecar/usecar.tpl" %}
</div>
{%require name='bigba:page/usecarway.tpl'%}{%/block%}