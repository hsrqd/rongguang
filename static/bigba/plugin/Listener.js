!function(){var n=50,t=25,e={},r=[].slice,a={},c=function(n,t,r,c){var o=a[n];o||(o=a[n]={}),o[t]=o[t]||[],o[t].push({func:r,context:c||e})},o=function(n,t,r,a){var o=function(){return e.off(n,t,o),r.apply(a||e,arguments)};c(n,t,o,a)},f=function(e,c){if(a[e]&&a[e][c]&&a[e][c].length){for(var o=a[e][c],f=[],i=o.length;i--;)f.push({handler:o[i],args:r.call(arguments,1)});!function(){var e=+new Date;do{var r=f.shift(),a=r.handler;try{a.func.apply(a.context,r.args)}catch(c){}}while(f.length&&+new Date-e<n);f.length>0&&setTimeout(arguments.callee,t)}()}},i=function(n,t,r,c){if(c=c||e,a[n]&&a[n][t]&&a[n][t].length)for(var o,f=a[n][t],i=f.length;i--;)o=f[i],o.func===r&&o.context===c&&f.splice(i,1)};e.on=c,e.once=o,e.trigger=f,e.off=i,window.listener=window.listener||e}();