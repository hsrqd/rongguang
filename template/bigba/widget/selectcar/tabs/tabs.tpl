<div class="widget-selectcar-tabs">
    <div class="tab-con">
    	<span class="tab-item">大型车</span>
    	<span class="tab-item">中型车</span>
    	<span class="tab-item">小型车</span>
    	<span class="tab-item">豪华车</span>
    </div>
    <div class="divider"></div>
    <div class="content-box">
    	<div id="big" class="car-list">
    		<div class="car-box">
    			<div class="gallery">
                    <div id="slider1_container" class="slider_con">
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
                            <div>
                                <img u="image" src="/static/bigba/images/002.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/bigba/images/thumb-002.jpg" />
                                </div>
                            </div>
                            <div>
                                <img u="image" src="/static/bigba/images/003.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/bigba/images/thumb-003.jpg" />
                                </div>
                            </div>
                            <div>
                                <img u="image" src="/static/bigba/images/004.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/bigba/images/thumb-004.jpg" />
                                </div>
                            </div>
                            <div>
                                <img u="image" src="/static/bigba/images/005.jpg" />
                                <div u="thumb">
                                    <img class="i" src="/static/bigba/images/thumb-005.jpg" />
                                </div>
                            </div>
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
    			<div class="detail">
    				<h1 class="tit">51座  大型宇通客车</h1>
    				<p>
    					<span class="price">￥600起</span>
    					<span class="fr">xxx</span>
    				</p>
    			</div>
    		</div>
            <div class="car-box">
                <div class="gallery"></div>
                <div class="detail">
                    <h1 class="tit">51座  大型宇通客车</h1>
                    <p>
                        <span class="price">￥600起</span>
                        <span class="fr">xxx</span>
                    </p>
                </div>
            </div>
            <div class="car-box">
                <div class="gallery"></div>
                <div class="detail">
                    <h1 class="tit">51座  大型宇通客车</h1>
                    <p>
                        <span class="price">￥600起</span>
                        <span class="fr">xxx</span>
                    </p>
                </div>
            </div>
    	</div>

    </div>
</div>
{%script%}
    require("bigba:widget/selectcar/tabs/tabs.js").init();
{%/script%}
