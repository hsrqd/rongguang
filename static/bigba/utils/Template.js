define('bigba:static/utils/Template.js', function(require, exports, module){ /**
 * @file Template.
 * @author <a href="jason:zhoujiancheng@baidu.com">jason.zhou</a>
 * @version 1.0
 * @date 2013.07.23
 */

/**
 * @module static/utils/Template
 */

// 自定义分隔符
var LEFT_DELIMITER = '<&',
    RIGHT_DELIMITER = '&>',

    // List of HTML entities for escaping.
    htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    },

    // Regex containing the keys listed immediately above.
    htmlEscaper = /[&<>"'\/]/g,

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    templateSettings = {
        evaluate: new RegExp(LEFT_DELIMITER + '([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        interpolate: new RegExp(LEFT_DELIMITER + '=([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        escape: new RegExp(LEFT_DELIMITER + '-([\\s\\S]+?)' + RIGHT_DELIMITER, 'g'),
        // 扩展，增加数据不为空时的判断，如果数据不为空当前行不显示
        interpolateNonEmpty: new RegExp(LEFT_DELIMITER + '#([\\s\\S]+?)' + RIGHT_DELIMITER, 'g')
    },

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    noMatch = /.^/,

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    escapes = {
        '\\': '\\',
        "'": "'",
        r: '\r',
        n: '\n',
        t: '\t',
        u2028: '\u2028',
        u2029: '\u2029'
    },

    escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
    unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

// 初始化escapes
for (var key in escapes) {
    escapes[escapes[key]] = key;
}

// Escape a string for HTML interpolation.
function escape(string) {
    return ('' + string).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
    });
}
    // Within an interpolation, evaluation, or escaping, remove HTML escaping
    // that had been previously added.
function unescape(code) {
    return code.replace(unescaper, function(match, escape) {
        return escapes[escape];
    });
}

// Fill in a given object with default properties.
function apply(obj, source) {
    for (var prop in source) {
        obj[prop] = source[prop];
    }
    return obj;
}

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
/**
 * 扩展Underscore template
 * 增加了一种新的描述符<pre><&# value &></pre>用此描述符时，如果其内容为空则此描述符所在的行或所在的数组索引不显示写模板的时候要特别注意
例如：
<pre>
    &lt;ul&gt;
    <&for(var i = 0; i < test.length; i++) {&>
        &lt;li><&#test[i].name&>&lt;/li&gt;
    <&}&>
    &lt;/ul&gt;        
    相当于
    &lt;ul&gt;
    <&for(var i = 0; i < test.length; i++) {&>
        <& if (test[i].name) {&>
            &lt;li&gt;<&=test[i].name&>&lt;/li&gt;
        <& } &>
    <&}&>
    &lt;/ul&gt; 
</pre>
 * 
 * @param {String|Array} text html模版或元素id
 * @param {object} data 对应模版的数据模型
 * @returns {String|compiledFunction} html字符串或编译后的js方法
 * @example
数据：
<pre>
var data = {
    test: [{
        name:'zhang&nbsp;san'
    },{
        name:'lisi'
    },{
    },{
        name:null
    }]
};
</pre>
模版1：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&#test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
模版2：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&=test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
模版3：
<pre>
&lt;textarea id="tpl1"&gt;
&lt;ul&gt;
<&for(var i = 0; i < test.length; i++) {&>
    &lt;li&gt;<&-test[i].name&>&lt;/li&gt;
<&}&>
&lt;/ul&gt; 
&lt;/textarea&gt;
</pre> 
// require Template 模块
var tpl = require("common:static/utils/Template.js");
tpl('tpl1', data);
tpl('tpl2', data);
tpl('tpl3', data);
输出结果分别是
结果1：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
&lt;/ul&gt;
</pre>
结果2：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
结果3：
<pre>
&lt;ul&gt;    
    &lt;li&gt;zhang&nbsp;san&lt;/li&gt;    
    &lt;li&gt;lisi&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
 */
module.exports = function(text, data, options) {
    var element,
        settings;
    if (Object.prototype.toString.call(text) == '[object String]') {
        var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
        if (element = document.getElementById(text)) {
            text = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
        }
        text = text.replace(trimer, '');
        text = text.split('\n');
    }
    // 查询数据第一项目，如果符合条件则添加if判断 by jason
    // 增加如果本行有多个描述符，则添加多层if判断
    if (Object.prototype.toString.call(text) == '[object Array]') {
        for (var i = 0, t; t = text[i]; i++) {
            var ifFilter = []; // if 条件
            t.replace(templateSettings.interpolateNonEmpty, function(match, code){
                ifFilter.push(code);
            });
            if (ifFilter.length > 0) {
                text.splice(i, 1, LEFT_DELIMITER + ' if ('+ifFilter.join("&&")+') { ' + RIGHT_DELIMITER + t + LEFT_DELIMITER + ' } ' + RIGHT_DELIMITER);
            }
        }
    }
    text = text.join('');
    settings = apply(settings || {}, templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p.push('" + text.replace(escaper, function(match) {
            return '\\' + escapes[match];
        }).replace(settings.escape || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__.escape(__t))+\n'";
        }).replace(settings.interpolate || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.interpolateNonEmpty || noMatch, function(match, code) {
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.evaluate || noMatch, function(match, code) {
            return "');\n" + unescape(code) + "\n__p.push('";
        }) + "');\n";

        // "for(var __i in opts) {if(opts.hasOwnProperty(__i)){if(obj[__i]){throw new Error('key[' +__i+'] Already exists');}obj[__i] = opts[__i];}}\n"

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' 
            + source 
        + '}\n';

        source = "var __t,__p=[],__j=Array.prototype.join," 
        + "print=function(){__p.push(__j.call(arguments,''))};\n" 
        + source 
        + "return __p.join('');\n";

    var render = new Function(settings.variable || 'obj', '__', source),
        // 模版编译后传入的参数
        opts = {
            '__escape': escape
        };
    _.extend(opts, options || {});   
    if (data) return render(data, opts);
    var template = function(data, _opts) {
        _.extend(opts, _opts);
        return render.call(this, data, opts);
    };

    // Provide the compiled function source as a convenience for precompilation.
    // template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
    
    return template;
}
 
});