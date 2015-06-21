define('bigba:static/utils/CartDataCenter.js', function(require, exports, module){ /**
 * Created with IntelliJ IDEA.
 * User: asheng
 * Date: 14-2-8
 * Time: 上午9:51
 * To change this template use File | Settings | File Templates.
 */
/**
 * 购物车数据格式
 * shopItem 表示 添加的菜品
 * itemId : 菜品id itemCount: 用户选择数量 itemName: 菜品名称 itemPrice:菜品单价 
 * itemStock: 菜品库存 packCount 餐盒数量 packPrice 餐盒单价 minOrderNumber:起订份数
 * itemDishType:菜品分类，主要用来区分套餐与多属性
 * {
 *     shopName:
 *     shopId:
 *     deliveryFee:
 *     takeOutPrice:
 *     shopItem:[
 *          {
 *              itemId:
 *              itemCount:
 *              itemName:
 *              itemPrice:
 *              packCount:
 *              packPrice:
 *              minOrderNumber：
 *              itemStock:
 *              itemDishType:
 *              itemStockId:
 *          }
 *     ]
 * }
 *
 * itemAttr,itemGrps拆出去，用菜品作为cookiekey；前提：用户端菜品id全局唯一
 * */
var cookie = require("bigba:static/utils/Cookie.js"),
    util = require("bigba:static/util.js"),
    exports,
    car,
    curShopId,
    delimiter = {
        shopToItem: "##",
        itemToItem: "$$",
        item: "^^"
    };
var featuresStock = {};//多规格库存量
var alertDialog = require("bigba:widget/common/ui/cartAlert/cartAlert.js");
var localStore = require("bigba:static/utils/store.js");
//格式化价格，保留一位小数
function formatPrice(price) {
    // return price;
    return (Math.round(price * 10) / 10).toFixed(1);
}
//保存数据
function saveData(key, value) {
    _value = encodeURIComponent(value);
    cookie.setRaw('s' + key + 's', _value, {
        path: '/'
    });
    localStore.set('s' + key + 's',value);
}
//获取数据
function getData(key) {
    return localStore.get('s' + key + 's') || cookie.get('s' + key + 's');
}
//获取数据
function clearData(key) {
    var _data =  unserialize(getData(key));
    //rd返回时已经充值cookie了，所以找不到关联套餐和多属性了，注释掉吧
    /*for (itemIdex = 0, len = _data.shopItem.length; itemIdex < len; itemIdex++) {
        localStore.remove('s' + _data.shopItem[itemIdex].itemId + 's');
        cookie.remove('s' + _data.shopItem[itemIdex].itemId + 's');
    }*/
    cookie.remove('s' + key + 's');
    localStore.remove('s' + key + 's');
    localStore.clear();
}

//序列化数据
function serialize(value) {
    var val, items = [];
    $.each(value.shopItem, function(i, item) {
        items.push([item.itemId, item.itemCount, item.itemName, item.itemPrice, item.packCount, item.packPrice, item.minOrderNumber,item.itemStock,item.itemDishType,item.itemStockId].join(delimiter.item));
    });
    val = [value.shopName, value.shopId, value.deliveryFee, value.takeOutPrice, items.join(delimiter.itemToItem)].join(delimiter.shopToItem);
    return val;
}
//反序列化数据
function unserialize(value) {
    if (!value) return {
        shopName: "",
        shopId: "",
        deliveryFee: 0,
        takeOutPrice: 0,
        shopItem: []
    };
    var vals = value.split(delimiter.shopToItem),
        val = {};
    if (vals.length >= 1)
        val.shopName = vals[0];
    if (vals.length >= 2)
        val.shopId = vals[1] + "";
    if (vals.length >= 3)
        val.deliveryFee = vals[2];
    if (vals.length >= 4)
        val.takeOutPrice = vals[3];

    val.shopItem = [];
    if (vals.length >= 5 && (vals = vals[4])) {
        vals = vals.split(delimiter.itemToItem);
        $.each(vals, function(i, item) {
            var v = item.split(delimiter.item);
            //套餐如果cookie不全，认为无相应菜品
            if(v[0] && v[8]==2){
                var cget = localStore.get("s"+v[0]+"s");
                if(!cget){return;}
            }

            val.shopItem.push({
                itemId: v[0],
                itemCount: parseInt(v[1]),
                itemName: v[2],
                itemPrice: v[3],
                packCount: v[4],
                packPrice: v[5],
                minOrderNumber: v[6],
                itemStock: parseInt(v[7]),
                itemDishType: v[8],
                itemStockId:v[9]
            });
        });
    }
    return val;
}
//保存当前购物车数据
function saveShopCar() {
    saveData(curShopId, serialize(car));
}
//初始化购物车数据
function initCar() {
    //获取当前商户ID
    car = unserialize(getData(curShopId));
    car.shopId = curShopId;
}
//针对多属性刷新库存量
//itemId: 菜品唯一id
//uid：规格id
//count：设置的新个数
//itemStock：规格现有库存总量
//stock"prodoct_id"s = {oriTotal:现有全部量，total：已经选择的量}
function setFeatureItemStock(itemId,uid,count,itemStock) {
    //var _uid = uid;//规格id
    //var localKey = "stock_" + _uid + "s";
    //var _oriData;
    var total = 0;
    var flag = false;
    itemStock = parseInt(itemStock);
    count = parseInt(count);
    /*if(!featuresStock[localKey] || !featuresStock[localKey].oriTotal) {
        featuresStock[localKey] = featuresStock[localKey] || {};
        featuresStock[localKey].oriTotal = itemStock;
        featuresStock[localKey].total = 0;
    } else {}*/
    for (itemIdex = 0, len = car.shopItem.length; itemIdex < len; itemIdex++) {
        if (car.shopItem[itemIdex].itemStockId == uid) {
            if(car.shopItem[itemIdex].itemId == itemId){
                total+=count;
                flag = true;
            }else{
                total += car.shopItem[itemIdex].itemCount;
            }
        }
    }
    if (!flag) {total+=count;}
    if(total>=itemStock) {
        $(exports).trigger('features.stockTight',{sid:uid,num:itemStock});
    } else if(total<itemStock){
        $(exports).trigger('features.stockNormal',uid);
    }
    if (total>itemStock) {
        return count+itemStock-total;
    }else{
        return count;
    }
    //localStore.set(localKey,_stock);
}
//针对多套餐刷新库存量
//stock"prodoct_id"s = 5
function setSetmealItemStock(count,selectD,stock) {
    var _uid = selectD.basic.id;
    var localKey = "stock_" + _uid + "s";
    var _stock = parseInt(localStore.get("stock_"+_uid+"s"));
    if(_stock == 0 || _stock) {
        _stock = _stock-count;
    } else {
        _stock = stock-count;
    }
    localStore.set(localKey,_stock);
}
//针对多属性转换
function adaptFeatureForServer(pid,pqa,selectD) {
    if(!selectD)return;
    var _data = {product_id:selectD.itemId, product_quantity:pqa,feature_id:[]};
    for(var i in selectD.select){
        if(i=="规格"){_data.product_id =selectD.select[i].id;continue;}
        _data.feature_id.push(selectD.select[i].id)
    }
    return $.extend({},_data);
}
//针对套餐转换
function adaptSetMealForServer(pid,pqa,selectD) {
    var me = this;
    if(!selectD)return;
    var _data = {product_id:selectD.basic.id, product_quantity:pqa,groupons:[]},
        tmpGrps,
        tmpDish,
        selectTmp;
    for(var i in selectD.data){
        if(!selectD.data[i].total || !selectD.data[i].total.count){continue;}
        tmpGrps = {"dish_group_id":i,"ids":[]};
        for(var ix in selectD.data[i]){
            if(ix=="total"){continue;}
            selectTmp = selectD.data[i][ix];
            if(!selectTmp.count){continue;}
            //如果有features，则认为是多属性
            if(selectTmp.features && selectTmp.features.length){
                var tmpArr = $.extend([],selectTmp.features);
                //有realId，处理一下多规格
                if(selectTmp.realId){
                    tmpArr.splice($.inArray(selectTmp.realId,tmpArr),1);
                    tmpDish = {product_id:selectTmp.realId,product_quantity:selectTmp.count,feature_id:tmpArr};
                }else{
                    //多属性的菜，移除与属性相连的id
                    tmpDish = {product_id:ix,product_quantity:selectTmp.count,feature_id:tmpArr};
                }
            }else{
                tmpDish = {product_id:ix,product_quantity:selectTmp.count};
            }
            tmpGrps.ids.push($.extend({},tmpDish));
        }
        _data.groupons.push($.extend({},tmpGrps));
    }
    return $.extend({},_data);
}
/**
 * 优惠信息
 */
var premium = {
    url: '/waimai/trade/getorderprice',
    timer: null,
    delay: 200,
    recount: 3,
    restore: function() {
        /**
         * 如果请求失败，触发失败事件
         */
        $(exports).trigger('failpremium.shopCar');
    },
    retry: function(ret) {
        var me = this;
        ret = ret || 0;
        if (ret < me.recount) {
            clearTimeout(me.timer);
            me.timer = setTimeout(function() {
                $.ajax({
                url: me.url,
                data: me.params,
                type:"post",
                dataType: 'json',
                success: function(data) {
                    if (data.error_no == 0) {
                        var prices = data.result.order_info,
                            discounts = data.result.discount_info;
                        $(exports).trigger('premium.shopCar', {prices: prices, discounts: discounts});
                    } else if(data.error_no){
                        if(!data.error_msg){
                            data.error_msg = "餐厅太忙，暂时不能接单";
                        }
                        alertDialog.alert(data);
                        me.restore();
                    } else {
                        //$(exports).trigger('failpremium.errorNo',data);
                        me.restore();
                    }
                },
                error: function() {
                    //alertDialog.alert({error_msg:"fuuuuuuuuckkkkkk"});
                    me.retry(++ret);
                }
            })
            }, me.delay);
        } else {
            me.restore();
        }
    },
    get: function(params) {
        var me = this;
        me.params = params;
        me.retry();
        // $(exports).trigger('resetpremium.shopCar');
    },
    JSONStringify: function(obj) {
        return JSON.stringify(obj);
    },
    adaptParam: function(shopid, products) {
        var me = this,
            pds = [];
        for (var i in products) {
            var pid = products[i].itemId,
                pqa = products[i].itemCount;
            //针对套餐进行扩展
            if(products[i].itemDishType && (products[i].itemDishType==2 || products[i].itemDishType=="attr")){
                // || cookie.get('s' + products[i].itemId + 's');
                // 把cookie存储变为localstorage
                var grpsData = localStore.get('s' + pid + 's') || JSON.parse(cookie.get('s' + pid + 's'));
                if(products[i].itemDishType==2){
                    //setSetmealItemStock(pqa,grpsData,products[i].itemStock);
                    pds.push(adaptSetMealForServer(pid,pqa,grpsData));
                }else{
                    //setFeatureItemStock(pid,pqa,grpsData,products[i].itemCount);
                    pds.push(adaptFeatureForServer(pid,pqa,grpsData));
                }
            }else{
                pds.push({product_id:pid, product_quantity:pqa});
            }
        }
        return {shop_id: shopid, products: me.JSONStringify(pds)};
        // return {shop_id: '4001211165899931825', products: '[{"product_id":"12247553446674325761","product_quantity":"5"}]'};
    }
};

exports = module.exports = {
    fetchPremium: function() {
         /**
         * 获取优惠信息
         */
         var params = premium.adaptParam(this.getCurShopId(), this.getCarItems());
         premium.get(params);
    },
    fetchItems: function() {
        return premium.adaptParam(this.getCurShopId(), this.getCarItems());
    },
    /**
     * 添加菜品或设置菜品数量
     * @param {
     *     itemId  菜品ID
     *     itemCount   菜品数量
     *     itemName    菜品名称    可以为空
     *     itemPrice   菜品价格    可以为空
     * }
     * */
    setCarItem: function(item) {
        var curItem, itemIdex;
        item.itemPrice && (item.itemPrice = formatPrice(item.itemPrice));
        for (itemIdex = 0, len = car.shopItem.length; itemIdex < len; itemIdex++) {
            if (car.shopItem[itemIdex].itemId == item.itemId) {
                curItem = car.shopItem[itemIdex];
                break;
            }
        }
        item.itemCount = parseInt(item.itemCount,10);
        if(item.type == "append" && curItem){
            item.itemCount += curItem.itemCount || 0;
        }
        //curItem && $.extend(item,curItem);
        /**
         * 如果item有selectFeatures属性，则判定为多规格;把相应数据存到cookie中
         */
        try{
           if(item.selectFeatures || (curItem && curItem.itemDishType=="attr")){
                item = $.extend(curItem || {},item);
                item.itemStockId = item.itemStockId || item.selectFeatures.itemId;
                //修改了库存，重置目前库存状态
                item.itemCount = setFeatureItemStock(item.itemId,item.itemStockId,item.itemCount,item.itemStock);
                if(item.itemCount<0)return;
                if(item.selectFeatures){
                    localStore.set('s' + item.itemId + 's',item.selectFeatures);
                    /*cookie.setRaw('s' + item.itemId + 's', JSON.stringify(item.selectFeatures), {
                        path: '/'
                    });*/
                }
            } 
        }catch(e){}
        
        /*
         * 如果是套餐，把库存信息存储
         */
        if(item.itemDishType=="2" || (curItem && curItem.itemDishType=="2")){
            item = $.extend(curItem || {},item);
            item.itemStockId = item.itemStockId || item.orignItemId;
            item.itemCount = setFeatureItemStock(item.itemId,item.itemStockId,item.itemCount,item.itemStock);
        }
        /*curItem 有值说明购物车已经存在 直接 +或者- ，否则 在购物车插入新的条目
          同时curItem 与 car.shopItem[itemIdex] 指向同一值
        */
        if (curItem) {
            $.extend(curItem, item);
            //如果剩余数量小于最低起订份数 删除菜品
            if (curItem.itemCount < curItem.minOrderNumber) {
                car.shopItem.splice(itemIdex, 1);
                $(exports).trigger("delete.shopCar", curItem);
                //多规格和套餐的cookie清理
                if(curItem.itemDishType==2 || curItem.selectFeatures){
                    var _date = new Date();
                    _date.setFullYear(_date.getFullYear() - 1);
                   
                    localStore.remove('s' + curItem.itemId + 's');
                    //cookie.remove('s' + curItem.itemId + 's');
                }
                
            } else {
                if($("#source_name").val() && $("#source_name").val() == "baidu"){
                    if(curItem.itemCount >= curItem.itemStock){
                        curItem.itemCount = curItem.itemStock;
                    }
                }
                $(exports).trigger("update.shopCar", curItem);
            }
        } else {
            if (!item.itemName) return;
            //多规格菜品在增加时 需要判断的逻辑
            if($("#source_name").val() && $("#source_name").val() == "baidu"){
                if(!item.itemStock || !item.itemCount)return;
                if(parseInt(item.itemStock) < parseInt(item.minOrderNumber))return;
                if(item.itemCount < item.minOrderNumber){
                    item.itemCount = item.minOrderNumber;
                }
                if(item.itemCount > item.itemStock){
                    item.itemCount = item.itemStock;
                }
            }
            car.shopItem.push(item);
            $(exports).trigger("add.shopCar", item);
        }
        //如果购物车shopItem为空 触发清空操作
        if (car.shopItem.length == 0) {
            $(exports).trigger("clear.shopCar");
        }

        saveShopCar();
    },
    /**
     * 设置当前商户信息
     * @shopName    商户名称
     * */
    setCurShopInfo: function(shopId, shopName, deliveryFee, takeOutPrice) {
        // 如果不存在，添加基本信息
        if (!car) {
            car = {};
        }
        car.shopId = shopId || car.shopId;
        car.shopName = shopName || car.shopName;
        car.deliveryFee = deliveryFee || car.deliveryFee;
        car.takeOutPrice = takeOutPrice || car.takeOutPrice;
    },
    /**
     * 获取当前商家的id以及名称
     * {
     *      shopId:
     *      shopName:
     * }
     * */
    getCurShopName: function() {
        return car.shopName;
    },
    /**
     * 获取商户ID
     * */
    getCurShopId: function() {
        return car.shopId;
    },
    /**
     * 获取当前商家的购物车明细
     * [
     *      {
     *          itemId:
     *          itemCount:
     *          itemName:
     *          itemPrice:
     *      }
     * ]
     * */
    getCarItems: function() {
        return car.shopItem;
    },
    /**
     * 清空购物车
     * */
    clearCar: function(isCommitOrder) {
        car.shopItem = [];
        saveShopCar(); !! !isCommitOrder && $(exports).trigger("clear.shopCar");
    },
    /**
     * 初始化购物车数据
     * */
    init: function(shopId) {
        curShopId = shopId + "";
        initCar();
        var me = this;
        // 增加延时，订单确认页面取不到菜品
        setTimeout(function() {
            $(exports).trigger("inited.shopCar", car);
            /**
             * 初始化时获取优惠信息
             */
        }, 0);
    },
    /**
     * 获取总金额
     * */
    getAmount: function() {
        var amount = 0,
            packFee = 0;

        $.each(car.shopItem, function(i, item) {
            packFee += item.packCount * item.packPrice * item.itemCount;
            amount += item.itemCount * item.itemPrice;
        });
        return {
            deliveryFee: formatPrice(car.deliveryFee),
            packFee: formatPrice(packFee),
            productAmount: formatPrice(amount),
            amount: formatPrice(amount + packFee + parseFloat(car.deliveryFee)),
            takeOutPrice: formatPrice(car.takeOutPrice),
            cha: formatPrice(car.takeOutPrice - amount - packFee),
            isEmpty: car.shopItem.length == 0
        }
    },
    /**
     * 购物车是否为空
     * */
    isEmpty: function() {
        if (car && car.shopItem.length > 0)
            return false;
        else
            return true;
    },
    /*
    * 重置购物车 发生于刷新选菜页面 确认订单页面
    */
    resetCar: function(shopItem){
        car.shopItem = shopItem;
        saveShopCar();
    },
    adaptSetMealForServer:adaptSetMealForServer,
    adaptFeatureForServer:adaptFeatureForServer,
    clearData:clearData
}; 
});