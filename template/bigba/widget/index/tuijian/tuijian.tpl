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
                <img src="{%$item.media_path%}" width="192" height="201">
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
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    	<div class="box">
    		<div class="bpic">
    			<img src="/static/bigba/images/bus.png">
    		</div>
    		<div class="bdesc">
    			<p class="desc1">31座  宇通客车企业班车／团队旅行</p>
    			<p class="desc2">6000元保险，预定立减100元</p>
    			<div class="btn-desc">
    				<span class="ora1">¥ 300起</span>
    				<span class="fr desc2">预定立减</span>
    			</div>
    		</div>
    	</div>
    </div>
    <div class="divider"></div>
</div>
{%script%}
    (require("bigba:widget/index/tuijian/tuijian.js")).createWidget();
{%/script%}
