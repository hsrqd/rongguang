/**
 *  @require bigba:static/libs/plugin/dialog/dialog.js
 *  @require bigba:static/libs/plugin/scroll/scroll.js
 */
;
(function() {
    var Dialog = require("jsmod/ui/dialog"),
        Carousel = require("jsmod/ui/carousel"),
        template = require("bigba:static/utils/Template.js"),
        Const;

    Const = {
        html: [
            '<div class="pic-view">',
            '<a class="pic-view-close" href="javascript:void(0);"></a>',
            '<div class="pic-view-panel">',
            '<div class="pic-view-control">',
            '<a class="pre" href="javascript:void(0);"></a>',
            '<a class="next" href="javascript:void(0);"></a>',
            '</div>',
            '<div class="pic-view-image"></div>',
            '</div>',
            '<div class="pic-view-desc desc"></div>',
            '<div class="pic-view-bottom">',
            '<a class="next" href="javascript:void(0);"></a>',
            '<a class="pre" href="javascript:void(0);"></a>',
            '<div class="pic-view-carousel"></div>',
            '</div>',
            '</div>'
        ].join(""),
        height: 600,
        width: 800,
        count: 6
    }

    Class.define("PicView", {
        extend: plugin.Base,
        initialize: function(option) {
            var self = this,
                option = option || {};

            self.dialog = new Dialog({
                html: Const.html,
                height: Const.height,
                width: option.width || Const.width,
                offset: {
                    top: -self.getOffset()
                }
            });

            self.dialog.getElement().find(".pic-view-close").click(function() {
                self.dialog.hide({
                    fade: true
                });
            });

            self.desc = self.dialog.getElement().find(".pic-view-desc");
            self.$root = self.dialog.getElement().find(".pic-view");
        },
        getOffset: function() {
            return $(window).height() - Const.height > 100 ? ($(window).height() - Const.height) / 2 - 100 : 0
        },
        setDesc: function() {
            this.desc.html('<div class="page"><span class="curPage">' + this.index + '</span>/' + this.dataLength + '</div>');
        },
        setData: function(data) {
            this.data = data;
            this.dataLength = this.data.length;
        },
        /**
         * 创建 carsousel
         */
        createJscroll: function(index) {
            var self = this,
                element = self.dialog.getElement(),
                htmls = [],
                htmlsBanner = [];

            if (self.jscroll) {
                return;
            }

            $.each(self.data, function(idx, item) {
                // item.url ? item.url 如果存在就用原有的图片地址
                var smallImg = item.url ? item.url : (this.imgUrl ? util.thumbnails({
                    src: this.imgUrl,
                    width: 314,
                    height: 220
                }) : util.getNoPicUrl());

                htmls.push([
                    '<div class="item">',
                    '<img src="' + smallImg + '" onload="util.stretchImg(this,100,70,true)" onerror="util.errorImg(this)" />',
                    '</div>'
                ].join(""));

                htmlsBanner.push([
                    '<div class="item">',
                    '<div class="item-inner"><img data-src="' + this.imgUrl + '" onerror="util.errorImg(this)" /></div>',
                    '</div>'
                ].join(""));
            });

            self.jscroll = new Carousel(element.find(".pic-view-carousel"), {
                htmls: htmls,
                count: Const.count,
                current: index
            });

            self.currentIndex = index;
            self.index = index + 1;
            self.changeBtnStat(self.currentIndex);

            $(self.jscroll).on("active", function(e) {
                var bIndex;

                self.currentIndex = e.index;
                self.index = e.index + 1;
                self.changeBtnStat(self.currentIndex);

                // 事件返回的 index 不是当前 cur 的 index，需要从实例中获取真实的 curIndex
                bIndex = self.banner.getCurIndex();
                bIndex != self.jscroll.getCurIndex() && self.banner.cur(self.jscroll.getCurIndex());
            });

            self.$root.delegate(".pic-view-bottom .next", "click", function() {
                self.jscroll.cur(self.currentIndex + Const.count, undefined, true);
            });

            self.$root.delegate(".pic-view-bottom .pre", "click", function() {
                self.jscroll.cur(self.currentIndex - Const.count, undefined, true);
            });

            self.$root.delegate(".pic-view-bottom .mod-carousel-item", "click", function() {
                self.jscroll.cur($(this).data("index"));
            });

            // banner 相关代码
            self.banner = new Carousel(element.find(".pic-view-image"), {
                htmls: htmlsBanner,
                count: 1,
                current: index
            });

            $(self.banner).on("active", function() {
                var jIndex, image;

                jIndex = self.jscroll.getCurIndex();
                image = this.getItem(this.getCurIndex()).find("img");
                jIndex != this.getCurIndex() && self.jscroll.cur(this.getCurIndex());

                if (!image.data("loaded")) {
                    image.one("load.img", function() {
                        image.data("loaded", true);
                    });
                    image.one("error.img", function() {
                        image.data("loaded", false);
                        image.off("load.img")
                    });
                    image.prop("src", image.attr("data-src"));
                }

                self.setDesc();
            });

            $(self.banner).trigger("active");

            if (self.banner.total <= 1) {
                return;
            }

            self.$root.on("mousemove", ".pic-view-image", function(e) {
                var left;

                if (!$(e.target).hasClass("mod-carousel-item")) {
                    left = (e.offsetX || e.originalEvent.layerX) + e.target.offsetLeft;
                } else {
                    left = (e.offsetX || e.originalEvent.layerX);
                }

                if (left > $(this).width() / 2) {
                    $(this).removeClass("pic-view-image-left").addClass("pic-view-image-right");
                } else {
                    $(this).removeClass("pic-view-image-right").addClass("pic-view-image-left");
                }
            });

            self.$root.on("click", ".pic-view-image", function(e) {
                var left;

                if (!$(e.target).hasClass("mod-carousel-item")) {
                    left = (e.offsetX || e.originalEvent.layerX) + e.target.offsetLeft;
                } else {
                    left = (e.offsetX || e.originalEvent.layerX);
                }

                if (left > $(this).width() / 2) {
                    self.banner.next();
                } else {
                    self.banner.pre();
                }
            });
        },
        /**
         * 改变上下按钮显示
         */
        changeBtnStat: function(index) {
            var self = this;

            if (self.currentIndex + 2 >= self.jscroll.total - 1 || Const.count >= self.jscroll.total) {
                self.$root.find(".pic-view-bottom .next").animate({
                    opacity: 0
                }, 200, function() {
                    $(this).css("opacity", 1).
                    css("visibility", "hidden");
                });
            } else {
                self.$root.find(".pic-view-bottom .next").css("visibility", "visible");
            }

            if (self.currentIndex - 3 <= 0 || Const.count >= self.jscroll.total) {
                self.$root.find(".pic-view-bottom .pre").animate({
                    opacity: 0
                }, 200, function() {
                    $(this).css("opacity", 1).
                    css("visibility", "hidden");
                });
            } else {
                self.$root.find(".pic-view-bottom .pre").css("visibility", "visible");
            }
        },
        scrollTo: function(index) {
            var self = this;

            self.dialog.show({
                fade: true
            });

            if (!self.jscroll) {
                self.createJscroll(index - 1);
            } else {
                self.jscroll.cur(index - 1);
            }

            self.setDesc();
        }
    });
})();
