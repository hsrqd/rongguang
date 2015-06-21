<div class="widget-hezuo">
	<div class="sec-top">
		<h2 class="tit">合作客户</h2>
	</div>
    <div class="divider"></div>
    <div class="content">
        {%foreach $wdata as $item%}
        <div class="line">
            {%foreach $item as $subitem%}
            <img src="{%$subitem.media_path%}" alt="{%$subitem.ptn_title%}" width="148" height="99">
            {%/foreach%}
        </div>
        {%/foreach%}
    </div>
    <div class="divider"></div>
</div>
