<div class="widget-selectcar-tabs" id="select-car-widget">
    <!-- <div class="tab-con">
    	<span class="tab-item">大型车</span>
    	<span class="tab-item">中型车</span>
    	<span class="tab-item">小型车</span>
    	<span class="tab-item">豪华车</span>
    </div> -->
    <div class="divider"></div>
    <div class="content-box">
    	<div id="big" class="car-list">
            {%foreach $wdata as $item name=cartList%}
    		<div class="car-box" data-node="car-box" data-id="{%$item.car_id%}">
    			<div class="gallery">
                    <div id="slider_container_{%$smarty.foreach.cartList.index%}" class="slider_con">
                        <!-- Loading Screen -->
                        <div u="loading" style="position: absolute; top: 0px; left: 0px;">
                            <div style="filter: alpha(opacity=70); opacity:0.7; position: absolute; display: block;
                                background-color: #000000; top: 0px; left: 0px;width: 100%;height:100%;">
                            </div>
                            <div class="loading">
                            </div>
                        </div>

                        <!-- Slides Container -->
                        <div u="slides" style="cursor: move; position: absolute; left: 0px; top: 0px; width: 450px; height: 280px;
                            overflow: hidden;">
                            {%foreach $item.media_list as $subitem%}
                            <div>
                                <img u="image" src="{%$subitem.media_path%}" />
                                <div u="thumb">
                                    <img class="i" src="{%$subitem.media_path%}" />
                                </div>
                            </div>
                            {%/foreach%}
                            <!-- <div>
                                <img u="image" src="/static/images/003.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/images/thumb-003.jpg" />
                                </div>
                            </div>
                            <div>
                                <img u="image" src="/static/images/004.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/images/thumb-004.jpg" />
                                </div>
                            </div>
                            <div>
                                <img u="image" src="/static/images/005.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/images/thumb-005.jpg" />
                                </div>
                            </div> -->
                        </div>
                        
                       
                        <div u="thumbnavigator" class="jssort11" style="left: 460px; top:0px;">
                            <!-- Thumbnail Item Skin Begin -->
                            <div u="slides" style="cursor: default;">
                                <div u="prototype" class="p" style="top: 0; left: 0;">
                                    <div u="thumbnailtemplate" class="tp"></div>
                                </div>
                            </div>
                            <!-- Thumbnail Item Skin End -->
                        </div>
                        <!--#endregion ThumbnailNavigator Skin End -->
                    </div>
                </div>
    			<div class="detail"  data-id="{%$item.car_id%}" data-name="{%$item.car_title%}">
    				<h1 class="tit">{%$item.car_title%}</h1>
    				<p>
    					<span class="price">￥{%$item.car_price%}起</span>
    					<span class="fr tips"><img src="/static/bigba/images/tips.png"></span>
    				</p>
                    <p class="desc">
                        {%$item.car_summary%}
                    </p>
                    <!-- <p class="desc">
                        全天包车 100公里／8小时  ¥ 1200起
                    </p> -->
                    <p class="bdesc">
                        可乘坐人数：{%$item.car_seat%}人
                    </p>
                    <p class="blacktips">
                        {%foreach $item.tag_list as $tipitem%}
                        <span data-tagid="{%$tipitem.tag_id%}" class="blacktip">{%$tipitem.tag_title%}</span>
                        {%/foreach%}
                    </p>
    			</div>
                <div class="corner"></div>
    		</div>
            {%/foreach%}
            <!-- <div class="car-box">
                <div class="gallery"></div>
                <div class="detail">
                    <h1 class="tit">51座  大型宇通客车</h1>
                    <p>
                        <span class="price">￥600起</span>
                        <span class="fr">xxx</span>
                    </p>
                </div>
            </div> -->
    	</div>

    </div>
    <div class="summary-bar">
        <div>
            <span data-node="selectMsg">
                <span>您已选择：</span>
            </span>
            <button class="nextbtn" data-node="nextBtn">下一步</button>
        </div>
    </div>
    <form data-node="nextForm" action="order/select_car_action/" style="display:none">
    </form>
</div>
{%script%}
    (require("bigba:widget/selectcar/tabs/tabs.js")).createWidget();
{%/script%}

