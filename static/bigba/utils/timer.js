define('bigba:static/utils/timer.js', function(require, exports, module){ /**
 * 倒计时组件，提供页面倒计时显示及通知功能。
 *
 * <div data-role="timer" data-end="2014/9/25 10:00"></div>
 * new Timer({
 *		now:"2014/9/25 9:30",
 *		on:{
 *			end:function(nodes){
 *				nodes[0].node.style.display="none";
 *			}
 *		}
 * })
 */

(function(){
	var Utils = {
		tmpl: function(tmpl, data) {
			var reg = /\{([^\}]*)\}/g;

			return tmpl.replace(reg, function(m, k) {
				return (typeof data[k] !== "undefined") ? data[k] : "";
			});
		}
	}

	/**
	 * Timer构造函数
	 * @constructor
	 * @param container {String} optional 倒计时节点DOM容器，默认是document.body
	 * @param options {Object} 配置信息
	 */
	var Timer = function(container, options) {
		var me = this;

		me.nodeMapList = [];

		if ($.isPlainObject(container)) {
			options = container;
			options.container = $(document.body);
		} else {
			options = options || {};

			options.container = $(container);
		}

		me.options = $.extend({}, Timer.DEFAULTS, options);

		if (!me.paramsCheck()) {
			throw new Error("参数配置有误");
		}
		me.init();

		return me;
	}
	/**
	 * 精度枚举
	 */
	Timer.PRECISION = {
		day: "day",
		hour: "hour",
		minute: "minute",
		second: "second"
	}
	/**
	 * 默认配置
	 */
	Timer.DEFAULTS = {
		// 倒计时节点选择器（container内部的）
		selector: "[data-role='timer']",
		// 时钟步长，单位是秒，默认是1秒
		step: 1,
		// 当前时间戳
		now: 0,
		// 倒计时结束时间戳
		end: null,
		// 显示精度
		precision: Timer.PRECISION.second,
		// 倒计时显示模板
		timingTpl: "{days}天{hours}小时{minutes}分{seconds}秒",
		// 倒计时结束后的显示内容
		endTpl: "已结束"
	}
	Timer.prototype = {
		init: function() {
			var me = this,
				options = me.options,
				nodeList = $(options.selector, options.container),
				nodeMapList = me.nodeMapList,
				end;

			// 收集节点以及每个节点对应的剩余时间，方便后续处理
			nodeList.each(function(index, node) {
				end = node.getAttribute("data-end");
				if (!end) {
					//可以通过配置传入倒计时结束时间点，但节点中声明的结束时间的优先级高于配置传入的
					end=options.end>0?options.end:options.now;
				}
				nodeMapList.push({
					node: node,
					life: end - options.now
				});
			})

			//开始时钟循环
			me.loop();
		},
		/**
		 * 验证输入参数的合法性
		 * @method paramsCheck
		 * @return {boolean} 合法为true，否则为false
		 */
		paramsCheck: function() {
			var me = this,
				options = me.options,
				tmpNow,
				tmpEnd,
				emptyFn = function() {};

			options.now = options.now;
			options.end = options.end ? options.end : 0;
			options.step = parseInt(options.step);
			options.on = options.on || {};
			options.on.end = $.isFunction(options.on.end) ? options.on.end : emptyFn;


			if (!options.selector || !options.now || isNaN(options.step)) {
				return false;
			}

			//时钟步长至少为1000毫秒
			options.step = Math.max(options.step*1000, 1000);

			return true;
		},
		/**
		 * 时钟循环，当没有“活着”的节点时，将中断循环
		 */
		loop: function() {
			var me = this;

			clearTimeout(me.loopTimer);

			me.burn();
			me.filter();
			me.refresh();

			if (me.nodeMapList.length > 0) {
				me.loopTimer = setTimeout(function() {
					me.loop();
				}, me.options.step);
			}
		},
		/**
		 * 刷新显示倒计时
		 */
		refresh: function() {
			var me = this,
				timingTpl = me.options.timingTpl,
				endTpl = me.options.endTpl,
				nodeMapList = me.nodeMapList;

			$.each(nodeMapList, function(index, item) {
				item.node.innerHTML = Utils.tmpl(timingTpl, me.convertDate(item.life));
			});
		},
		/**
		 * 过滤掉已经“挂了”的倒计时，并触发响应的事件
		 */
		filter: function() {
			var me = this,
				liveMap = [],
				dieMap = [],
				options = me.options,
				nodeMapList = me.nodeMapList;

			$.each(me.nodeMapList, function(index, item) {
				if (item.life <= 0) {
					dieMap.push(item);
				} else {
					liveMap.push(item);
				}
			});

			if (dieMap.length > 0) {
				me.onEnd(dieMap);
			}

			//更新节点池
			me.nodeMapList = liveMap;
		},
		/**
		 * 时间燃尽处理
		 */
		burn: function() {
			var me = this,
				options = me.options,
				nodeMapList = me.nodeMapList;

			$.each(nodeMapList, function(index, item) {
				item.life -= options.step;
			});
		},
		/**
		 * 将毫秒转换为天、时、分、秒，precision配置参数会影响对应的值
		 * @method convertDate
		 * @param ms {Number} 毫秒值
		 * @return {days:天,hours:小时,minutes:分钟,seconds:秒}
		 */
		convertDate: function(ms) {
			var precision = this.options.precision,
				secondFactor = 1000,
				minuteFactor = secondFactor * 60,
				hourFactor = minuteFactor * 60,
				dayFactor = hourFactor * 24,
				day = 0,
				hour = 0,
				minute = 0,
				second = 0;

			switch (precision) {
				case Timer.PRECISION.day:
					day = parseInt(ms / dayFactor);
					break;
				case Timer.PRECISION.hour:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					break;
				case Timer.PRECISION.minute:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					minute = parseInt((ms % hourFactor) / minuteFactor);
					break;
				case Timer.PRECISION.second:
					day = parseInt(ms / dayFactor);
					hour = parseInt((ms % dayFactor) / hourFactor);
					minute = parseInt((ms % hourFactor) / minuteFactor);
					second = parseInt((ms % minuteFactor) / secondFactor);
					break;
			}

			return {
				days: day,
				hours: hour,
				minutes: minute,
				seconds: second
			}
		},
		/**
		 * 重启container节点中的倒计时
		 * @method restart
		 * @param node {String} 倒计时节点选择器
		 * @param now {String} 当前时间的Timestamp
		 * @param end {String} 结束时间的Timestamp
		 */
		restart: function(nodeSeler, now, end) {
			var me = this,
				node,
				nodeMap = {},
				nodeMapList = me.nodeMapList;

			node = $(nodeSeler, me.container)[0];

			if (!now || !end) {
				return;
			}

			nodeMap.node = node;
			nodeMap.life = end - now;

			if (nodeMap.life <= 0) {
				me.onEnd([nodeMap]);
			} else {

				for (var i = 0; i < nodeMapList.length; i++) {
					if (nodeMapList[i].node == node) {
						nodeMapList.splice(i, 1); //移除相同节点
						break;
					}
				}

				nodeMapList.push(nodeMap);

				me.loop();
			}

		},
		/**
		 * 倒计时结束后的处理
		 * @method onEnd
		 * @param nodeMap {Array} {node:节点,life:剩余时间}
		 */
		onEnd: function(nodeMap) {
			var me = this,
				endCallback = me.options.on.end;

			$.each(nodeMap, function(index, map) {
				map.node.innerHTML = me.options.endTpl;
			});

			endCallback(nodeMap);
		}
	}


	module.exports=Timer;
})();

 
});