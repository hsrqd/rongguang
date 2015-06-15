{%extends file="waimai/page/usercenter/usercenter.tpl"%} 
{%block name="depends"%}
{%widget name="bigba:widget/usercenter/account/account.tpl" data=$data%}
{%widget name="bigba:widget/common/verifyphone/verifyphone.tpl"%}
{%script%}
        require('bigba:page/usercenter/account/account.js').init();
    {%/script%}
{%require name='bigba:page/usercenter/account/account.tpl'%}{%/block%}
