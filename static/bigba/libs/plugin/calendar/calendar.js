define("bigba:static/libs/plugin/calendar/calendar.js", function(require, exports) {
/**
 * @require bigba:static/libs/plugin/calendar/calendar.less
 * @class Calendar 日历控件类
 * 日历控件
 * @constructor
 * @param {object} op                         配置参数
 * @paran {bool}   [op.disableHolidays=false] 关闭假期的显示, 默认false
 * @author jason.zhou
 * @date 2013.01.14
 * @description 迁移至fis后，去除了tangram依赖加入jq依赖
 */ 
function Calendar(op) {
    var f = function(){},
        o = this,
        date = new Date(),
        div = document.createElement('div'), // 日期元素
        holidays;

    date = [date.getFullYear(), date.getMonth()+1, date.getDate()];

    holidays = [
        {
            name: "元旦",
            date: "(.*)-01-01"
        },
        {
            name: "情人",
            date: "(.*)-02-14"
        },
        {
            name: "五一",
            date: "(.*)-05-01"
        },
        {
            name: "国庆",
            date: "(.*)-10-01"
        },
        {
            name: "除夕",
            date: "2014-01-30"
        },
        {
            name: "春节",
            date: "2014-01-31",
            detail: [
                {
                    date: "2014-01-26",
                    desc: "班",
                    color : "#676767"
                },
                {
                    date: "2014-01-31",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-01",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-02",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-03",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-04",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-05",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-06",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-02-08",
                    desc: "班",
                    color : "#676767"
                }
            ]
        },
        {
            name: "清明",
            date: "2014-04-05",
            detail: [
                {
                    date: "2014-04-05",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-04-06",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-04-07",
                    desc: "休",
                    color : "#ff8a16"
                }
            ]
        },
        {
            name: "五一",
            date: "2014-05-01",
            detail: [
                {
                    date: "2014-05-01",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-05-02",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-05-03",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-05-04",
                    desc: "班",
                    color : "#676767"
                }
            ]
        },
        {
            name: "端午",
            date: "2014-06-02",
            detail: [
                {
                    date: "2014-05-31",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-06-01",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-06-02",
                    desc: "休",
                    color : "#ff8a16"
                }
            ]
        },
        {
            name: "七夕",
            date: "2014-08-02"
        },
        {
            name: "中秋",
            date: "2014-09-08",
            detail: [
                {
                    date: "2014-09-06",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-09-07",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-09-08",
                    desc: "休",
                    color : "#ff8a16"
                }
            ]
        },
        {
            name: "国庆",
            date: "2014-10-01",
            detail: [
                {
                    date: "2014-10-01",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-02",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-03",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-04",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-05",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-06",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-10-07",
                    desc: "休",
                    color : "#ff8a16"
                },
                {
                    date: "2014-9-28",
                    desc: "班",
                    color : "#676767"
                },
                {
                    date: "2014-10-11",
                    desc: "班",
                    color : "#676767"
                }
            ]
        }
    ];

    if (op.holidays) {
        holidays = holidays.concat(op.holidays);
    }

    // 不显示休假
    if (op.disableHolidays) {
        holidays = [];
    }
    
    if(op.element){
        this.G(op.element).appendChild(div);
    }else{
        document.body.appendChild(div);
    }
    //配置项
    this.op = {
        element : op.element,                    //显示日历的元素，默认插入body
        date : op.date || date,                    //用于显示"今天"的日期
        today : op.today || date,
        count : op.count || 1,                    //显示月份的个数
        ableArr : op.ableArr || "all",           //可选择日期的数组，优先级高于between
        between : op.between || [0,99999999],    //可以选择日期的区间
        input : this.G(op.input) || null,        //绑定input
        position : this.G(op.position),            //判断日历应该显示的位置
        onStart : op.onStart || f,                //初始化完成回调
        onShow: op.onShow || f,                    //显示时调用
        onHide: op.onHide || f,                    //隐藏时调用
        onSelectDay : op.onSelectDay || f,        //选择日期时调用
        onChange : op.onChange || f,            //日期有变化的时候调用
        toInput : op.toInput,                    //如用户自定义toInput函数，则不会执行默认的this.toInput,参数(date,week)
        formInput : op.formInput,                //自定义fromInput，参数为input
        holidays: holidays
    };
    this.cache = {                                //缓存一些结点引用和值
        cal : div,                                //包容整个日历的结点
        input : this.op.input,
        position : this.op.position || this.op.input,
        date : this.date(this.op.date),
        cur_date : [0,0,1],                        //当前显示的月份
        count : this.op.count,
        ableArr:this.op.ableArr,                //可用日历数组                    
        between:this.op.between,                //可用日历范围
        iframeHeight : null,                    //iframe高度，用来遮住select
        iframeWidth : null,                        //iframe宽度
        cells:[],                                //缓存日期单元格结点引用
        heads:[],                                //缓存月份标题结点
        btns:[],                                    //控制按钮
        holidays: this.op.holidays                   // 节日数组
    };    

    if(this.cache.input){                        
        this.addEvent(document.body,'mousedown',function(e){
            o.hide();
        });

        this.addEvent(this.cache.cal,'mousedown',function(e){
            return false;
        },true);

        var f =function(){
            if(o.op.formInput){
                o.op.formInput.call(o,o.cache.input);
            }else{
                o.formInput.call(o,o.cache.input);
            }
        };
        o.addEvent(o.cache.input,['click'],f,true);
        this.hide();                            //如果绑定了input，则先把日历隐藏一下
    }

    this.op.onStart.call(this,this.cache.cal);    //调用onStart,传入日历的结点引用作为参数,this为实例

    this.initHtml();
}

Calendar.prototype = {
    conf:{
        day_text:['日','一','二','三','四','五','六'],    //周几
        cal_text:['年','月','日'],                        //年月日
        cal_class:'op_cal',                                //最外层结点className
        month_class_pre : 'op_mon_pre',                    //每个月份的日历className前缀
        month_class : 'op_mon',                            //月份className
        day_class:['op_mon_pre_month','op_mon_cur_month','op_mon_next_month','op_mon_today','op_mon_day_hover','op_mon_day_selected','op_mon_day_disabled', 'op_mon_day_holiady'],//上月、本月、下月、今天、鼠标移上、选中、不可选, 节日状态的className
        btn_class:['op_btn_pre_month','op_btn_next_month']    //按钮的className
    },
    IE:/msie/.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),
    G:function(id){                                        //G
        if(typeof id == 'string')
            return document.getElementById(id);
        return id;
    },
    hasClass:function(v,cName){                            //是否有className
        var cs = v.className.split(/s+/);
        for(var i=0;i<cs.length;i++){
            if(cName == cs[i]) return true;
        }
        return false;
    },
    addClass:function(v,cName){                            //增加className
        if(!this.hasClass(v,cName)){
            if(v.className==''){
                v.className=cName;
            }else{
                v.className += ' '+cName;
            }
        }
    },
    removeClass:function(v,cName){                        //删除className
        var cs = v.className.split(/\s+/);
        for(var i=0;i<cs.length;i++){
            if(cName == cs[i]){
                cs.splice(i,1);
            };
        }
        v.className = cs.join(' ');
    },
    each:function(o,fn){                                //each
        for(var i=0,l=o.length;i<l;i++){
            fn.apply(o[i],[i,o[i]]);
        }
    },

    addEvent:function(el, eventName,fn,cb){
        var f = function(e){
            e = window.event || e;
            if(cb){
                if(e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
            }
            fn.call(el,e);
        };
        var a = [].concat(eventName);
        this.each(a,function(i,eName){
            if(document.attachEvent) el.attachEvent('on'+eName,f);
            else el.addEventListener(eName,f,false);
        });
    },

    days: function(date){                                //取得传入的日期的一个月日期数组，包括三个小数组：上月、本月、下月日期
        date = this.date(date);
        var y,m,pre_m,pre_d,next_m,Ms,Me,Mn,l,weeks,days=[[],[],[]];
        y = date[0];
        m = date[1];
        Ms = new Date(y,m-1,0);
        Me = new Date(y,m,0);
        Mn = new Date(y,m,1);
        l = Me.getDate();
        pre_m = Ms.getMonth()+1;
        pre_d = Ms.getDate();
        next_m = Mn.getMonth()+1;
        y = Me.getFullYear();
        m = Me.getMonth()+1;
        var y1=Ms.getFullYear(),y2=Mn.getFullYear();
        for(var i=Ms.getDay();i>=0;i--,pre_d--){
            days[0].unshift([y1,T(pre_m),T(pre_d)].join(''));
        }
        for(var i=1;i<=l;i++){
            days[1].push([y,T(m),T(i)].join(''));
        }
        for(var i=1,j=Me.getDay(),k=(days[0].length+days[1].length<36)?14-j:7-j;i<k;i++){
            days[2].push([y2,T(next_m),T(i)].join(''));
        }
        return days;

        function T(n){return ('0'+n).slice(-2);}
    },

    date : function(date){        //格式化一下日期的参数，变成数组形式
        if(typeof date == "string" || typeof date == "number"){
            date = date.toString().match(/^(\d+)(\d\d)(\d\d)$/);
            date.shift();
        }
        var d = new Date(date[0],date[1]-1,date[2]);
        return [d.getFullYear(),d.getMonth()+1,d.getDate()];
    },

    /**
     * 将类似 20130107 这样的数据转换为标准日期
     */
    dateParse: function (date) {
        if(typeof date == "string" || typeof date == "number"){
            date = date.toString().match(/^(\d+)(\d\d)(\d\d)$/);
            date.shift();
        }
        return new Date(date[0], date[1] - 1, date[2]);
    },

    initHtml:function(){        //初始化日历的html
        var html=['<iframe src="about:blank" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;z-index:-1;left:0;top:0;width:1;height:1;"></iframe><table cellspacing="0" cellpadding="0" border="0" class="',this.conf.cal_class,'"><tr>'];
        for(var i=0;i<this.cache.count;i++){
            html.push('<td class="',this.conf.month_class_pre,i+1,'">',
                '<div class="',this.conf.month_class,'"><h5>',
                i == 0 ? ('<span class="'+this.conf.btn_class[0]+'"></span>') : '',
                i == (this.cache.count-1) ? ('<span class="'+this.conf.btn_class[1]+'"></span>') : '',
                '<strong></strong></h5><table width="100%" cellspacing="0"><tr>'
            );

            for(var m=0;m<7;m++){
                html.push('<th>',this.conf.day_text[m],'</th>');
            }

            html.push('</tr>');

            for(var j=0;j<6;j++){
                html.push('<tr>');
                for(var k=0;k<7;k++){
                    html.push('<td week="',k,'"></td>');
                }
                html.push('</tr>');
            }
            
            html.push('</table></div></td>');
        }

        html.push('</tr></table>');
        
        //缓存主要的dom结点引用
        var c = this.cache;
        c.cal.innerHTML = html.join('');
        this.each(c.cal.getElementsByTagName('td'),function(i,td){
            if(td.getAttribute('week'))
                c.cells.push(td);
        });

        this.each(c.cal.getElementsByTagName('strong'),function(i,h5){
            c.heads.push(h5);
        });

        this.each(c.cal.getElementsByTagName('span'),function(i,span){
            c.btns.push(span);
        });

        this.setHtml(this.cache.date.concat());                //复制一下数组，要不就引用了 +_+
        this.setEvent();
    },

    setHtml: function (date) {        //设置整个日历的html
        var days = [], cursor = 0 , c = this.cache, o = this,
            tdate, hasHoliady, cacheHoliadys = [];

        date = this.date(date);
        c.cur_date[0] = date[0];
        c.cur_date[1] = date[1];

        // 获取今天的日期
        tdate = o.date(o.op.today);
        tdate = ''+tdate[0]+('0'+tdate[1]).slice(-2)+('0'+tdate[2]).slice(-2);

        // 生成日期
        for (var i=0; i<c.count; i++) {
            days.push(this.days([c.cur_date[0], c.cur_date[1] + i, 1]));
        }

        // 生成日期对应的 html
        for (var j=0; j<c.count; j++) {
            var ymd = days[j][1][0].toString().match(/^(\d+)(\d\d)(\d\d)$/);

            c.heads[j].innerHTML = ymd[1] + o.conf.cal_text[0] + ymd[2]+o.conf.cal_text[1];

            for (var k=0; k<3; k++) {
                for (var m=0; m<days[j][k].length; m++) {
                    hasHoliady = this.generateTd(c.cells[cursor], k, days[j][k][m], tdate);

                    if (hasHoliady) {
                        cacheHoliadys = cacheHoliadys.concat(hasHoliady);
                    }

                    cursor++;
                }
            }
        }

        // 生成节假日描述
        $.each(cacheHoliadys, function () {
            var dateStr = this.date.match(/^(\d+)-(\d\d)-(\d\d)/),
                td;

            if (dateStr && dateStr.length == 4) {
                dateStr = dateStr[1] + dateStr[2] + dateStr[3];

                td = $(o.cache.cal).find("[date=" + dateStr + "] ");

                if (td.length > 0 && !td.hasClass(o.conf.day_class[6])) {
                    td.css("position", "relative");
                    td.find(".op_mon_day_holiady_icon").remove();
                    $('<i class="op_mon_day_holiady_icon">' + this.desc + '</i>').css("color", this.color || "").appendTo(td);
                }
            }
        });

        this.op.onChange.call(this);
    },

    /**
     * 获取显示的日期
     * @param {object} td    td 对象
     * @param {string} type  日期的类型
     * @param {string} date  显示的日期 
     * @param {string} tdate 今天
     */
    generateTd: function (td, type, date, tdate) {
        var cache = this.cache,
            conf = this.conf,
            dateObj, dateStr, hasHoliady;

        td = $(td);
        dateObj = this.dateParse(date);

        // 第一步, 生成 html
        if (date == tdate) {
            td.html('<a href="javascript:void(0);">今天</a>');
        } else {
            td.html('<a href="javascript:void(0);">' + date.slice(-2) + '</a>');
        }

        // 第二步, 设置样式
        td.prop("class", conf.day_class[type]);
        if (date == tdate) {
            td.addClass(conf.day_class[3]);
        }
        if (date < cache.between[0] || date > cache.between[1]) {
            td.addClass(conf.day_class[6]);
        }
        //如果不在可用数组中也要至灰
        if (cache.ableArr != "all" && $.inArray(date, cache.ableArr) == -1) {
            td.addClass(conf.day_class[6]);
        }

        // 第四部 处理节日
        if (dateObj.getDay() == 0 || dateObj.getDay() == 6) {
            td.addClass(conf.day_class[7]);   
        }

        try {
            $.each(cache.holidays, function () {
                var reg;

                reg = new RegExp(this.date);
                dateStr = /^(\d{4})(\d{2})(\d{2})/.exec(date).slice(1).join("-");

                if (reg.test(dateStr)) {
                    td.find(".op_mon_day_holiady_name").remove();
                    td.css("position", "relative").append([
                        '<a class="op_mon_day_holiady_name" style="position: absolute; left: 0; top: 0;" href="javascript:void(0);">',
                            this.name,
                        '</a>'
                    ].join(""));
                    td.addClass(conf.day_class[7]).prop("title", this.title);
                    hasHoliady = this;
                }
            });
        } catch (e) {
            // 不要影响逻辑
        }

        // 第三步，设置属性
        td.attr('date', date);

        return hasHoliady && hasHoliady.detail;
    },

    setEvent : function(){        //增加事件
        var cName = this.conf.day_class;
        var o = this;
        var fn = {
            'normal' : {
                'mouseover' : function(){
                    o.addClass(this,cName[4]);

                    if ($(this).hasClass("op_mon_day_holiady")) {
                        $(this).find(".op_mon_day_holiady_name").slideUp("fast");
                    }
                },

                'mouseout' : function(){
                    o.removeClass(this,cName[4]);

                    if ($(this).hasClass("op_mon_day_holiady")) {
                        $(this).find(".op_mon_day_holiady_name").slideDown("fast");
                    }
                },

                'click' : function(date,week){
                    if(o.cache.selected){
                        o.removeClass(o.cache.selected,cName[5]);
                    }
                    o.cache.selected = this;
                    o.addClass(this,cName[5]);
                    if(o.cache.input){
                        if(o.op.toInput){
                            o.op.toInput.call(o,date,week);
                        }else{
                            o.toInput.call(o,date,week);
                        }
                    }
                    o.op.onSelectDay.call(o,date,week);
                }
            },

            'disable' : {
                'mouseover' : function(){
                    return false;
                },

                'mouseout' : function(){
                    return false;
                },

                'click' : function(date,week){
                    return false;
                }
            },
            'btn' : {
                0 : function(){
                    o.preMonth();
                },

                1 : function(){
                    o.nextMonth();
                }
            }
        };

        //按钮
        this.each(this.cache.btns,function(i,btn){
            btn.onclick = function(){
                fn['btn'][i].call(btn);
            };
        });

        //每个日期事件
        this.each(this.cache.cells, function(i, td) {
            $(td).on("mouseenter", function () {
                fn[getStatus(td)].mouseover.call(td);
            });

            $(td).on("mouseleave", function () {
                fn[getStatus(td)].mouseout.call(td);
            });

            $(td).on("click", function (e) {
                var date = td.getAttribute('date') - 0,
                    week = td.getAttribute('week') - 0;

                fn[getStatus(td)].click.call(td,date,week);

                return false;
            });
        });

        function getStatus(td){
            var date = td.getAttribute('date')-0,res='normal';
            if(o.cache.ableArr !="all" && o.cache.ableArr.length){res = ($.inArray(""+date,o.cache.ableArr)!=-1) ? 'normal' : 'disable';return res;}
            return (date<=o.cache.between[1] && date>=o.cache.between[0]) ? 'normal' : 'disable';;
        }
    },

    //显示
    show:function(){
        var c = this.cache;
        if(c.input){
            var style = {position:'absolute',zIndex:'10'};
            var p = c.position,
                x = $(p).offset().left,
                y = $(p).offset().top + $(p).outerHeight();
            
            var xx = 0, yy = -1;
            style.left = x + xx + 'px';
            style.top = y + yy + 'px';
            for(var i in style){
                c.cal.style[i] = style[i];
            }
            c.iframeHeight = this.cache.cal.offsetHeight;
            c.iframeWidth = this.cache.cal.offsetWidth;
            var iframe = c.cal.getElementsByTagName('iframe')[0];
            iframe.style.height = c.iframeHeight + 'px';
            iframe.style.width = c.iframeWidth + 'px';
        }
        this.cache.cal.style.display = 'block';
        this.op.onShow.call(this,this.cache.cal);
        function styleValue(el, key){
            if(el.currentStyle){
                return el.currentStyle[key];
            }else{
                return document.defaultView.getComputedStyle(el,null)[key];
            }
        }
    },

    //隐藏
    hide:function(){
        this.cache.cal.style.display = 'none';
        this.op.onHide.call(this,this.cache.cal);
    },

    nextMonth:function(){
        this.cache.cur_date[1] ++;
        this.setHtml(this.cache.cur_date);
    },

    preMonth:function(){
        this.cache.cur_date[1] --;
        this.setHtml(this.cache.cur_date);
    },

    nextYear:function(){
        this.cache.cur_date[0] ++;
        this.setHtml(this.cache.cur_date);
    },

    preYear:function(){
        this.cache.cur_date[0] --;
        this.setHtml(this.cache.cur_date);
    },

    setBetween:function(b){
        this.cache.between = b;
        this.setHtml(this.cache.cur_date);
    },
    setAbleArr:function(b){
        this.cache.ableArr = b;
        this.setHtml(this.cache.cur_date);
    },

    isCurMonth:function(date){
        var date = this.date(date);
        if(this.cache.cur_date[0]==date[0] && this.cache.cur_date[1]==date[1])
            return true;
        return false;
    },

    //对某一天进行设置
    setDay:function(date, opt){
        var td = null;
//        if(!this.isCurMonth(date)){
//            this.setHtml(date);
//        }
        date = [].concat(date);
        this.each(date,function(i,v){
            date[i] = v.toString();
        });
        var tds = this.cache.cells;
        for(var i=0, l=tds.length; i<l; i++){
            for(var j=0; j<date.length; j++){
                if (tds[i].getAttribute('date') == date[j]) {
                    if ($(tds[i]).hasClass(this.conf.day_class[1])) {
                        td = tds[i];
                        this.addClass(td,'op_cell_seledted');
                    }
                }
            }
        };
    },

    //日历值传入input
    toInput:function(date,week){
        var input = this.cache.input;
        date = date.toString().match(/^(\d+)(\d\d)(\d\d)$/);
        var value = date[1]+'-'+date[2]+'-'+date[3]+'('+'周'+this.conf.day_text[week]+')';
        if(input.tagName.toLowerCase() == 'input'){
            input.value = value;
        }else{
            input.innerHTML = value;
        }
        this.hide();
    },

    //从input传到日历
    formInput : function(input){
        var s,c=this.cache;
        if(input.tagName.toLowerCase()=='input'){
            s = input.value;
        }else{
            s = input.innerHTML;
        }
        var date = s.match(/^(\d+)-(\d\d)-(\d\d)/);
        if(date && date.length==4){
            date.shift();
            if(!this.isCurMonth(date)){
                this.setHtml(date);
            }
        }
        this.show();
    }
};
exports.Calendar = Calendar;
});