define('bigba:widget/common/userinfo/UserMgr.js', function(require, exports, module){ /**
 * UserMgr 管理用户登录 退出 等状态
 * @author jican
 * @author fms
 * @author jason、xinjing
 * @date 2011/11/28
 * @date 2013.3.28
 * @date 2013.7.5
 */

(function(win) {

    // PASSPORT常量 私有
    var PASSPORT_URL_HOST = 'https://passport.baidu.com',
        PASSPORT_VERSION = 'v2/',
        PASSPORT_TPL = '&tpl=ma',
        PASSPORT_ACTION_LOGIN = '?login',
        PASSPORT_ACTION_LOGOUT = '?logout';
    T_ORDER_LIST = [
        '<ul class="order-list">',
        '<li><a target="_blank" class="order-list-cater" href="/detail?qt=orderlist&type=cater&detail=order_list">餐饮订单</a></li>',
        // '<li><a target="_blank" class="order-list-hotel" stat="click|{da_src:hotel.hotelorder}" href="/detail?qt=orderlogin&type=hotel&detail=hotel_order_login">酒店订单</a></li>',
        '<li><a target="_blank" class="order-list-movie" href="/detail?qt=orderlist&type=movie">电影订单</a></li>',
        //'<li><a target="_blank" class="order-list-movie" href="/waimai?qt=orderlist&type=suc">外卖订单</a></li>',
        '</ul>'
    ].join("");


    var PASS_UI_API = PASSPORT_URL_HOST + '/passApi/js/uni_login_wrapper.js?cdnversion='; //通用登录浮窗 api by fms

    //登录跳转页本地测试地址
    var V3_JUMP_PAGE = 'http://' + win.location.host + '/static/common/widget/userinfo/v3Jump.html';

    //用户登录状态    
    var USER_STATE_API = '/waimai/checklogin'
        //'http://mc.map.baidu.com/passport/Session3.php', // 用户登录状态获取
        USER_CENTER_HREF = 'http://passport.baidu.com/center', //PASSPORT_URL_HOST+'?center&tpl=ma&aid=7&default_tab=4', // 用户账号设置
        USER_STATE_LOGIN = '1',
        USER_STATE_LOGOUT = '0';

    // 获取用户登录状态中间回调
    var _getStateCBK = null;
    // 存储其它相关参数、用于登录改造
    var param = {};
    var loginPop = null;
    /*var partnerLinks = ['qzone', 'tqq', 'tsina', 'renren']; */// 关联账户
    var partnerLinks = []; 
    var isInit = false; //是否已初始化
    /**
     * 加载V3登录浮窗(适配tangram 2.X版本)
     * @param {Object} opts
     * @opts.onSuccess 成功回调函数
     * @opts.url       成功跳转地址
     */
    function showV3Pass(opts) {
        var url = PASS_UI_API + new Date().getTime(),
            opts = opts || {},
            jumpurl = opts.url || win.location.href;
            sucCallBack = opts.sucessCB || function(){};

        if (loginPop) {
            loginPop.show();
            var plt = $('#place-login-tips');
            if (plt.length) {
                if (UserMgr.getParam('tip')) {
                    plt.show();
                } else {
                    plt.hide();
                }
            }
        } else {
            var newWindow, // 新打开页面 by jason
                loadLogin = function() {
                    var config = {
                        tangram: true, // 标识是否加载tangram2.0。页面使用的基础库不是tangram2.0时应设为true        
                        id: 'login',
                        cache: true,
                        apiOpt: {
                            product: 'ma', //产品线标志，原tpl
                            staticPage: V3_JUMP_PAGE, //jump地址，注意大小写
                            u: jumpurl, //登录成功跳转地址
                            sms: 2
                        },
                        authsite: partnerLinks,
                        authsiteCfg: {
                            act: 'implicit',
                            u: jumpurl
                        },
                        onSubmitStart: function() {
                            if (UserMgr.getParam('purl')) {
                                newWindow = win.open('about:blank');
                            }
                        },
                        onLoginSuccess: function(e) {
                            var loginEvent = $.Event("onLoginSuccess");
                            sucCallBack();
                            // 触发事件使得用户可以自定义后续行为
                            $(UserMgr).trigger(loginEvent);
                            if (!loginEvent.isDefaultPrevented()) {
                                newWindow && (newWindow.location.href = UserMgr.getParam('purl'));
                            } else {
                                e.returnValue = false;
                            }
                        },
                        onSubmitedErr: function(err) {
                            newWindow && newWindow.close();
                        }
                    };
                    var passport = window.passport || null;
                    if (!passport || !passport.pop) {
                        return;
                    }
                    loginPop = passport.pop.init(config);
                    loginPop.show();
                    (function() {
                        var plp = $('#passport-login-pop'),
                            args = arguments,
                            purl = UserMgr.getParam('purl'),
                            tip = UserMgr.getParam('tip');
                        if (plp.length && tip) {
                            setTimeout(function() {
                                $('<div id="place-login-tips" class="place-login-tips">' + tip + '</div>').appendTo(plp);
                            }, 100);
                        } else {
                            setTimeout(function() {
                                args.callee();
                            }, 10);
                        }
                    })();
                };
            baidu.phoenix.require(partnerLinks, {
                target: 'otherLogin',
                tpl: 'map',
                act: "implicit",
                u: location.href
            });

            $.ajax({
                url: url, //请求地址
                type: "get", //请求方式
                dataType: "script", //请求数据类型
                crossDomain: true, //是否跨域
                data: null,
                async: true, //是否异步请求，默认为异步
                error: function(__data) {},
                success: function(__data) {
                    loadLogin();
                }

            });
        }
    }

    /**
     * 获取登录成功后展现的HTML
     * @param {Object} userState 用户登录状态数据
     */
    function getLoginHtml(userState) {
        if (!userState) {
            return '';
        }
        var text = '',
            name = userState.uName || userState.displayname,
            email = userState.email,
            mobile = userState.mobile;

        if (name) {
            text = name;
        } else if (email || mobile) {
            text = email || mobile;
        }

        var htmls = ['<ul class="login_info"><li id="usernameInfo" class="uname mn-lk-w">'];
        if (name) {
            htmls.push('<a id="username" class="mn-lk" href="/waimai/trade/orderlist">你好，' + text + '</a>');
        } else {
            htmls.push('<a id="username" class="mn-lk" href="https:/passport.baidu.com/v2/?ucenteradduname">' + text + '</a>');
        }
        htmls.push('<div id="popUserInfoId" class="mn-tip"><div class="top-arrow"></div><ul class="mn">');
        /*if (name) {
            htmls.push('<a class="my-info" target="_blank" href="http://www.baidu.com/p/' + name + '?from=map">我的主页</a>');
        } else {
            htmls.push('<a class="my-info" target="_blank" href="https:/passport.baidu.com/v2/?ucenteradduname">我的主页</a>');
        }*/
        htmls.push('<li><a class="my-info" href="/waimai?qt=orderlist&type=wait"><span class="icon order-icon"></span>我的订单</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=addressmanage&type=select"><span class="icon address-icon"></span>送餐地址</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=myfavorite"><span class="icon favorite-icon"></span>收藏夹</a></li>');
        htmls.push('<li><a class="my-info" href="/waimai?qt=couponinfo"><span class="icon coupon-icon"></span>代金券</a></li>');
        htmls.push('<li><a class="my-info" href="/trade/refundlist"><span class="icon refund-icon"></span>我的退款</a></li>');
        htmls.push('<li><a id="logout" class="logout" href="javascript:void(0)"><span class="icon account-icon"></span>退出</a></li>');
        htmls.push('</ul></div>');
        return htmls.join('');
    }
    /**
     * 获取连接到passport各种URL
     * @param {String} action 操作类型
     * @param {Object} opts 可选参数
     */
    function getPortUrl(action, opts) {
        var temp = '',
            param = opts ? ('&' + encodeURIComponent(opts)) : '';
        switch (action) {
            case 'login':
                //登录
                temp = PASSPORT_VERSION + PASSPORT_ACTION_LOGIN;
                break;
            case 'logout':
                //退出
                temp = PASSPORT_ACTION_LOGOUT;
                break;
            default:
                break;
        }
        return PASSPORT_URL_HOST + temp + PASSPORT_TPL + encodeURIComponent(param);
    }


    // 用户管理对象
    var UserMgr = {

        /**
         * 用户登录状态 初始化
         */
        init: function() {
            var bookTimer;

            if (isInit) return;

            this.update({
                onsuccess: function() {}
            });

            // 订单
            $("#user_info").delegate(".book-order", "mouseenter.order", function() {
                var content = $(this).find(".order-list"),
                    online;

                online = UserMgr.userState && UserMgr.userState.isOnline || "0";

                bookTimer && clearTimeout(bookTimer);

                if (content.length == 0) {
                    content = $(this).append($(T_ORDER_LIST));
                }

                content.show();
                content.find(".order-list-hotel").attr("stat", "click|{da_src:inf.order_hotel, user: " + online + "}");
            }).delegate(".book-order", "mouseleave.order", function() {
                var content = $(this).find(".order-list");

                if (content.length > 0) {
                    bookTimer = setTimeout(function() {
                        content.hide();
                    }, 50);
                }
            });

            isInit = true;
        },
        /**
         * 设置查询订单的单条内容
         */
        setSearchOrder: function(html) {
            $(this).on("setlogin", function() {
                $("#user_info .book-order").html(html);
            });
            $("#user_info .book-order").html(html);
            setTimeout(function() {
                $("#user_info").undelegate(".book-order", "mouseenter.order").undelegate(".book-order", "mouseleave.order");
            }, 100);
        },
        /**
         * 更新用户登录状态 对外公开 其他模块可直接调用
         */
        update: function(opts) {
            opts = opts || {};
            this.getState(function(userState) {
                if (!userState) {
                    return;
                }
                UserMgr.userState = userState;
                var me = this,
                    callback = opts.onsuccess,
                    scope = opts.scope;
                switch (userState.isOnline) {
                    case USER_STATE_LOGIN:
                        me.isLogin(userState);
                        break;
                    case USER_STATE_LOGOUT:
                        me.isLogout(userState);
                        break;
                }
                //回调函数
                if (opts && callback && scope) {
                    callback.call(scope, userState);
                }
            });
        },
        /**
         * 获取当前用户登录状态 对外公开 其他模块可直接调用
         * @param {Function} cbk 回调函数 必选
         */
        getState: function(cbk) {
            $.ajax({
                url: USER_STATE_API, //请求地址
                type: "get", //请求方式
                dataType: "jsonp", //请求数据类型
                crossDomain: true, //是否跨域
                data: null,
                async: true, //是否异步请求，默认为异步
                error: function() {},
                success: function(__data) {
                    UserMgr._getState(__data)
                }

            });
            this._getStateCBK = cbk;
        },

        /**
         * 获取用户登录状态 内部callback调用
         * @param {Object} state 用户登录状态数据
         */
        _getState: function(userState) {
            if (userState) {
                this._getStateCBK && this._getStateCBK(userState)
            }
        },

        // 绑定相关事件
        bindEvents: function() {
            var me = this;
            var mouseout = function() {
                me.tipTimer = setTimeout(function() {
                    $('#popUserInfoId').css('visibility', 'hidden');
                }, 200);
            };

            $('#username').on('mouseover', function(e) {
                $('#popUserInfoId').css({"display":"none","visibility":"visible"}).fadeIn();
            });
            $('#popUserInfoId').on('mouseover', function(e) {
                win.clearTimeout(me.tipTimer);
            });
            $('#username').on('mouseout', mouseout);
            $('#popUserInfoId').on('mouseout', mouseout);
            $('#logout').on('click', function(e) {
                UserMgr.logout();
                return false;
            });
        },

        //添加用户登录部分
        addLoginEvt: function() {
            var me = this;
            $("#login").off("click").on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                // 删除key
                me.removeAll();
                //显示登录浮窗                             
                me.login();
            });
        },

        /**
         * 登录 对外公开 其他模块可直接调用
         * @modifydate
         * @param {Object} opts 可选参数
         * @opts.onSuccess 成功回调函数 暂时不用
         * @opts.url       成功跳转地址
         * @opts.isOnline  如果为true则强制显示登录窗口
         *
         */
        login: function(opts) {
            opts = opts || {};

            /*  by jason.zhou  和龚伟沟通后 注释掉
            if (!opts.isOnline) {
                showV3Pass(opts);
                return;
            }
            */
            if (UserMgr.userState && UserMgr.userState.isOnline == '0') {
                showV3Pass(opts);
            } else {
                opts.url && (location.href = opts.url);
            }
        },

        /**
         * 退出登录 对外公开 其他模块可直接调用
         */
        logout: function() {
            win.location.href = getPortUrl('logout', {
                u: win.location.href
            });
        },

        /**
         * 设置登录成功后的状态
         * @param {Object} userState 用户登录状态数据
         */
        isLogin: function(userState) {
            var me = this,
                logout_info = $('#logout_user_info'),
                login_info = $('#login_user_info');
            if (logout_info) {
                logout_info.hide();
            }
            if (login_info) {
                login_info.show();
                login_info.html(getLoginHtml(userState));
            }
            $(me).trigger("setlogin");
            //绑定事件
            this.bindEvents();
        },

        /**
         * 设置未登录时的状态
         * @param {Object} userState 用户登录状态数据
         */
        isLogout: function(userState) {
            var me = this,
                logout_info = $('#logout_user_info'),
                login_info = $('#login_user_info');
            if (logout_info) {
                logout_info.show();
            }
            if (login_info) {
                login_info.hide();
            }
            //添加用户登录事件
            this.addLoginEvt();
        },

        /**
         * 不同的登录方式
         */
        clickPage: function(type, pageID) {
            if (type == "normal") { //普通登录
                $("#loginIframe_iph" + pageID).hide();
                $("#passports" + pageID).show();
                $("#normal_login" + pageID).addClass("login_hover");
                $("#phone_login" + pageID).removeClass("login_hover");
            } else if (type == "iph") { //手机登录
                $("#loginIframe_iph" + pageID).show();
                $("#passports" + pageID).hide();
                $("#phone_login" + pageID).addClass("login_hover");
                $("#normal_login" + pageID).removeClass("login_hover");
            }
        },
        /**
         * 设置参数
         */
        setParam: function(key, value) {
            param[key] = value;
        },
        /**
         * 得到对应key的值
         */
        getParam: function(key) {
            return param[key];
        },
        /**
         * 删除参数指定key
         */
        removeParam: function(keys) {
            for (var i = 0, key; key = keys[i]; i++) {
                delete param[key];
            }
        },
        /**
         * 删除所有key
         */
        removeAll: function() {
            param = {};
        }
    };

    module.exports = UserMgr;
})(window);
 
});