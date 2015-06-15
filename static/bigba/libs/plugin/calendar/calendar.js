define("bigba:static/libs/plugin/calendar/calendar.js",function(t,e){function a(t){var e,a=function(){},n=this,o=new Date,s=document.createElement("div");if(o=[o.getFullYear(),o.getMonth()+1,o.getDate()],e=[{name:"元旦",date:"(.*)-01-01"},{name:"情人",date:"(.*)-02-14"},{name:"五一",date:"(.*)-05-01"},{name:"国庆",date:"(.*)-10-01"},{name:"除夕",date:"2014-01-30"},{name:"春节",date:"2014-01-31",detail:[{date:"2014-01-26",desc:"班",color:"#676767"},{date:"2014-01-31",desc:"休",color:"#ff8a16"},{date:"2014-02-01",desc:"休",color:"#ff8a16"},{date:"2014-02-02",desc:"休",color:"#ff8a16"},{date:"2014-02-03",desc:"休",color:"#ff8a16"},{date:"2014-02-04",desc:"休",color:"#ff8a16"},{date:"2014-02-05",desc:"休",color:"#ff8a16"},{date:"2014-02-06",desc:"休",color:"#ff8a16"},{date:"2014-02-08",desc:"班",color:"#676767"}]},{name:"清明",date:"2014-04-05",detail:[{date:"2014-04-05",desc:"休",color:"#ff8a16"},{date:"2014-04-06",desc:"休",color:"#ff8a16"},{date:"2014-04-07",desc:"休",color:"#ff8a16"}]},{name:"五一",date:"2014-05-01",detail:[{date:"2014-05-01",desc:"休",color:"#ff8a16"},{date:"2014-05-02",desc:"休",color:"#ff8a16"},{date:"2014-05-03",desc:"休",color:"#ff8a16"},{date:"2014-05-04",desc:"班",color:"#676767"}]},{name:"端午",date:"2014-06-02",detail:[{date:"2014-05-31",desc:"休",color:"#ff8a16"},{date:"2014-06-01",desc:"休",color:"#ff8a16"},{date:"2014-06-02",desc:"休",color:"#ff8a16"}]},{name:"七夕",date:"2014-08-02"},{name:"中秋",date:"2014-09-08",detail:[{date:"2014-09-06",desc:"休",color:"#ff8a16"},{date:"2014-09-07",desc:"休",color:"#ff8a16"},{date:"2014-09-08",desc:"休",color:"#ff8a16"}]},{name:"国庆",date:"2014-10-01",detail:[{date:"2014-10-01",desc:"休",color:"#ff8a16"},{date:"2014-10-02",desc:"休",color:"#ff8a16"},{date:"2014-10-03",desc:"休",color:"#ff8a16"},{date:"2014-10-04",desc:"休",color:"#ff8a16"},{date:"2014-10-05",desc:"休",color:"#ff8a16"},{date:"2014-10-06",desc:"休",color:"#ff8a16"},{date:"2014-10-07",desc:"休",color:"#ff8a16"},{date:"2014-9-28",desc:"班",color:"#676767"},{date:"2014-10-11",desc:"班",color:"#676767"}]}],t.holidays&&(e=e.concat(t.holidays)),t.disableHolidays&&(e=[]),t.element?this.G(t.element).appendChild(s):document.body.appendChild(s),this.op={element:t.element,date:t.date||o,today:t.today||o,count:t.count||1,ableArr:t.ableArr||"all",between:t.between||[0,99999999],input:this.G(t.input)||null,position:this.G(t.position),onStart:t.onStart||a,onShow:t.onShow||a,onHide:t.onHide||a,onSelectDay:t.onSelectDay||a,onChange:t.onChange||a,toInput:t.toInput,formInput:t.formInput,holidays:e},this.cache={cal:s,input:this.op.input,position:this.op.position||this.op.input,date:this.date(this.op.date),cur_date:[0,0,1],count:this.op.count,ableArr:this.op.ableArr,between:this.op.between,iframeHeight:null,iframeWidth:null,cells:[],heads:[],btns:[],holidays:this.op.holidays},this.cache.input){this.addEvent(document.body,"mousedown",function(){n.hide()}),this.addEvent(this.cache.cal,"mousedown",function(){return!1},!0);var a=function(){n.op.formInput?n.op.formInput.call(n,n.cache.input):n.formInput.call(n,n.cache.input)};n.addEvent(n.cache.input,["click"],a,!0),this.hide()}this.op.onStart.call(this,this.cache.cal),this.initHtml()}a.prototype={conf:{day_text:["日","一","二","三","四","五","六"],cal_text:["年","月","日"],cal_class:"op_cal",month_class_pre:"op_mon_pre",month_class:"op_mon",day_class:["op_mon_pre_month","op_mon_cur_month","op_mon_next_month","op_mon_today","op_mon_day_hover","op_mon_day_selected","op_mon_day_disabled","op_mon_day_holiady"],btn_class:["op_btn_pre_month","op_btn_next_month"]},IE:/msie/.test(navigator.userAgent.toLowerCase())&&!/opera/.test(navigator.userAgent.toLowerCase()),G:function(t){return"string"==typeof t?document.getElementById(t):t},hasClass:function(t,e){for(var a=t.className.split(/s+/),n=0;n<a.length;n++)if(e==a[n])return!0;return!1},addClass:function(t,e){this.hasClass(t,e)||(""==t.className?t.className=e:t.className+=" "+e)},removeClass:function(t,e){for(var a=t.className.split(/\s+/),n=0;n<a.length;n++)e==a[n]&&a.splice(n,1);t.className=a.join(" ")},each:function(t,e){for(var a=0,n=t.length;n>a;a++)e.apply(t[a],[a,t[a]])},addEvent:function(t,e,a,n){var o=function(e){e=window.event||e,n&&(e.stopPropagation?e.stopPropagation():e.cancelBubble=!0),a.call(t,e)},s=[].concat(e);this.each(s,function(e,a){document.attachEvent?t.attachEvent("on"+a,o):t.addEventListener(a,o,!1)})},days:function(t){function e(t){return("0"+t).slice(-2)}t=this.date(t);var a,n,o,s,c,i,l,d,h,r=[[],[],[]];a=t[0],n=t[1],i=new Date(a,n-1,0),l=new Date(a,n,0),d=new Date(a,n,1),h=l.getDate(),o=i.getMonth()+1,s=i.getDate(),c=d.getMonth()+1,a=l.getFullYear(),n=l.getMonth()+1;for(var f=i.getFullYear(),u=d.getFullYear(),p=i.getDay();p>=0;p--,s--)r[0].unshift([f,e(o),e(s)].join(""));for(var p=1;h>=p;p++)r[1].push([a,e(n),e(p)].join(""));for(var p=1,m=l.getDay(),_=r[0].length+r[1].length<36?14-m:7-m;_>p;p++)r[2].push([u,e(c),e(p)].join(""));return r},date:function(t){("string"==typeof t||"number"==typeof t)&&(t=t.toString().match(/^(\d+)(\d\d)(\d\d)$/),t.shift());var e=new Date(t[0],t[1]-1,t[2]);return[e.getFullYear(),e.getMonth()+1,e.getDate()]},dateParse:function(t){return("string"==typeof t||"number"==typeof t)&&(t=t.toString().match(/^(\d+)(\d\d)(\d\d)$/),t.shift()),new Date(t[0],t[1]-1,t[2])},initHtml:function(){for(var t=['<iframe src="about:blank" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;z-index:-1;left:0;top:0;width:1;height:1;"></iframe><table cellspacing="0" cellpadding="0" border="0" class="',this.conf.cal_class,'"><tr>'],e=0;e<this.cache.count;e++){t.push('<td class="',this.conf.month_class_pre,e+1,'">','<div class="',this.conf.month_class,'"><h5>',0==e?'<span class="'+this.conf.btn_class[0]+'"></span>':"",e==this.cache.count-1?'<span class="'+this.conf.btn_class[1]+'"></span>':"",'<strong></strong></h5><table width="100%" cellspacing="0"><tr>');for(var a=0;7>a;a++)t.push("<th>",this.conf.day_text[a],"</th>");t.push("</tr>");for(var n=0;6>n;n++){t.push("<tr>");for(var o=0;7>o;o++)t.push('<td week="',o,'"></td>');t.push("</tr>")}t.push("</table></div></td>")}t.push("</tr></table>");var s=this.cache;s.cal.innerHTML=t.join(""),this.each(s.cal.getElementsByTagName("td"),function(t,e){e.getAttribute("week")&&s.cells.push(e)}),this.each(s.cal.getElementsByTagName("strong"),function(t,e){s.heads.push(e)}),this.each(s.cal.getElementsByTagName("span"),function(t,e){s.btns.push(e)}),this.setHtml(this.cache.date.concat()),this.setEvent()},setHtml:function(t){var e,a,n=[],o=0,s=this.cache,c=this,i=[];t=this.date(t),s.cur_date[0]=t[0],s.cur_date[1]=t[1],e=c.date(c.op.today),e=""+e[0]+("0"+e[1]).slice(-2)+("0"+e[2]).slice(-2);for(var l=0;l<s.count;l++)n.push(this.days([s.cur_date[0],s.cur_date[1]+l,1]));for(var d=0;d<s.count;d++){var h=n[d][1][0].toString().match(/^(\d+)(\d\d)(\d\d)$/);s.heads[d].innerHTML=h[1]+c.conf.cal_text[0]+h[2]+c.conf.cal_text[1];for(var r=0;3>r;r++)for(var f=0;f<n[d][r].length;f++)a=this.generateTd(s.cells[o],r,n[d][r][f],e),a&&(i=i.concat(a)),o++}$.each(i,function(){var t,e=this.date.match(/^(\d+)-(\d\d)-(\d\d)/);e&&4==e.length&&(e=e[1]+e[2]+e[3],t=$(c.cache.cal).find("[date="+e+"] "),t.length>0&&!t.hasClass(c.conf.day_class[6])&&(t.css("position","relative"),t.find(".op_mon_day_holiady_icon").remove(),$('<i class="op_mon_day_holiady_icon">'+this.desc+"</i>").css("color",this.color||"").appendTo(t)))}),this.op.onChange.call(this)},generateTd:function(t,e,a,n){var o,s,c,i=this.cache,l=this.conf;t=$(t),o=this.dateParse(a),t.html(a==n?'<a href="javascript:void(0);">今天</a>':'<a href="javascript:void(0);">'+a.slice(-2)+"</a>"),t.prop("class",l.day_class[e]),a==n&&t.addClass(l.day_class[3]),(a<i.between[0]||a>i.between[1])&&t.addClass(l.day_class[6]),"all"!=i.ableArr&&-1==$.inArray(a,i.ableArr)&&t.addClass(l.day_class[6]),(0==o.getDay()||6==o.getDay())&&t.addClass(l.day_class[7]);try{$.each(i.holidays,function(){var e;e=new RegExp(this.date),s=/^(\d{4})(\d{2})(\d{2})/.exec(a).slice(1).join("-"),e.test(s)&&(t.find(".op_mon_day_holiady_name").remove(),t.css("position","relative").append(['<a class="op_mon_day_holiady_name" style="position: absolute; left: 0; top: 0;" href="javascript:void(0);">',this.name,"</a>"].join("")),t.addClass(l.day_class[7]).prop("title",this.title),c=this)})}catch(d){}return t.attr("date",a),c&&c.detail},setEvent:function(){function t(t){var e=t.getAttribute("date")-0,n="normal";return"all"!=a.cache.ableArr&&a.cache.ableArr.length?n=-1!=$.inArray(""+e,a.cache.ableArr)?"normal":"disable":e<=a.cache.between[1]&&e>=a.cache.between[0]?"normal":"disable"}var e=this.conf.day_class,a=this,n={normal:{mouseover:function(){a.addClass(this,e[4]),$(this).hasClass("op_mon_day_holiady")&&$(this).find(".op_mon_day_holiady_name").slideUp("fast")},mouseout:function(){a.removeClass(this,e[4]),$(this).hasClass("op_mon_day_holiady")&&$(this).find(".op_mon_day_holiady_name").slideDown("fast")},click:function(t,n){a.cache.selected&&a.removeClass(a.cache.selected,e[5]),a.cache.selected=this,a.addClass(this,e[5]),a.cache.input&&(a.op.toInput?a.op.toInput.call(a,t,n):a.toInput.call(a,t,n)),a.op.onSelectDay.call(a,t,n)}},disable:{mouseover:function(){return!1},mouseout:function(){return!1},click:function(){return!1}},btn:{0:function(){a.preMonth()},1:function(){a.nextMonth()}}};this.each(this.cache.btns,function(t,e){e.onclick=function(){n.btn[t].call(e)}}),this.each(this.cache.cells,function(e,a){$(a).on("mouseenter",function(){n[t(a)].mouseover.call(a)}),$(a).on("mouseleave",function(){n[t(a)].mouseout.call(a)}),$(a).on("click",function(){var e=a.getAttribute("date")-0,o=a.getAttribute("week")-0;return n[t(a)].click.call(a,e,o),!1})})},show:function(){var t=this.cache;if(t.input){var e={position:"absolute",zIndex:"10"},a=t.position,n=$(a).offset().left,o=$(a).offset().top+$(a).outerHeight(),s=0,c=-1;e.left=n+s+"px",e.top=o+c+"px";for(var i in e)t.cal.style[i]=e[i];t.iframeHeight=this.cache.cal.offsetHeight,t.iframeWidth=this.cache.cal.offsetWidth;var l=t.cal.getElementsByTagName("iframe")[0];l.style.height=t.iframeHeight+"px",l.style.width=t.iframeWidth+"px"}this.cache.cal.style.display="block",this.op.onShow.call(this,this.cache.cal)},hide:function(){this.cache.cal.style.display="none",this.op.onHide.call(this,this.cache.cal)},nextMonth:function(){this.cache.cur_date[1]++,this.setHtml(this.cache.cur_date)},preMonth:function(){this.cache.cur_date[1]--,this.setHtml(this.cache.cur_date)},nextYear:function(){this.cache.cur_date[0]++,this.setHtml(this.cache.cur_date)},preYear:function(){this.cache.cur_date[0]--,this.setHtml(this.cache.cur_date)},setBetween:function(t){this.cache.between=t,this.setHtml(this.cache.cur_date)},setAbleArr:function(t){this.cache.ableArr=t,this.setHtml(this.cache.cur_date)},isCurMonth:function(t){var t=this.date(t);return this.cache.cur_date[0]==t[0]&&this.cache.cur_date[1]==t[1]?!0:!1},setDay:function(t){var e=null;t=[].concat(t),this.each(t,function(e,a){t[e]=a.toString()});for(var a=this.cache.cells,n=0,o=a.length;o>n;n++)for(var s=0;s<t.length;s++)a[n].getAttribute("date")==t[s]&&$(a[n]).hasClass(this.conf.day_class[1])&&(e=a[n],this.addClass(e,"op_cell_seledted"))},toInput:function(t,e){var a=this.cache.input;t=t.toString().match(/^(\d+)(\d\d)(\d\d)$/);var n=t[1]+"-"+t[2]+"-"+t[3]+"(周"+this.conf.day_text[e]+")";"input"==a.tagName.toLowerCase()?a.value=n:a.innerHTML=n,this.hide()},formInput:function(t){{var e;this.cache}e="input"==t.tagName.toLowerCase()?t.value:t.innerHTML;var a=e.match(/^(\d+)-(\d\d)-(\d\d)/);a&&4==a.length&&(a.shift(),this.isCurMonth(a)||this.setHtml(a)),this.show()}},e.Calendar=a});