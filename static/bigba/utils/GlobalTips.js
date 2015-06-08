define('bigba:static/utils/GlobalTips.js', function(require, exports, module){ /**
 * 全局信息提示框
 * @author jason.zhou
 * @date 2014-02-20
 */
var FixElement,
    fix,
    fixEl,
    timerid,
    TIMEOUT = 3000,    // 停留时间
    HEADER_HEIGHT = 82;
    SELF_HEIGHT = 45;// 顶部高度

FixElement = require("jsmod/ui/fixElement");

fix = new FixElement('<div class="global-tips"><span class="gt-msg"></span></div>', {
    targetType: 'top',
    zIndex: 3000,
    preventShow: true
});

fixEl = fix.getElement();

/**
 * 隐藏
 */
function fixHide() {
    timerid && clearTimeout(timerid);
    fix.fixTo("#content", "top", {top: 0});
    fix.hide();
}
/**
 * 显示
 */
function fixShow(pos) {
    var stop = $(window).scrollTop();
    var topV = stop > HEADER_HEIGHT ? (stop - HEADER_HEIGHT + SELF_HEIGHT + 20) : (SELF_HEIGHT + 1);
    var posParam = {top: topV};
    if (pos === 'top') {
        posParam = {top: stop}
    }
    fix.show();
    fix.fixTo("#content", "top", posParam);
}

$(window).on('scroll.globaltips', function() {
    fixHide();
});

// 添加close事件
$('.global-tips .close-btn').on('click', function() {
    fixHide();
});

module.exports = {
    tip : function(msg, pos) {
        timerid && clearTimeout(timerid);
        fixEl.find('.gt-msg').html(msg);

        fix.redraw();
        fixShow(pos);

        timerid = setTimeout(function() {
            fixHide();
        }, TIMEOUT);
    },
    topTip: function(msg, mask) {
        if (mask) {
            fixEl.addClass('reverse');
        } else {
            fixEl.removeClass('reverse')
        }
        this.tip(msg, 'top');
    },
    hide: function() {
        fixHide();
    }
};
 
});