{%extends file="waimai/page/usercenter/usercenter.tpl"%}

{%block name="depends"%}
    {%widget name="bigba:widget/usercenter/refund/refund.tpl" wdata=$data.result%}
{%require name='bigba:page/usercenter/refund/refund.tpl'%}{%/block%}
