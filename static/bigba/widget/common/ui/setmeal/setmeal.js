define('bigba:widget/common/ui/setmeal/setmeal.js', function(require, exports, module){ /**
 * 商户列表&商户卡片
 * @author boye.liu
 */
var cookie = require("bigba:static/utils/Cookie.js");
var localStore = require("bigba:static/utils/store.js");
var setMealTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="setMeal">    <div class="dish-title" data-node="setMeal-title">    </div>    <div class="content" data-node="setMeal-content">        <div class="groups" data-node="setMeal-content-groups">        </div>        <div class="dishes" data-node="setMeal-content-dishes">        </div>    </div>    <div class="bottom" data-node="setMeal-bottom">    </div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealTitleTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<span class="closeBtn"></span><h2>',typeof(data.itemName) === 'undefined'?'':baidu.template._encodeHTML(data.itemName),'</h2>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealDishTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="list-title">    <div class="big-tip">        ');if(parseInt(data.min_num)>=1){_template_fun_array.push('            必选        ');}else{_template_fun_array.push('            可选        ');}_template_fun_array.push('        ');if(parseInt(data.min_num)==parseInt(data.max_num)){_template_fun_array.push('            ');if(data.min_num==1){_template_fun_array.push('            (单选)            ');}else{_template_fun_array.push('            (多选 ',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)            ');}_template_fun_array.push('        ');}else{_template_fun_array.push('            (多选 ',typeof(data.min_num) === 'undefined'?'':baidu.template._encodeHTML(data.min_num),'-',typeof(data.max_num) === 'undefined'?'':baidu.template._encodeHTML(data.max_num),'份)        ');}_template_fun_array.push('    </div>    <span class="select-msg" data-node="selectmsg">&nbsp;            </span></div><div class="dishes-list ');if(selected && selected.total && selected.total.count>=data.max_num){_template_fun_array.push(' enough');}_template_fun_array.push('">    '); if(data.ids.length>0){var len = data.ids.length;var divider = Math.ceil(len/2)-1;_template_fun_array.push('        ');for(var i=0,len=data.ids.length;i<len;i++){var item = data.ids[i];_template_fun_array.push('            ');if(i==0){_template_fun_array.push('                <div class="dish-c">            ');}_template_fun_array.push('            ');if(parseInt(item.have_attr) || parseInt(item.have_feature)){_template_fun_array.push('            <div class="dish-item mutiple" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <div class="mutiple-title" data-node="mutipletitle">                    <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                    <span class="right-side">                        <span class="mutiple-box">                            多规格                        </span>                        <span class="dish-cost" data-node="dishCost">￥');if(selected && selected[item.item_id] && selected[item.item_id].realPrice){_template_fun_array.push('',typeof(selected[item.item_id].realPrice) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].realPrice),'');}else{_template_fun_array.push('',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'');}_template_fun_array.push('</span>                        <span class="select-icon"></span>                    </span>                </div>                <div class="mutiple-content">                    <table class="size-table" data-node="sizeTable">                        ');for(var da in item.dish_attr){item.dish_attr[da].mainK=1;}_template_fun_array.push('                        ');var attrs = _.extend(item.dish_features,item.dish_attr);for(var att in attrs){;_template_fun_array.push('                        <tr data-key="',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'" data-maink="');if(attrs[att].mainK){_template_fun_array.push('1');}else{_template_fun_array.push('0');}_template_fun_array.push('">                            <td class="attr-title" valign="top">',typeof(att) === 'undefined'?'':baidu.template._encodeHTML(att),'：</td>                            <td>                                ');for(var j=0,attrlen=attrs[att].length;j<attrlen;j++){_template_fun_array.push('                                    <span class="s-item ');if(selected && selected[item.item_id] && _.indexOf(selected[item.item_id].features,attrs[att][j]['id'])!=-1){_template_fun_array.push(' sec');}_template_fun_array.push('" data-price="',typeof(attrs[att][j]['price']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['price']),'"  data-id="',typeof(attrs[att][j]['id']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['id']),'"  data-name="',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'">',typeof(attrs[att][j]['name']) === 'undefined'?'':baidu.template._encodeHTML(attrs[att][j]['name']),'</span>                                ');}_template_fun_array.push('                            </td>                        </tr>                        ');}_template_fun_array.push('                        <tr>                            <td colspan="2">                                <span class="select-box">                                    ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                                        <span class="minusicon" data-node="minusIcon"></span>                                        <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                                        <span class="addicon" data-node="addIcon"></span>                                    ');}else{_template_fun_array.push('                                        <span class="minusicon v-hide" data-node="minusIcon"></span>                                        <span class="select_count v-hide">0</span>                                        <span class="addicon disable" data-node="addIcon"></span>                                    ');}_template_fun_array.push('                                </span>                            </td>                        </tr>                    </table>                </div>            </div>            ');}else{_template_fun_array.push('            <div class="dish-item" data-id="',typeof(item.item_id) === 'undefined'?'':baidu.template._encodeHTML(item.item_id),'" data-name="',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'" data-price="',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'">                <span class="dish-name">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</span>                <span class="right-side">                    <span class="select-box">                        ');if(selected && selected[item.item_id] && selected[item.item_id].count){_template_fun_array.push('                            <span class="minusicon" data-node="minusIcon"></span>                            <span class="select_count">',typeof(selected[item.item_id].count) === 'undefined'?'':baidu.template._encodeHTML(selected[item.item_id].count),'</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}else{_template_fun_array.push('                            <span class="minusicon v-hide" data-node="minusIcon"></span>                            <span class="select_count v-hide">0</span>                            <span class="addicon" data-node="addIcon"></span>                        ');}_template_fun_array.push('                    </span>                    <span class="dish-cost">￥',typeof(item.current_price) === 'undefined'?'':baidu.template._encodeHTML(item.current_price),'</span>                </span>            </div>            ');}_template_fun_array.push('            ');if(i==divider){_template_fun_array.push('                </div><div class="dish-c">            ');}_template_fun_array.push('            ');if(i==len-1){_template_fun_array.push('                </div>            ');}_template_fun_array.push('        ');}_template_fun_array.push('    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealGrpsTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('    <div class="group-item ');if(curIndex==i){_template_fun_array.push(' select');}_template_fun_array.push('" data-index="',typeof(i) === 'undefined'?'':baidu.template._encodeHTML(i),'" data-grps-id="',typeof(item.dish_group_id) === 'undefined'?'':baidu.template._encodeHTML(item.dish_group_id),'">        <span class="top-tip"></span>        ');if(parseInt(item.min_num)>0){_template_fun_array.push('            <p class="gtitle">必选</p>        ');}else{_template_fun_array.push('            <p class="gtitle-not">可选</p>        ');}_template_fun_array.push('        <p class="gname">',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),'</p>    </div>    ');if(i<len-1){_template_fun_array.push('        <div class="group-divider">            +        </div>    ');}_template_fun_array.push('');}_template_fun_array.push('<span class="group-arrow" data-node="groupArrow"></span>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var setMealBotmTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<table width="100%">    <tr>        <td width="300">            套餐价：<span class="price" data-node="bottomprice" data-type="',typeof(data.isFixedPrice) === 'undefined'?'':baidu.template._encodeHTML(data.isFixedPrice),'">￥');if(parseInt(data.isFixedPrice)==1){_template_fun_array.push('',typeof(data.itemPrice) === 'undefined'?'':baidu.template._encodeHTML(data.itemPrice),'');}else{_template_fun_array.push('0');}_template_fun_array.push('</span>        </td>        <td>            ');if(data.itemStock<50){_template_fun_array.push('库存',typeof(data.itemStock) === 'undefined'?'':baidu.template._encodeHTML(data.itemStock),'份');}_template_fun_array.push('            ');if(data.itemStock<50 && data.minOrderNumber>1){_template_fun_array.push(' | ');}_template_fun_array.push('            ');if(data.minOrderNumber>1){_template_fun_array.push('',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'份起订');}_template_fun_array.push('        </td>        <td>            <div class="select-outer disable" data-node="selectouter">                <div class="select-con">                    <div class="select-inner">                        <strong class="minusfrcart" data-node="minusfrcart"></strong>                        <strong class="select_count" data-node="selectCount">',typeof(data.minOrderNumber) === 'undefined'?'':baidu.template._encodeHTML(data.minOrderNumber),'</strong>                        <strong class="addtocart" data-node="addtocart"></strong>                    </div>                </div>            </div>        </td>        <td width="170" align="center"><span class="submit-btn disable"  data-node="submitBtn">加入购物车</span></td>    </tr></table>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var dishListClass = ".dishes-list";
var dishItemClass = ".dish-item";
var mulItemClass = "mutiple";
var grpItemClass = ".group-item";
var seboxItemCls = ".select-box";
var countItemCls = ".select_count";
var EventCenter;
var GlobalTips = require('bigba:static/utils/GlobalTips.js');
/*
* opt = {
*   data : data
*   $el : 列表父元素 必须是ul
*   selectData:{
    "9364224917068359757": {//套餐中的组id
        "total": {
            "count": 2
        },
        "1663427882012019110": {
            "count": 1,
            "realId": "1663427882012019110_105867",//真正的id来自规格id
            "realPrice": "2.00",
            "features": [
                "13663338480194713593",
                "13663338480194713599",
                "1663427882012019110_105867"//规格id
            ],
            "featueNames": [
                "冷",
                "酸",
                3 //规格名称
            ],
            "dname": "折扣单品"
        },
        "10763787674842328466": {
            "count": 1,
            "dname": "测试2"
        }
    },
    "1711681714380835476": {
        "total": {
            "count": 1
        },
        "13793538995861552031": {
            "count": 1,
            "dname": "test555"
        }
    }
* curGrp：当前group所在data中的index，
*}
*/

function setMeal(opt){
    var _opt = {
        data : [],
        $el : null,
        selectData:{},
        curGrp:0,
        selectBasic:{}
    };
    EventCenter = $({});
    this.opt = $.extend(_opt,opt);
    this.renderList(this.opt.data);
    this.bindEvent();
}
$.extend(setMeal.prototype, {
    renderList: function(data){
        var _$el = this.opt.$el;
        if(data && data.groups.length > 0){
            var _html = setMealTmpl();
            _$el.html(_html);
            _$el.find("[data-node=setMeal-title]").html(setMealTitleTmpl({data:data.basics}));
            _$el.find("[data-node=setMeal-content-groups]").html(setMealGrpsTmpl({data:data.groups,curIndex:this.opt.curGrp}));
            _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:data.groups[this.opt.curGrp],selected:{}}));
            _$el.find("[data-node=setMeal-bottom]").html(setMealBotmTmpl({data:data.basics}));

            $(this).trigger('list.complete');
        }
    },
    getRealLeftNum: function(id){

    },
    bindEvent: function(){
        var self = this;
        var $me = self.opt.$el;
        $me.find("[data-node=setMeal-title]").on("click",function(){});
        //切换groups
        $me.find("[data-node=setMeal-content-groups]").on("click", grpItemClass,function(e){
            var _target=$(e.currentTarget);
            self.switchGrps(_target,$me.find("[data-node=setMeal-content-groups]"));
        });
        //多规格展示
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=mutipletitle]", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            _target.parents(dishItemClass).toggleClass("selected");
        });
        //选择属性
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=sizeTable] .s-item", "."+mulItemClass,function(e){
            var _target=$(e.currentTarget);
            if(_target.hasClass("sec"))return;
            _target.parents("tr").find(".s-item").removeClass("sec");
            _target.addClass("sec");
            self.selectAttr(_target);
            EventCenter.trigger("selectAttr");
        });
        $me.find("[data-node=setMeal-bottom]").on("click","[data-node]",function(e){
            var _target=$(e.currentTarget);
            self.handleBottomeClick(_target);
        });
        //加菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=addIcon]",function(e){
            var _target=$(e.currentTarget);
            var _par = _target.parents(dishListClass);
            if(_par.hasClass("enough")) {
                GlobalTips.tip("已到达可选菜品上限");
            } else if(_target.hasClass("disable")) {
                GlobalTips.tip("多规格菜品需要先选择规格");
            }
            self.addIconClick(_target);
        });
        //减菜品
        $me.find("[data-node=setMeal-content-dishes]").on("click","[data-node=minusIcon]",function(e){
            var _target=$(e.currentTarget);
            self.minusIconClick(_target);
        });
        //属性选择后 需要执行的处理
        EventCenter.on("selectAttr",function(){
            self.refreshSelectMsg();
            self.refreshBottom();
        });
        //增加菜品后 需要的执行处理
        EventCenter.on("addDish",function(){
            self.onAddDish();
        });
        //减少菜品后 需要的执行处理
        EventCenter.on("minusDish",function(){
            self.onMinusDish();
        });
        //切换菜品组后 需要的执行处理
        EventCenter.on("switchGrps",function(){
            self.refreshSelectMsg();
        });
    },
    switchGrps: function(cur,par){
        var self = this;
        var _$el = self.opt.$el;
        var data = self.opt.data;
        par.find(grpItemClass).removeClass("select");
        cur.addClass("select");

        self.opt.curGrp = cur.data("index");
        var grpData = data.groups[self.opt.curGrp];
        _$el.find("[data-node=setMeal-content-dishes]").html(setMealDishTmpl({data:grpData,selected:self.opt.selectData[grpData.dish_group_id]}));
        self.setArrowPos(cur);
        EventCenter.trigger("selectAttr");
        //console.log(self.opt.selectData[grpData.dish_group_id]);
    },
    setArrowPos: function(cur){
        var self = this;
        var _$el = self.opt.$el;
        var _pos = cur.position();
        var $arrow = _$el.find("[data-node=groupArrow]");
        $arrow.css({left:(_pos.left+cur.width()/2-$arrow.width()/2)+"px"});
    },
    selectAttr: function(cur){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var rows = cur.parents("[data-node=sizeTable]").find("[data-key]");
        var features = cur.parents("[data-node=sizeTable]").find(".sec");
        var priceDom = cur.parents(dishItemClass).find("[data-node=dishCost]");
        if(features.length<rows.length){cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").addClass("disable");return false;}
        cur.parents("[data-node=sizeTable]").find("[data-node=addIcon]").removeClass("disable");
        var itemInfo = self.getItemInfo(cur);
        var itemId = itemInfo.id;
        var featueIds = [];
        var featueNames = [];
        //选择数据的判断初始化
        //selectData[itemId] = selectData[itemId] || {count:0};
        selectData[itemId] =self.getItemSelectData(itemInfo,selectData[itemId]);
        //遍历所有属性
        for(var i=0,len=rows.length;i<len;i++){
            if($(rows[i]).data("maink") == "1"){
                selectData[itemId].realId = $(rows[i]).find(".sec").data("id")+"";
                selectData[itemId].realPrice = $(rows[i]).find(".sec").data("price");
                //selectData[itemId].attrName = $(rows[i]).find(".sec").data("name");
                priceDom.text("￥"+$(rows[i]).find(".sec").data("price"));
            }else{}
            featueIds.push($(rows[i]).find(".sec").data("id")+"");
            featueNames.push($(rows[i]).find(".sec").data("name"));
        }
        selectData[itemId].features = featueIds;
        selectData[itemId].featueNames = featueNames;
        if(cur.data("node")=="addIcon"){
            selectData[itemId].count++;
        }else if(cur.data("node")=="minusIcon"){
            selectData[itemId].count--;
        }
        self.opt.selectData[curGrpsId] = selectData;
        return true;
    },
    onAddDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    onMinusDish: function(){
        var self = this;
        //console.log(self.opt.selectData);
        self.refreshTopTip();
        self.refreshSelectMsg();
        self.refreshBottom();
    },
    //用户选择信息总汇
    refreshSelectMsg: function(){
        var self = this;
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品
        //菜品选择区域控制
        if(_csdata && _csdata.total && parseInt(_csdata.total.count) >= parseInt(_cdata.max_num)){
            self.opt.$el.find(dishListClass).addClass("enough");
        }else{
            self.opt.$el.find(dishListClass).removeClass("enough");
        }
        
        var _str = "&nbsp;";
        for(var i in _csdata){
            if(i=="total"){continue;}
            //数量大于0再展示
            if(_csdata[i].count){
                _str += _csdata[i].dname;//+"_"+(_csdata[i].attrName || "");
                if(_csdata[i].featueNames && _csdata[i].featueNames.length){
                    _str+="_"+_csdata[i].featueNames.join("_");
                }
                _str += "*"+_csdata[i].count+"、";
            }
        }
        self.opt.$el.find("[ data-node=selectmsg]").html(_str);
    },
    //刷新用户选择信息top tip
    refreshTopTip: function(){
        var self = this;
        var _sdata = self.opt.selectData;
        var _data = self.opt.data;
        for(var i=0,len=_data.groups.length;i<len;i++){
            var _tipDom = $("[data-grps-id="+_data.groups[i].dish_group_id+"]").find(".top-tip");
            if(_sdata[_data.groups[i].dish_group_id]){
                var _totalC = _sdata[_data.groups[i].dish_group_id].total.count;
                if(_totalC && _data.groups[i].min_num<=_totalC && _totalC<=_data.groups[i].max_num){
                    _tipDom.addClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else if(_totalC && _sdata[_data.groups[i].dish_group_id].total.count>=0){
                    _tipDom.removeClass("ready").text(_sdata[_data.groups[i].dish_group_id].total.count).show();
                }else{
                    _tipDom.hide();
                }
            }
        }
    },
    refreshBottom: function(){
        var self = this;
        var $el = self.opt.$el;
        var $price = $el.find("[data-node=bottomprice]");
        var $select = $el.find("[data-node=selectouter]");
        var $submitBtn = $el.find("[data-node=submitBtn]");
        var _sdata = self.opt.selectData;//记录选过的菜品
        var _data = self.opt.data.groups;//原有数据
        /*var _cdata = _data[self.opt.curGrp]; //当前的基础数据
        var _csdata = _sdata[_cdata.dish_group_id]; //当前组中选中的菜品*/
        var checkArr = [];//也可以用与元算来处理
        var _price = 0;
        //对groups进行check，看是否符合下单规则
        for(var i=0,len=_data.length;i<len;i++){
            if(parseInt(_data[i].min_num)){
                if(_sdata[_data[i].dish_group_id] && _sdata[_data[i].dish_group_id].total.count>=_data[i].min_num){
                    checkArr.push(1);
                }else{
                    checkArr.push(0);
                }
            }
            if(Math.min.apply(null,checkArr)===1){
                //通过检查
                $select.removeClass("disable");
                $submitBtn.removeClass("disable");
            }else{
                $select.addClass("disable");
                $submitBtn.addClass("disable");
            }
        }
        //处理非固定价格套餐
        if(parseInt($price.data("type"))!==1){
            for(var item in _sdata){
                //_sdata第一层为套餐组id
                var tmpItem = _sdata[item];
                if(!tmpItem.total.count){continue;}
                //_sdata第二层为单菜品，计算价格主要在此
                for(var ditem in tmpItem){
                    if(ditem==="total" || !tmpItem[ditem].count){continue;}
                    _price+= (parseFloat(tmpItem[ditem].realPrice || tmpItem[ditem].price))*(parseInt(tmpItem[ditem].count));
                }
            }
            $price.html("￥"+(_price).toFixed(2));
            self.opt.selectBasic.price = _price;
        } else {
            self.opt.selectBasic.price = self.opt.data.basics.itemPrice;
        }
    },
    //菜品增加，减少按钮的逻辑控制
    refreshSelectArea: function(cur,selectData,itemInfo){
        var _par = cur.parent();
        if(selectData[itemInfo.id].count>0){
            _par.find("[data-node=minusIcon]").removeClass("v-hide");
            _par.find(countItemCls).text(selectData[itemInfo.id].count).removeClass("v-hide");
        }else{
            cur.parent().find(countItemCls).text(selectData[itemInfo.id].count).addClass("v-hide");
            _par.find("[data-node=minusIcon]").addClass("v-hide");
        }
    },
    addIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _max = parseInt(data.max_num);
        var curGrpsId = data.dish_group_id;

        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData.total.count<_max){
            if(self.selectAttr(curDom)){
                selectData.total.count++;
            }
        }else if(selectData.total.count<_max){
            selectData.total.count++;
            selectData[itemInfo.id].count++;
        }else{
            return;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("addDish");
    },
    //判断选择数据是否存在，不存在则初始化
    getItemSelectData:function(itemInfo,selectData){
        selectData = selectData || {count:0,dname:itemInfo.name,price:itemInfo.price};
        return selectData;
    },
    //针对需要存到cookie中的值在此获取
    getItemInfo:function(curDom){
        var parItem = curDom.parents(dishItemClass);
        var _id = "";
        /*if(parItem.hasClass(mulItemClass)){
            _id = parItem.find("[data-maink=1] .s-item.sec").data("id");
        }else{*/
        _id = parItem.data("id")+"";
        var _name = parItem.data("name");
        var _price = parItem.data("price");
        //}
        return {id:_id,name:_name,price:_price,count:0};
    },
    minusIconClick:function(curDom){
        var self = this;
        var data = self.opt.data.groups[self.opt.curGrp];//dish_group_id
        var _min = parseInt(data.min_num);
        var curGrpsId = data.dish_group_id;
        var selectData = self.opt.selectData[curGrpsId] || {total:{count:0}};
        var itemInfo = self.getItemInfo(curDom);
        //初始化selectData
        selectData[itemInfo.id] = self.getItemSelectData(itemInfo,selectData[itemInfo.id]);
        //判断是否为多规格菜品
        if(curDom.parents(dishItemClass).hasClass(mulItemClass) && selectData[itemInfo.id].count>=1){
            if(self.selectAttr(curDom)){
                selectData.total.count--;
            }
        }else if(selectData[itemInfo.id].count<=0){
            selectData[itemInfo.id].count=0;
            return;
        }else{
            selectData.total.count--;
            selectData[itemInfo.id].count--;
        }
        self.refreshSelectArea(curDom,selectData,itemInfo);
        
        self.opt.selectData[curGrpsId] = selectData;
        EventCenter.trigger("minusDish");
    },
    //底部区域按钮点击
    handleBottomeClick : function(cur){
        var self = this;
        var data = self.opt.data.basics;
        var nodeType = cur.data("node");
        var $sCount = self.opt.$el.find("[data-node=selectCount]");
        var curCount = parseInt($sCount.html()) || 0;
        //if(!$.isNumeric(curCount)){curCount = data.minOrderNumber;}
        if(nodeType==="addtocart"){
            if(curCount && curCount<data.itemStock){
                $sCount.html(++curCount);
            }else if(!curCount){
                $sCount.html(data.minOrderNumber);
            }
        }else if(nodeType==="minusfrcart"){
            if(curCount<=data.minOrderNumber){
                $sCount.html(0);
            }else{
                $sCount.html(--curCount);
            }
        }
        self.opt.data.basics.itemCount = curCount;
        if(nodeType==="submitBtn"){
            !cur.hasClass("disable") && self.submitSetMeal();
        }
    },
    //调整数据结构来适应购物车结构
    //bdata结构
    //basic：包含选中菜品基本信息，与单菜品相同的属性key
    //data：选择的套餐信息
    adjustDataStructure: function(bdata){
        var _tmpId = "";
        //id赋值给变量记住
        bdata.orignItemId = bdata.itemId;
        bdata.grpsInfo.basic.id = bdata.itemId;
        //真实价格
        bdata.itemPrice = bdata.grpsInfo.basic.price;
        //采用append方式
        bdata.type = "append";
        //文件顶部有selectData的机构，下面要做的是把这个结构转换成一个字符串
        //字符串中包含所有的id，组id，菜id，属性id；并且id按顺序拼接
        //id之后由 _p 接个数
        var grpsIds = [];
        var dishIds = [];
        var featureIds = [];
        for(var i in bdata.grpsInfo.data){
            var tmpData = bdata.grpsInfo.data[i];
            grpsIds.push(i+"_p"+tmpData.total.count);
            for(var ix in tmpData){
                if(ix==="total")continue;
                dishIds.push(ix+"_p"+tmpData[ix].count);
                if(tmpData[ix].features && tmpData[ix].features.length){
                    featureIds.concat(tmpData[ix].features);
                }
            }
        }
        bdata.itemId = grpsIds.sort().join("__")+"___"+dishIds.sort().join("__")+"___"+featureIds.sort().join("__");
    },
    //套餐数据存到cookie中
    saveGrpsData: function(data){
        if (data.grpsInfo) {
            localStore.set('s' + data.itemId + 's',data.grpsInfo);
            /*cookie.set('s' + data.itemId + 's', JSON.stringify(data.grpsInfo), {
                path: '/'
            });*/
        };
    },
    submitSetMeal:function(){
        var self = this;
        //console.log(self.opt);
        var _res = {};
        _res = $.extend(_res,self.opt.data.basics);
        _res.grpsInfo = {basic:self.opt.selectBasic,data:self.opt.selectData};
        self.adjustDataStructure(_res);
        self.saveGrpsData(_res);
        self.opt.onSubmitBtn(_res);
    }
});

module.exports = setMeal;
 
});