/**
 * @require bigba:static/libs/jquery.js
 * @require bigba:static/libs/plugin/base.js
 * 图片滑动
 * 公共组件
 */
;
(function () {
    var bw = require("bigba:static/utils/Browser.js");
    /**
     * 显示可见区域的图片,通过开始索引和结束索引填充src
     * @author jason.zhou
     */
    function showVisibleItems(that) {
        try {
            var run = that.run, // 存储滑动相关状态
                items = that.itemArr, // 滑动相关数据
                scrollDirection = that.scrollDirection, // 滑动方向
                pageCount = Math.floor(run.bodyWidth/run.itemWidth), // 计算一页展示数量
                tempIdx = scrollDirection ? pageCount : -pageCount,  // 临时索引为计算滑动后的索引间距
                sidx = run.startIndex,
                eidx = run.endIndex;
            if ((sidx  + tempIdx) > 1) { // 初始化默认填充
                sidx += tempIdx;
                eidx += tempIdx;
            }
            // 循环赋值data-src到src
            for (var i = sidx - 1, len = items.length; i < len && i < eidx; i++) {
                var item = items[i];
                imgD = item.find("img").eq(0),
                reSrc = imgD.attr("data-src");
                if(reSrc){
                    imgD.attr("src",reSrc);
                    imgD.attr("data-src","");
                }
            };
        } catch(e) {}
    }
    Class.define("Scroll", {
        extend: plugin.Base,
        v_selector: function () {
            return this.parent() + ",.prev|prev,.next|next"
        },
        initialize: function (root) {
            //$(root).html(this.getWrapHtml());
            this.parent(root);
            this.getWrapHtml();
            this.prev = this.find(".prev_disable");
            this.next = this.find(".next_disable");
            this.items = this.find(".items");
            this.body = this.find(".body");
            this.itemArr = [];
            this.$root.addClass("jscroll");
        },
        getWrapHtml: function (root) {
            this.$root.append('<a class="prev_disable"><span></span></a>')
                .append('<div class="body"><ul class="items"></ul></div>')
                .append('<a class="next_disable" ><span></span></a>');
        },
        getItemTemplate: function () {
            return '<li class="item"><a href="{link}" target="_blank" ><img onload="util.stretchImg(this,156,110,true)" onerror="util.errorImg(this)" src="{url}" /></a><div class="title">{cn_name}</div></li>';
        },
        createItem: function (item, index) {
            item._index = index + 1;
            return $(util.format(this.getItemTemplate(), item));
        },
        init: function (data) {

            var self = this;
            var item_withd = 0;
            $.each(data, function (i, item) {
                var _item = self.createItem(item, i);
                self.items.append(_item);
                self.itemArr.push(_item);
                item_withd == 0 && (item_withd = _item.outerWidth(true));
                /* ie 6 图片出不来 by jason.zhou */
                /*if (bw.msie && bw.version<7){
                    util.reloadImg(_item);
                }*/
            });			
            self.run = {
                itemWidth: item_withd,
                itemsWidth: self.itemArr.length * item_withd,
                bodyWidth: self.body.outerWidth(),
                running: false
            };
            self.run.visibleItems = self.run.bodyWidth / self.run.itemWidth;
            self.items.css({
                'width': self.run.itemsWidth,
                'left' : 0
            });
            self.scrolled();
            showVisibleItems(self);
        },
        scrolled: function () {
            var run = this.run;
            run.left = parseInt(this.items[0].style.left.replace("px", ""), 10);
            run.right = run.itemsWidth + run.left - run.bodyWidth;
            run.prev = run.left + run.bodyWidth;
            run.prev = run.prev > 0 ? 0 : run.prev;
            run.next = run.right > run.bodyWidth ? (run.left - run.bodyWidth) : (run.bodyWidth - run.itemsWidth);
            run.startIndex = -run.left / run.itemWidth + 1;
            run.endIndex = run.startIndex + run.visibleItems - 1;
            if (run.endIndex > this.itemArr.length)run.endIndex = this.itemArr.length;
            this.prev.attr("class", run.left < 0 ? "prev" : "prev_disable");
            this.next.attr("class", run.right > 0 ? "next" : "next_disable");

        },
        scroll: function (scrollto) {
            var self = this;
            if(this.run.left==scrollto)return;
            this.run.running = true;
            this.items.stop(true,false);
            showVisibleItems(this);
            this.items.animate({left: scrollto }, 500, function () {
                self.run.running = false;
                self.scrolled();
            });
        },
        prev_click: function () {
            this.scrollDirection = 0;
            if (!this.run.running) {
                this.scroll(this.run.prev);
            }
        },
        next_click: function () {
            this.scrollDirection = 1;
            if (!this.run.running) {
                this.scroll(this.run.next);
            }
        }
    });

    $.fn.scroll = function (opt) {
        opt = opt || {};
        opt.$root = $(this);
        $(this).data("scroll", Scroll.main(opt));
        $(this).data("scroll").init(opt.items);
    }
})();
