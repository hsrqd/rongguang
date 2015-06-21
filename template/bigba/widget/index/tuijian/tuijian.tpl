<div class="widget-recommend" id="widget-recommend">
	<div class="sec-top">
		<h2 class="tit">推荐车型</h2>
    	<a href="#" class="fr">更多车型</a>
	</div>
    <div class="divider"></div>
    <div class="box-list">
        {%foreach $wdata as $item%}
        <div class="box" data-id="{%$item.car_id%}">
            <div class="bpic">
                <img src="{%$item.media_path%}" width="292" height="201">
            </div>
            <div class="bdesc">
                <p class="desc1">{%$item.car_title%}</p>
                <p class="desc2">{%$item.car_sub_title%}</p>
                <div class="btn-desc">
                    <span class="ora1">¥{%$item.car_price%}起</span>
                    <span class="fr desc2">预定立减</span>
                </div>
            </div>
        </div>
        {%/foreach%}
    </div>
    <div class="divider"></div>
</div>
{%script%}
    (require("bigba:widget/index/tuijian/tuijian.js")).createWidget();
{%/script%}
