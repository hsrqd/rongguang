/**
 * @require bigba:static/libs/plugin/base.js
 * @require bigba:static/libs/plugin/dialog/jquery.bgiframe.js
 */
;
(function () {
    (function ($) {
        var _initargs = {
            top: 0.282,
            left: 0.5,
            fixable: true,
            modeless: false
        }
        var ie6 = (function () {
            var isIE = !!window.ActiveXObject;
            return isIE && !window.XMLHttpRequest;
        }());
        var contentCss = {
            'display': 'none',
            'position': 'fixed',
            'zIndex': 10000,
            'top': '0px',
            'left': '50%'
        };

        var overlayCss = {
            'display': 'none',
            'position': 'fixed',
            'zIndex': 10000,
            'top': '0px',
            'left': '0px',
            'opacity': 0.2,
            'backgroundColor': '#000',
            "height":"100%",
            "width":"100%",
            "margin":"0px",
            "padding":"0px"
        };

        var ind = 0;
        var ZINDEXBASE = 10000;
        var cache = {};

        function getPositionType(tl) {
            if (tl.top < 0 || ie6) {
                return "absolute"
            } else {
                return "fixed";
            }
        }

        function getDE() {
            return (document.compatMode && document.compatMode.toLowerCase() == "css1compat") ? document.documentElement : document.body;
        }

        function getWH(overlay) {
            var de = getDE();
            return { width: Math.max(de.clientWidth, de.scrollWidth), height: Math.max(de.clientHeight, de.scrollHeight)};
        }

        function getTL(content, _top, left) {
            var de = (document.compatMode && document.compatMode.toLowerCase() == "css1compat") ? window.top === window.self ? document.documentElement : top.document.documentElement : window.top === window.self ? document.body : top.document.body;
            //var top = ( de.clientHeight - content.outerHeight()) * top + $(de).scrollTop();
            var top2;
            if (window.top === window.self) {
                top2 = (de.clientHeight - content.outerHeight()) * _top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            } else {
                top2 = (de.clientHeight - content.outerHeight()) * _top + Math.max(top.document.documentElement.scrollTop, top.document.body.scrollTop);
            }
            if (!ie6)top2 = (de.clientHeight - content.outerHeight()) * _top;
            var content_outer_height = content.outerHeight();
            //page 可以区域高度
            var max_doc_height = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
            var current_content_height = top2 + content_outer_height;

            if (current_content_height > max_doc_height) {
                top2 = (max_doc_height - content_outer_height) * _top;
            }

            var left = Math.floor(content.outerWidth() * left);
            return {
                marginLeft: -left,
                top: top2
            };
        }

        function parseInner(html, xbox) {
            return html;
        }

        function makeKey(ind) {
            return 'xbox' + ind;
        }

        function getQBox(evt) {
            if (typeof evt == 'string')
                return cache[evt];
            else if (evt && evt.isqbox) {
                return evt;
            } else {
                evt = jQuery.event.fix(evt || window.event);
                var p = $(evt.target).parents('.qbox_content');
                if (p.size() > 0) {
                    return cache[ makeKey(p.data('ind')) ];
                }
            }
        }

        function setCss(el, _top, _left) {
            var tl = getTL(el, _top, _left);

            el.css("position", getPositionType(tl));
            if (tl.top < 0) {
                tl.top = Math.max(top.document.documentElement.scrollTop, top.document.body.scrollTop) + 10;
                // el.css("position", "absolute");
            }
            el.css(tl);
        }

        var Xbox = function (html, args, ind) {

            this.key = makeKey(ind);
            this.args = args;
            this.alive = true;
            this.binded = false;
            this.overlay = $('<div />').addClass('qbox_overlay').css($.extend({}, overlayCss, {'zIndex': ZINDEXBASE + ind})).appendTo($(document.body));
            var ctx = this.content = $('<div />').addClass('qbox_content').css($.extend({}, contentCss, {'zIndex': ZINDEXBASE + ind})).appendTo($(document.body));
            if (ie6){
                ctx.css("position", "absolute");
                this.overlay.css("position", "absolute");
            }

            ctx.data('ind', ind);

            if (typeof html == 'string') {
                ctx.html(parseInner(html));
            } else {
                ctx.append($(html).show());
            }

            cache[this.key] = this;
        };
        Xbox.prototype = {
            isqbox: 1
        };
        $.each(['close', 'show', 'hide', 'trigger', 'bind', 'unbind', 'data'], function (idx, type) {
            Xbox.prototype[type] = function () {
                return $.xbox[type].apply(window, [this].concat(Array.prototype.slice.call(arguments || [])));
            };
        });
        $.xbox = function (html, arg) {
            var _ind = ++ind;
            arg = $.extend(_initargs, arg || {});
            return new Xbox(html || "", arg, _ind);
        };
        $.xbox.bind = function (evt, type, func) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            $(qb.content).bind(type + '.xbox.' + qb.key, func);
        };
        $.xbox.unbind = function (evt, type, func) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            if (func)
                $(qb.content).unbind((type || '') + '.xbox.' + qb.key, func);
            else
                $(qb.content).unbind((type || '') + '.xbox.' + qb.key);
        };
        $.xbox.trigger = function (evt, type, data) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            $(qb.content).triggerHandler(type + '.xbox.' + qb.key, data);
        };
        $.xbox.data = function (evt, key, value) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            return qb.content.data(key, value);
        };
        $.xbox.show = function (evt) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;

            if (!qb.args.modeless)
                qb.overlay.show();
            qb.content.show();

            if (!qb.binded) {
                qb.binded = true;
                $(window).bind('resize.xbox', function (evt) {
                    if (qb.args.fixable) {
                        setCss(qb.content, qb.args.top, qb.args.left);
                        //qb.content.css(getTL(qb.content, qb.args.top, qb.args.left));
                    }
                    qb.overlay.css(getWH(true));
                    $(qb.content).trigger('changePosition', qb.content);
                });
                $(window).bind('scroll.xbox', function (evt) {
                    if (qb.args.fixable) {
                        if (ie6)
                            setCss(qb.content, qb.args.top, qb.args.left);
                        //qb.content.css(getTL(qb.content, qb.args.top, qb.args.left));
                    }
                    $(qb.content).trigger('changePosition', qb.content);
                });

            }

            if (qb.args.fixable) {
                setCss(qb.content, qb.args.top, qb.args.left);
                //qb.content.css(getTL(qb.content, qb.args.top, qb.args.left));
            }

            var _oldfixable = qb.args.fixable;
            qb.args.fixable = true;
            $(window).triggerHandler('resize.xbox');
            qb.args.fixable = _oldfixable;


            $(qb.content).trigger('changePosition', qb.content);
            $(qb.content).trigger('show', qb.content);
        };
        $.xbox.hide = function (evt) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            $(window).unbind('scroll.xbox');
            $(window).unbind('resize.xbox');
            qb.binded = false;
            qb.overlay.hide();
            qb.content.hide();
            $(qb.content).triggerHandler('hide.xbox.' + qb.key);
        };

        $.xbox.close = function (evt) {
            var qb = getQBox(evt);
            if (!qb || !qb.alive)return;
            $.xbox.hide(qb);
            qb.alive = qb.binded = false;
            qb.overlay.remove();
            qb.content.remove();
            delete cache[qb.key];
            $(qb.content).triggerHandler('close.xbox.' + qb.key);
        };
    })(jQuery);

    Class.define("Dialog", {
        extend: plugin.Base,
        initialize: function () {
            this.dialog = $.xbox(this.getHtml());
            this.parent(this.dialog.content);
            this.$root.bgiframe();
        },
        init: function () {
            this.show();
        },
        show: function () {
            this.dialog.show();
            this.isHideOverlay && this.dialog.overlay.hide();
        },
        hideOverlay: function () {
            this.isHideOverlay = true;
            var key = "mousedown.xbox." + this.dialog.key;
            var self = this;
            $(document).unbind(key).bind(key, function (e) {
                if ($.contains(self.$root[0], e.target))return;
                self.hide();
            });
        },
        /*
         * el 要定位到的元素
         * type : TL=上左，TR=上右，BL=下左，BR=下右
         * */
        setPosition: function (el, type, _offset) {
            this.$root.css("position", "absolute");
            var elTL = {
                width: $(el).outerWidth(),
                height: $(el).outerHeight() + 10
            };
            var h = 10;
            var self = this;

            _offset = _offset || {};

            $(this.$root).unbind("changePosition").bind("changePosition", function () {
                var offset = $(el).offset();
                var p = {
                    L: function () {
                        return {left: offset.left - self.$root.outerWidth() + elTL.width + ( _offset.left || 0)}
                    },
                    B: function () {
                        return {top: offset.top + elTL.height + (_offset.top || 0)}
                    },
                    T: function () {
                        return {top: offset.top - self.$root.outerHeight() + (_offset.top || 0)}
                    },
                    R: function () {
                        return {left: offset.left + ( _offset.left || 0)}
                    }
                };

                var css = { marginLeft: 0};

                $.each(type.split(""), function (i, item) {
                    var temp = p[item.toUpperCase()];
                    if (temp)$.extend(css, temp());
                });

                self.$root.css(css);
                self.$root.css("position", "absolute");
            });

        },
        close: function () {
            this.dialog.close();
        },
        hide: function () {
            this.dialog.hide();
        },
        getHtml: function (html) {
            return "<div style='background-color: #ffffff; height: 100px; width: 300px;'>我是弹层</div>";
        }
    });
}).call(this);

/*
 * demo
 *
 * Dialog.main({
 getHtml : function () {
 return "<div >eeeee<span id='myspan'>vvvvvvvvvvvvvv</span>eeee<span id='dd'>ddddd</span>eeee</div>"
 },
 myspan_click : function () {
 alert(this.find("#id"))
 alert(1);
 this.close();
 }
 }).show()

 *
 * */