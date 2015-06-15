{%extends file="bigba/page/layout.tpl"%} 
{%block name="commonStyle"%}
{%require name="bigba:static/css/page.less"%}
{%require name="bigba:static/plugin/jquery.placeholder.js"%}
{%/block%}
{%block name="header"%}
{%widget name="bigba:widget/common/nav/nav.tpl" tab="contact" %}
{%/block%}
{%block name="body"%}
{%widget name="bigba:widget/contact/banner/banner.tpl"%}
<div class="main">
{%widget name="bigba:widget/contact/list/list.tpl"%}
{%widget name="bigba:widget/contact/feedback/feedback.tpl"%}
</div>
{%require name='bigba:page/contact.tpl'%}{%/block%}