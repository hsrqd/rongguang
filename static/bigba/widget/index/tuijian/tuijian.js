define('bigba:widget/index/tuijian/tuijian.js', function(require, exports, module){ module.exports = Widget.extend({
    el: '#widget-recommend',
    events: {
        'click .box': 'goCarGroup'
    },
    init: function() {
        //debugger
    },
    goCarGroup:function(){
    	window.location.href = "/car/group";
    }
});
 
});