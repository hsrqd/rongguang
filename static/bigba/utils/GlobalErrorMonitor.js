define("bigba:static/utils/GlobalErrorMonitor.js",function(r,e,n){function i(r){var e,n={};if("object"==typeof r){if(n.ua=window.navigator.userAgent,n.page_url=window.location.href,e=r.stack)n.stack=e;else for(var i in r)r.hasOwnProperty(i)&&"string"==typeof r[i]&&(n[i]=r[i]);(new Image).src=o+encodeURIComponent(JSON.stringify(n))}}var o="/waimai?qt=feerror&msg=";n.exports={error:function(r,e,n){if(1===arguments.length)return void i(r);if(e){var o={};o.message=r,o.url=e,o.line=n,i(o)}}}});