{%extends file="waimai/page/layout.tpl"%} 
{%block name="title"%}百度外卖{%/block%}
{%block name="PDC_PAGE_ID"%}85{%/block%}
{%block name="commonStyle"%}
{%require name="bigba:static/css/page.less"%}
{%require name="bigba:static/plugin/jquery.placeholder.js"%}
{%/block%}
{%block name="header"%}
{%widget name="bigba:widget/common/nav/nav.tpl" tab="order"%}
{%/block%}
{%block name="body"%}
<div class="main">
{%widget name="bigba:widget/usercenter/menu/menu.tpl"%}
{%block name="depends"%}{%/block%}
<div class="clearfix" style="_height:0px;_overflow:hidden;"></div>
</div>
<div class="knightCover hide" data-node="knightCover"></div>
<div class="knightDisplay hide" data-node="knightDisplay">
<div class="knightTitle">
<p>查看骑士位置</p>
<span data-node="knightClose">×</span>
</div>
<div class="knightLocationBig">
<a class="knightRefresh" data-node="knightRefresh" orderid="">刷新</a>
<div class="knightBigMap" id="knightBigMap"></div>
</div>
</div>
{%widget name="bigba:widget/common/fuckie/order.tpl" %}
{%/block%}
{%block name="stat"%}
{%script%}
        require("bigba:static/utils/stat.js").init({
            da_trd:'waimai',
            page:'WaimaiOrderPg'
        });
        addNStat({
            da_src:'',
            da_act:'show'
        });
    {%/script%}
{%block name="statHunter"%}{%/block%}
{%require name='bigba:page/usercenter/usercenter.tpl'%}{%/block%}
