var GlobalErrorMonitor=require("bigba:static/utils/GlobalErrorMonitor.js"),Dialog=require("jsmod/ui/dialog");$("#content").css("min-height",$(window).height()-290),window.onerror1=function(){return GlobalErrorMonitor.error.apply(GlobalErrorMonitor,arguments),!0},window.onresize=function(){$("#content").css("min-height",$(window).height()-290)},$(function(){Dialog&&Dialog.setOpacity(.55),$(".placeholder-con").placeholder()});