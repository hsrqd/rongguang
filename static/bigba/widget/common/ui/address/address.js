define('bigba:widget/common/ui/address/address.js', function(require, exports, module){ /**
 * @file Address.
 * @author boye.liu
 * @date 2014.07.23
 * @评论：
 * 耦合性太高，卡片与编辑应该分开;
 * 事件绑定写的太固化
 * 无数据监控
 */
var Dialog = require("jsmod/ui/dialog");
var listTmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('<li class="addr-item" data-id="',typeof(item.id) === 'undefined'?'':baidu.template._encodeHTML(item.id),'" data-msg = "',typeof(item.user_name) === 'undefined'?'':baidu.template._encodeHTML(item.user_name),'$',typeof(item.gender) === 'undefined'?'':baidu.template._encodeHTML(item.gender),'$',typeof(item.user_phone) === 'undefined'?'':baidu.template._encodeHTML(item.user_phone),'$',typeof(item.sug_address) === 'undefined'?'':baidu.template._encodeHTML(item.sug_address),'$',typeof(item.detail_address) === 'undefined'?'':baidu.template._encodeHTML(item.detail_address),'$',typeof(item.location) === 'undefined'?'':baidu.template._encodeHTML(item.location),'">    <div class="addr-title">        <div class="addr-user">            <span class="name">',typeof(item.user_name) === 'undefined'?'':baidu.template._encodeHTML(item.user_name),'</span>            <span class="sex">',typeof((item.gender == 2 ? "女士" : "先生")) === 'undefined'?'':baidu.template._encodeHTML((item.gender == 2 ? "女士" : "先生")),'</span>        </div>        <div class="addr-action">            <a class="addr-edit">编辑</a>            <a class="addr-remove">删除</a>        </div>    </div>    <div class="addr-con">        <p class="phone">',typeof(item.user_phone) === 'undefined'?'':baidu.template._encodeHTML(item.user_phone),'</p>        <p class="addr-desc">',typeof(item.address) === 'undefined'?'':baidu.template._encodeHTML(item.address),'</p>    </div>    <span class="select-ico"></span></li>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var detailTeml = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="addr-detail" id="new-address-section">    <form>        <table class="addr-table" border="0">            <tr>                <td valign="top"><span class="l-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span></td>                <td>                    <input type="hidden" value="',typeof(data.id) === 'undefined'?'':baidu.template._encodeHTML(data.id),'" name="adrr_id">                    <div class="form-group">                        <div class="input-control">                            <input type="text" name="user_name" placeholder="您的姓名" value="',typeof(data.user_name) === 'undefined'?'':baidu.template._encodeHTML(data.user_name),'" class="placeholder-con">                            <span class="star">*</span>                        </div>                        <div class="error-msg v-hide">请填写您的姓名，不能超过8个字符</div>                    </div>                    <div class="form-group">                        <div class="input-control">                                                        <input type="hidden" name="gender" value="',typeof((data.gender?data.gender:1)) === 'undefined'?'':baidu.template._encodeHTML((data.gender?data.gender:1)),'">                            <div class="s-gender ');if(parseInt(data.gender,10) === 1 || isNaN(parseInt(data.gender,10))){_template_fun_array.push(' selected ');}_template_fun_array.push('" data-gender="1"  >                                <i></i><span>先生</span>                            </div>                            <div class="s-gender ');if(data.gender == 2){_template_fun_array.push(' selected ');}_template_fun_array.push('" data-gender="2">                                <i></i><span>女士</span>                            </div>                        </div>                        <div class="error-msg v-hide">请选择您的性别</div>                    </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</span></td>                <td>                    <div class="form-group">                        <div class="input-control">                            <input type="text" name="user_phone" placeholder="11位手机号" value="',typeof(data.user_phone) === 'undefined'?'':baidu.template._encodeHTML(data.user_phone),'" class="placeholder-con">                            <span class="star">*</span>                        </div>                        <div class="error-msg v-hide">请填写正确的手机号</div>                    </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置</span></td>                <td>                    <div class="form-group">                        <div class="input-control poi_address">                            <i class="addr-icon-input"></i>                            <input type="text" name="sug_address" id="poi_address" placeholder="请输入小区、大厦或学校" value="',typeof(data.sug_address) === 'undefined'?'':baidu.template._encodeHTML(data.sug_address),'" class="placeholder-con">                            <span class="star">*</span>                                                        <input type="hidden" name="hide_sug_address" value="',typeof(data.lat) === 'undefined'?'':baidu.template._encodeHTML(data.lat),'-',typeof(data.lng) === 'undefined'?'':baidu.template._encodeHTML(data.lng),'" id="hide_poi_address">                        </div>                        <div class="error-msg v-hide">请输入地址并在下拉框中进行选择</div>                        <div class="s-search-container2"></div>                                            </div>                </td>            </tr>            <tr>                <td valign="top"><span class="l-label">详细地址</span></td>                <td>                    <div class="form-group">                        <div class="input-control">                                                        <input type="text" name="detail_address" placeholder="请输入门牌号等详细信息" value="',typeof(data.detail_address) === 'undefined'?'':baidu.template._encodeHTML(data.detail_address),'" class="placeholder-con">                        </div>                        <div class="error-msg v-hide">请输入门牌号等详细信息</div>                    </div>                </td>            </tr>        </table>        <div class="form-group form-submit">            <input type="button" class="saveBtn" data-node="saveBtn" value="');if(!!confirmTxt){_template_fun_array.push('',typeof(confirmTxt) === 'undefined'?'':baidu.template._encodeHTML(confirmTxt),'');}else{_template_fun_array.push('保存');}_template_fun_array.push('">            ');if(!noCancel){_template_fun_array.push('                <input type="button" class="escBtn versa" value="取消">            ');}_template_fun_array.push('        </div>    </form></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var GlobalTips = require('bigba:static/utils/GlobalTips.js');
var cacheDialog;
window.NOBLUR = "NOPE";

var CookieDataCenter = require("bigba:static/utils/CookieDataCenter.js");
var Search = require("bigba:widget/common/ui/search/search.js");
/*
 * AJAX请求URL
 */
var ADD_AJAX = "/waimai?qt=addressmanage&type=add&display=json";
var UPDATE_AJAX = "/waimai?qt=addressmanage&type=update&display=json";
var REMOVE_AJAX = "/waimai?qt=addressmanage&type=del&display=json";
var SETDEFAULT_AJAX = "/waimai?qt=addressmanage&type=set&display=json";
/*
 * _opt = {
 *   data : data
 *   $listEl : 列表父级DOM
 *   $addBtn : 新增DOM
 *   $detailEl : 对话框DOM 无需传入
 *   listComplete : 列表初始化完成触发事件
 *   dialogShow: 对话框弹出触发,
 *   saveSuccess: 保存成功触发,
 *   reForm:true //data 为空返回表单
 *}
 */
var _opt = {
    data: [],
    $listEl: null,
    $addBtn: null,
    $detailEl: null,
    listComplete: null,
    itemRemove: null,
    dialogShow: null,
    saveSuccess: null,
    reForm: true
}

function Address(opt) {
    this.opt = $.extend({}, _opt, opt);
    this.bindEvent();
    this.initList();
}
$.extend(Address.prototype, {
    /*暂时未用到*/
    checkTotal: function() {
        var len = this.opt.$listEl.find("li.addr-item:not('.addr-add')").length;
        if (len >= 10) {
            this.opt.$addBtn.addClass('hide');
        } else {
            this.opt.$addBtn.removeClass('hide');
        }
    },
    bindEvent: function() {
        var $me = this.opt.$listEl;
        var self = this;
        $me.on("click", ".addr-edit", function(event) {
            var _data = {};
            var _msg = $(this).closest('li').attr("data-msg");
            var _arr = _msg.split("$");
            _data.id = $(this).closest('li').attr("data-id");
            _data.user_name = _arr[0];
            _data.gender = _arr[1];
            _data.user_phone = _arr[2];
            _data.sug_address = _arr[3];
            _data.detail_address = _arr[4];
            _data.lng = _arr[5].split(",")[0];
            _data.lat = _arr[5].split(",")[1];

            self.showDetailDialog(_data);
            event.preventDefault();
            event.stopPropagation();
        });
        $me.on("click", ".addr-remove", function(event) {
            self.removeAddress($(this).closest('li'));
            event.preventDefault();
            event.stopPropagation();
        });
        this.opt.$addBtn && this.opt.$addBtn.on("click", function() {
            var len = self.opt.$listEl.find("li.addr-item:not('.addr-add')").length;
            if (len >= 10) {
                self.errorTip("最多只能添加10个送货地址");
                return;
            };
            self.showDetailDialog();
        });
        /**
         * 列表加载完成触发
         */
        $(this).on("listComplete", function() {
            this.opt.listComplete && this.opt.listComplete(self);
            var $poiaddressEl = $("#new-address-section");
            this.initSugEvent($poiaddressEl);

            $(document).on("click", function() {
                $poiaddressEl.find(".s-selected").hide();
                $poiaddressEl.find(".s-search-container2").hide();
            });
        });
        /**
         * 对话框弹出
         */
        $(this).on("dialogShow", function() {
            this.opt.dialogShow && this.opt.dialogShow(self);
        });
        /**
         * 内嵌网页显示触发
         */
        if (this.opt.$detailEl) {
            this.opt.$detailEl.on("click", ".saveBtn", function() {
                self.saveAddress();
            });
            this.opt.$detailEl.on("click", ".escBtn", function() {
                self.cacheDialog.hide({
                    fade: true
                });
                //self.cacheDialog.destory();
            });
        }
        /**
         * 保存成功触发
         */
        $(this).on("saveSuccess", function(e, data) {
            if (this.opt.saveSuccess) {
                this.opt.saveSuccess(self, data);
            } else {
                self.cacheDialog.hide({
                    fade: true
                });
                this.successTip("保存成功，正在刷新...");
                setTimeout(function() {
                    window.location.reload();
                }, 1500);
            }
        });
        /**
         * 删除地址触发
         */
        $(this).on("itemRemove", function(e, id) {
            if (this.opt.itemRemove) {
                self.opt.itemRemove(self, id);
            } else {
                //$li.fadeOut();
            }
        });
    },
    initList: function() {
        var data = this.opt.data;
        if (this.opt.data && this.opt.data.length > 0) {
            this.opt.$listEl.prepend(listTmpl({
                data: this.opt.data
            }));
        }
        /*else if(this.opt.reForm){
            //如果地址数据为空，
            this.opt.$detailE.append(detailTeml());
        }*/
        $(this).trigger('listComplete');
    },
    initSugEvent: function(obj) {
        var self = this;
        var $poiaddressEl = obj;
        var $resultEl = $poiaddressEl.find(".s-search-container2");
        var $searchConEl = $poiaddressEl.find('#poi_address');
        var $searchPOI = $poiaddressEl.find("#poi_address");
        var $hiddenSearchPOI = $poiaddressEl.find("#hide_poi_address");

        Search.init({
            $resultEl: $resultEl,
            $searchConEl: $searchConEl,
            showHistoryTrg: 'address.show.history',
            hideHistoryTrg: 'address.hide.history',
            NOListLiJump: 'NOPE',
            $hiddenSearchPOI: $hiddenSearchPOI
        });

        $searchPOI.on("click", function(e) {
            self.showSearch($poiaddressEl);
            e.stopPropagation();
        });

        $('.mod-dialog-wrap').on("click", function(e) {
            $resultEl.hide();
            e.stopPropagation();

        });

        $searchConEl.on('blur', function() {
            if (window.NOBLUR == "NOPE") {
                self.checkForm("SUG");
            }
        })

    },
    showSearch: function(obj) {
        var self = this;
        var $searchPOI = obj.find("#poi_address");
        //$searchPOI.val("");
        $searchPOI.focus();

        $(Search).trigger('hide.history');

    },
    bindGenderEvent: function($detail) {
        $detail.on("click", ".s-gender", function() {
            if ($(this).hasClass('selected')) {
                return;
            } else {
                $(".s-gender").removeClass('selected');
                $(this).addClass('selected');
                var _gender = $(this).attr("data-gender");
                $(this).parent().find("[name='gender']").val(_gender);
            }
        });
    },
    showDetailDialog: function(data) {
        var _data = data ? data : {}; /*{user_name:"李利德",gender:"1",user_phone:"15201116963",address:"百度测试百度测试"}*/ ;
        var _html = detailTeml({
            data: _data,
            noCancel: false,
            confirmTxt: "保存"
        });
        this.cacheDialog = new Dialog({
            html: _html,
            width: 560,
            height: 400
        });
        this.cacheDialog.show({
            fade: true
        });
        this.opt.$detailEl = $(".addr-detail");
        $(".placeholder-con").placeholder();
        this.bindGenderEvent(this.opt.$detailEl);
        $(this).trigger('dialogShow');

        this.initSugEvent(this.opt.$detailEl);
    },
    removeAddress: function($li) {
        var _id = $li.attr("data-id");
        $.ajax({
            url: REMOVE_AJAX,
            type: "GET",
            dataType: "json",
            data: {
                id: _id,
                bdstoken: $("#bdstoken").val()
            },
            context: this,
            success: function(rs) {
                if (rs.error_no == 0) {
                    $li.fadeOut();
                    $li.remove();
                    this.successTip("送餐地址删除成功");
                    $(this).trigger("itemRemove", _id);
                } else {
                    var msg = rs.error_msg ? rs.error_msg : "服务器累了，请稍后重试";
                    this.errorTip(msg);
                }
            }
        });
    },
    saveAddress: function() {
        this.errorHide();
        if (this.checkForm()) {
            var data = this.getFormData();
            data.bdstoken = $("#bdstoken").val();
            var ajaxUrl = data.id ? UPDATE_AJAX : ADD_AJAX;
            $.ajax({
                url: ajaxUrl,
                type: "POST",
                dataType: "json",
                data: data,
                context: this,
                success: function(rs) {
                    if (rs.error_no == 0) {
                        data.__type = data.id ? "update" : "add";
                        data.id = data.id || rs.result.id || "";
                        $(this).trigger("saveSuccess", data);
                    } else {
                        var msg = rs.error_msg ? rs.error_msg : "服务器累了，请稍后重试";
                        this.errorTip(msg);
                    }
                }
            })
        }
    },
    checkForm: function(SUG) {
        var sug = SUG ? 1 : 0;
        if (sug) {
            var sug_address = this.getInputValue("sug_address");
            var loc = this.opt.$detailEl.find("#hide_poi_address").val();
            if (!$.trim(sug_address) || sug_address.length > 40 || !loc) {
                this.errorShow("sug_address");
            }
            return false;
        }

        var user_name = this.getInputValue("user_name");
        if (!$.trim(user_name) || user_name.length > 8) {
            this.errorShow("user_name");
            return false;
        }
        var gender = this.getInputValue("gender");
        if (!gender) {
            this.errorShow("gender");
            return false;
        }
        var user_phone = this.getInputValue("user_phone");
        if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(user_phone))) {
            this.errorShow("user_phone");
            return false;
        }
        var sug_address = this.getInputValue("sug_address");
        var loc = this.opt.$detailEl.find("#hide_poi_address").val();
        if (!$.trim(sug_address) || sug_address.length > 40 || !loc) {
            this.errorShow("sug_address");
            return false;
        }
        return true;
    },
    getFormData: function() {
        var $inputEls = this.opt.$detailEl.find(".input-control");
        var result = {};
        for (var i = 0, len = $inputEls.length; i < len; i++) {
            var _$tmp = $inputEls.eq(i);
            var _name = _$tmp.find("input").length ? _$tmp.find("input").attr("name") : _$tmp.find("textarea").attr("name");
            result[_name] = this.getInputValue(_name);
        }
        result.id = this.getInputValue("adrr_id");
        var loc = $inputEls.find("#hide_poi_address").val();
        result.lat = loc.split('-')[0] ? loc.split('-')[0] : "";
        result.lng = loc.split('-')[1] ? loc.split('-')[1] : "";

        result.address = result.sug_address + " " + result.detail_address;
        return result;
    },
    successTip: function(msg) {
        GlobalTips.tip(msg);
    },
    errorTip: function(msg) {
        GlobalTips.tip(msg);
    },
    errorShow: function(name) {
        $("[name='" + name + "']").parent().next().removeClass('v-hide');
        $("[name='" + name + "']").addClass('caution-line');
        this.errorHide(2500, name);
    },
    errorHide: function(duration, name) {
        var duration = duration ? duration : 0;
        var name = name ? name : '';

        if (duration) {
            setTimeout(function() {
                $(".error-msg").addClass('v-hide');
                if (name) {
                    $("[name='" + name + "']").removeClass('caution-line');
                }
            }, duration);
            return;
        }

        $(".error-msg").addClass('v-hide');
    },
    getInputValue: function(name) {
        var inputEl = this.opt.$detailEl.find("[name='" + name + "']");
        var tagName = inputEl.get(0).tagName.toLowerCase(),
            type = inputEl.attr('type'),
            getRadioValue = function() {
                var radioEl = $(" input[name='" + name + "']").filter(':checked');
                if (radioEl.length) {
                    return radioEl.val();
                }
                return null;
            },
            getCheckBoxValueByArray = function() {
                var result = [],
                    chxEl = $(" input[name='" + name + "']:checkbox");
                len = chxEl.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (chxEl[i].checked) {
                            result.push(chxEl[i].value);
                        }
                    }
                }
                return result;
            },
            getRedirectValue = function() {
                return inputEl.val();
            };
        switch (tagName) {
            case "input":
                switch (type) {
                    case "radio":
                        return getRadioValue();
                        break;
                    case "checkbox":
                        return getCheckBoxValueByArray();
                        break;
                    default:
                        return getRedirectValue();
                        break;
                };
                break;
            case "select":
                return getRedirectValue();
                break;
            case "textarea":
                return getRedirectValue();
                break;
            default:
                return null;
                break;
        }
    },
    addFormHtml: function() {
        //user_name:"李利德",gender:"1",user_phone:"15201116963",address:"百度测试百度测试"
        return detailTeml({
            data: {},
            noCancel: true,
            confirmTxt: "保存送餐信息"
        });
    },
    updateOpt: function(data) {
        this.opt = $.extend({}, this.opt, data);
    }
});
module.exports = Address; 
});