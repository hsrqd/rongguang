define("bigba:static/utils/CartDataCenter.js",function(e,t,r){function i(e){return(Math.round(10*e)/10).toFixed(1)}function o(e,t){_value=encodeURIComponent(t),f.setRaw("s"+e+"s",_value,{path:"/"}),v.set("s"+e+"s",t)}function n(e){return v.get("s"+e+"s")||f.get("s"+e+"s")}function a(e){u(n(e));f.remove("s"+e+"s"),v.remove("s"+e+"s"),v.clear()}function s(e){var t,r=[];return $.each(e.shopItem,function(e,t){r.push([t.itemId,t.itemCount,t.itemName,t.itemPrice,t.packCount,t.packPrice,t.minOrderNumber,t.itemStock,t.itemDishType,t.itemStockId].join(g.item))}),t=[e.shopName,e.shopId,e.deliveryFee,e.takeOutPrice,r.join(g.itemToItem)].join(g.shopToItem)}function u(e){if(!e)return{shopName:"",shopId:"",deliveryFee:0,takeOutPrice:0,shopItem:[]};var t=e.split(g.shopToItem),r={};return t.length>=1&&(r.shopName=t[0]),t.length>=2&&(r.shopId=t[1]+""),t.length>=3&&(r.deliveryFee=t[2]),t.length>=4&&(r.takeOutPrice=t[3]),r.shopItem=[],t.length>=5&&(t=t[4])&&(t=t.split(g.itemToItem),$.each(t,function(e,t){var i=t.split(g.item);if(i[0]&&2==i[8]){var o=v.get("s"+i[0]+"s");if(!o)return}r.shopItem.push({itemId:i[0],itemCount:parseInt(i[1]),itemName:i[2],itemPrice:i[3],packCount:i[4],packPrice:i[5],minOrderNumber:i[6],itemStock:parseInt(i[7]),itemDishType:i[8],itemStockId:i[9]})})),r}function m(){o(I,s(l))}function c(){l=u(n(I)),l.shopId=I}function d(e,r,i,o){var n=0,a=!1;for(o=parseInt(o),i=parseInt(i),itemIdex=0,len=l.shopItem.length;len>itemIdex;itemIdex++)l.shopItem[itemIdex].itemStockId==r&&(l.shopItem[itemIdex].itemId==e?(n+=i,a=!0):n+=l.shopItem[itemIdex].itemCount);return a||(n+=i),n>=o?$(t).trigger("features.stockTight",{sid:r,num:o}):o>n&&$(t).trigger("features.stockNormal",r),n>o?i+o-n:i}function p(e,t,r){if(r){var i={product_id:r.itemId,product_quantity:t,feature_id:[]};for(var o in r.select)"规格"!=o?i.feature_id.push(r.select[o].id):i.product_id=r.select[o].id;return $.extend({},i)}}function h(e,t,r){if(r){var i,o,n,a={product_id:r.basic.id,product_quantity:t,groupons:[]};for(var s in r.data)if(r.data[s].total&&r.data[s].total.count){i={dish_group_id:s,ids:[]};for(var u in r.data[s])if("total"!=u&&(n=r.data[s][u],n.count)){if(n.features&&n.features.length){var m=$.extend([],n.features);n.realId?(m.splice($.inArray(n.realId,m),1),o={product_id:n.realId,product_quantity:n.count,feature_id:m}):o={product_id:u,product_quantity:n.count,feature_id:m}}else o={product_id:u,product_quantity:n.count};i.ids.push($.extend({},o))}a.groupons.push($.extend({},i))}return $.extend({},a)}}var t,l,I,f=e("bigba:static/utils/Cookie.js"),g=(e("bigba:static/util.js"),{shopToItem:"##",itemToItem:"$$",item:"^^"}),C=e("bigba:widget/common/ui/cartAlert/cartAlert.js"),v=e("bigba:static/utils/store.js"),y={url:"/waimai/trade/getorderprice",timer:null,delay:200,recount:3,restore:function(){$(t).trigger("failpremium.shopCar")},retry:function(e){var r=this;e=e||0,e<r.recount?(clearTimeout(r.timer),r.timer=setTimeout(function(){$.ajax({url:r.url,data:r.params,type:"post",dataType:"json",success:function(e){if(0==e.error_no){var i=e.result.order_info,o=e.result.discount_info;$(t).trigger("premium.shopCar",{prices:i,discounts:o})}else e.error_no?(e.error_msg||(e.error_msg="餐厅太忙，暂时不能接单"),C.alert(e),r.restore()):r.restore()},error:function(){r.retry(++e)}})},r.delay)):r.restore()},get:function(e){var t=this;t.params=e,t.retry()},JSONStringify:function(e){return JSON.stringify(e)},adaptParam:function(e,t){var r=this,i=[];for(var o in t){var n=t[o].itemId,a=t[o].itemCount;if(!t[o].itemDishType||2!=t[o].itemDishType&&"attr"!=t[o].itemDishType)i.push({product_id:n,product_quantity:a});else{var s=v.get("s"+n+"s")||JSON.parse(f.get("s"+n+"s"));i.push(2==t[o].itemDishType?h(n,a,s):p(n,a,s))}}return{shop_id:e,products:r.JSONStringify(i)}}};t=r.exports={fetchPremium:function(){var e=y.adaptParam(this.getCurShopId(),this.getCarItems());y.get(e)},fetchItems:function(){return y.adaptParam(this.getCurShopId(),this.getCarItems())},setCarItem:function(e){var r,o;for(e.itemPrice&&(e.itemPrice=i(e.itemPrice)),o=0,len=l.shopItem.length;len>o;o++)if(l.shopItem[o].itemId==e.itemId){r=l.shopItem[o];break}e.itemCount=parseInt(e.itemCount,10),"append"==e.type&&r&&(e.itemCount+=r.itemCount||0);try{if(e.selectFeatures||r&&"attr"==r.itemDishType){if(e=$.extend(r||{},e),e.itemStockId=e.itemStockId||e.selectFeatures.itemId,e.itemCount=d(e.itemId,e.itemStockId,e.itemCount,e.itemStock),e.itemCount<0)return;e.selectFeatures&&v.set("s"+e.itemId+"s",e.selectFeatures)}}catch(n){}if(("2"==e.itemDishType||r&&"2"==r.itemDishType)&&(e=$.extend(r||{},e),e.itemStockId=e.itemStockId||e.orignItemId,e.itemCount=d(e.itemId,e.itemStockId,e.itemCount,e.itemStock)),r)if($.extend(r,e),r.itemCount<r.minOrderNumber){if(l.shopItem.splice(o,1),$(t).trigger("delete.shopCar",r),2==r.itemDishType||r.selectFeatures){var a=new Date;a.setFullYear(a.getFullYear()-1),v.remove("s"+r.itemId+"s")}}else $("#source_name").val()&&"baidu"==$("#source_name").val()&&r.itemCount>=r.itemStock&&(r.itemCount=r.itemStock),$(t).trigger("update.shopCar",r);else{if(!e.itemName)return;if($("#source_name").val()&&"baidu"==$("#source_name").val()){if(!e.itemStock||!e.itemCount)return;if(parseInt(e.itemStock)<parseInt(e.minOrderNumber))return;e.itemCount<e.minOrderNumber&&(e.itemCount=e.minOrderNumber),e.itemCount>e.itemStock&&(e.itemCount=e.itemStock)}l.shopItem.push(e),$(t).trigger("add.shopCar",e)}0==l.shopItem.length&&$(t).trigger("clear.shopCar"),m()},setCurShopInfo:function(e,t,r,i){l||(l={}),l.shopId=e||l.shopId,l.shopName=t||l.shopName,l.deliveryFee=r||l.deliveryFee,l.takeOutPrice=i||l.takeOutPrice},getCurShopName:function(){return l.shopName},getCurShopId:function(){return l.shopId},getCarItems:function(){return l.shopItem},clearCar:function(e){l.shopItem=[],m(),!e&&$(t).trigger("clear.shopCar")},init:function(e){I=e+"",c();setTimeout(function(){$(t).trigger("inited.shopCar",l)},0)},getAmount:function(){var e=0,t=0;return $.each(l.shopItem,function(r,i){t+=i.packCount*i.packPrice*i.itemCount,e+=i.itemCount*i.itemPrice}),{deliveryFee:i(l.deliveryFee),packFee:i(t),productAmount:i(e),amount:i(e+t+parseFloat(l.deliveryFee)),takeOutPrice:i(l.takeOutPrice),cha:i(l.takeOutPrice-e-t),isEmpty:0==l.shopItem.length}},isEmpty:function(){return l&&l.shopItem.length>0?!1:!0},resetCar:function(e){l.shopItem=e,m()},adaptSetMealForServer:h,adaptFeatureForServer:p,clearData:a}});