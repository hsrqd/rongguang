define('bigba:widget/selectcar/usecar/usecar.js', function(require, exports, module){ var cal = require("bigba:static/libs/plugin/calendar/calendar.js");
var def_cal_option ={
    onSelectDay:function(date,week){
        console.log(date);
        console.log(week);
    },
    disableHolidays:true
}; 
function initcalendar(){
    var cal_1 = new cal.Calendar($.extend({
        input:"from_date"
    },def_cal_option));
    var cal_2 = new cal.Calendar($.extend({
        input:"back_date"
    },def_cal_option));
}
function initcarnumber(list){
    list.each(function(index,ele){
        $(this).click(function(e){
            var $par = $(e.currentTarget);
            var act = $(e.target).attr("data-node");
            var _input = $par.find("[data-node=input]");
            var _num = parseInt(_input.val());
            if(act == "add"){
                _input.val(++_num);
            }else if(act == "minus"){
                if(_num<=0){
                    _input.val(0);
                    return;
                }
                _input.val(--_num);
            }
            //alert($dom.attr("data-node"));
        });
    });
}

module.exports = Widget.extend({
    el: '#widget-selectcar-usecar',
    events: {
        'click [data-node=nextBtn]': 'nextBtnClick'
    },
    init : function() {
        var carNumberList = this.$el.find("[data-node=selectNum]");
        initcarnumber(carNumberList);
        this.initcalendar();
        this.initbacktips();
    },
    initcalendar: function(){
        var me = this;
        var carWay = me.$el.find("[data-node=carway]");
        var backLabel = me.$el.find("[data-node=back_date]");
        carWay.click(function(e){
            var _val = $(e.target).val();
            if(_val == 1){
                backLabel.addClass("disable").find("input,select").attr("disabled",true);
            }else if(_val ==2){
                backLabel.removeClass("disable").find("input,select").attr("disabled",false);
            }
        });
    },
    initbacktips: function(){
        var me = this;
        var backtips = me.$el.find("[data-node=blacktips]");
        var _input = me.$el.find("[data-node=selecttip]");
        var selectArr = [];
        backtips.on("click",".blacktip",function(e){
            var selectArr = [];
            var _dom = $(e.currentTarget);
            _dom.toggleClass("select");
            backtips.find(".select").each(function(index,ele){
                selectArr.push($(ele).text());
            });
            _input.val(selectArr.join("-"));
        });
    },
    nextBtnClick: function(){

    }
});
 
});