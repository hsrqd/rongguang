{%extends file="waimai/page/usercenter/usercenter.tpl"%} 
{%block name="depends"%}
{%widget name="bigba:widget/usercenter/order/order.tpl"%}
{%/block%}
{%block name="statHunter"%}
<script>
    var Hunter = window.Hunter || {};
    Hunter.userConfig = Hunter.userConfig || [];
    Hunter.userConfig.push({ hid: 63163 });
</script>
<script>with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://img.baidu.com/hunter/map.js?st='+~(new Date()/864e5)];</script>
{%require name='bigba:page/usercenter/order/order.tpl'%}{%/block%}
