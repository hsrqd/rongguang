var echo = function (msg) {
    console && console.info(msg)
};
(function (global) {

    var objectEach = function (obj, func, scope) {
        for (var x in obj)
            if (obj.hasOwnProperty(x))
                func.call(scope || global, x, obj[x]);
    };

    var arrayEach = Array.prototype.forEach ? function (obj, func) {
        Array.prototype.forEach.call(obj || [], func);
    } : function (obj, func) {
        for (var i = 0 , len = obj && obj.length || 0; i < len; i++)
            func.call(window, obj[i], i);
    };

    var extend = function (params, notOverridden) {
        objectEach(params, function (name, value) {
            var prev = this[ name ];
            if (prev && notOverridden === true)
                return;
            this[ name ] = value;
            if (typeof value === 'function') {
                value.$name = name;
                value.$owner = this;
                if (prev)
                    value.$prev = prev;
            }
        }, this);
    };

    var ns = function (name) {
        var part = global,
            parts = name && name.split('.') || [];

        arrayEach(parts, function (partName) {
            if (partName) {
                part = part[ partName ] || ( part[ partName ] = {});
            }
        });

        return part;
    };


    /**
     * @class XNative
     * @description Base Class , All classes in XClass inherit from XNative
     */

    var XNative = function (params) {

    };

    /**
     * @description mixin
     * @static
     * @param XNative
     * @return self
     */
    XNative.mixin = function (object) {
        this.mixins.push(object);
        extend.call(this.prototype, object.prototype, true);
        return this;
    };

    /**
     * @description implement functions to class
     * @static
     * @param object
     * @return self
     */
    XNative.implement = function (params) {
        extend.call(this.prototype, params);
        return this;
    };


    /**
     * @description implement functions to instance
     * @static
     * @param object
     * @return self
     */

    XNative.prototype.implement = function (params) {
        extend.call(this, params);
        return this;
    };


    /**
     * @description call super class's function
     * @return {Object}
     */
    XNative.prototype.parent = function () {
        var caller = this.parent.caller ,
            func = caller.$prev;
        if (!func)
            throw new Error('can not call parent');
        else {
            return func.apply(this, arguments);
        }
    };

    var PROCESSOR = {
        'statics': function (newClass, methods) {
            objectEach(methods, function (k, v) {
                newClass[ k ] = v;
            });
        },
        'extend': function (newClass, superClass) {
            var superClass = superClass || XNative , prototype = newClass.prototype , superPrototype = superClass.prototype;

            //process mixins
            var mixins = newClass.mixins = [];

            if (superClass.mixins)
                newClass.mixins.push.apply(newClass.mixins, superClass.mixins);

            //process statics
            objectEach(superClass, function (k, v) {
                newClass[ k ] = v;
            })

            //process prototype
            objectEach(superPrototype, function (k, v) {
                prototype[ k ] = v;
            });

            newClass.superclass = prototype.superclass = superClass;
        },
        'mixins': function (newClass, value) {

            arrayEach(value, function (v) {
                newClass.mixin(v);
            });
        }
    };

    var PROCESSOR_KEYS = ['statics', 'extend', 'mixins'];

    /**
     * @class XClass
     * @description Class Factory
     * @param  {Object} params
     * @return {Object} object ：New Class
     * @example new XClass({
     *     statics : {
     *         static_method : function(){}
     *     },
     *     method1 : function(){},
     *     method2 : function(){},
     *     extend : ExtendedClass,
     *     mixins : [ MixedClass1 , MixedClass2 ],
     *     singleton : false
     * });
     */
    function XClass(params) {

        var singleton = params.singleton;

        var XClass = function () {
            var me = this , args = arguments;

            if (singleton)
                if (XClass.singleton)
                    return XClass.singleton;
                else
                    XClass.singleton = me;

            me.mixins = {};

            arrayEach(XClass.mixins, function (mixin) {
                mixin.prototype.initialize && mixin.prototype.initialize.apply(me, args);

                if (mixin.prototype.name)
                    me.mixins[ mixin.prototype.name ] = mixin.prototype;

            });
            return me.initialize && me.initialize.apply(me, arguments) || me;
        };


        var methods = {};

        arrayEach(PROCESSOR_KEYS, function (key) {
            PROCESSOR[ key ](XClass, params[ key ], key);
        });

        objectEach(params, function (k, v) {
            if (!PROCESSOR[ k ])
                methods[ k ] = v;
        });

        extend.call(XClass.prototype, methods);

        return XClass;
    }

    XClass.utils = {
        object: {
            each: objectEach
        },
        array: {
            forEach: arrayEach
        },
        ns: ns
    };

    XClass.define = function (className, params) {
        if (className) {
            var lastIndex = className && className.lastIndexOf('.') || -1 , newClass;
            return ns(lastIndex === -1 ? null : className.substr(0, lastIndex))[ className.substr(lastIndex + 1) ] = new XClass(params);
        } else
            throw new Error('empty class name!');
    };

    global.Class = XClass;

})(window);
(function () {
    Class.define("plugin.Base", {
        statics: {
            main: function (param) {
                var _self = this, root, _class;
                param = param || {};
                if (param.$root) {
                    root = param.$root;
                    delete param.$root;
                }
                param.extend = _self;
                var _class = new Class(param);
                return new _class(root);
            }
        },
        initialize: function (root) {
            this.v_setRootNode(root);
            this.v_bindEvent();
        },
        //要绑定代理的方法
        v_eventBindType: function () {
            return "click focusin focusout change keyup keydown mousedown mouseup mousemove mouseout";
        },
        //绑定代理
        v_bindEvent: function () {
            var self = this;
            $(self.$root).delegate(self._v_selectot(), self.v_eventBindType(), function (e) {
                var el = $(this);
                $.each(self._v_getSelectorKey(el), function (i, _key) {
                    var key = _key + "_" + e.type;
                    if (self[key]) {
                        self.p_defaultEvent(e);
                        self[key].call(self, e, el);
                    }
                });
            });
        },
        v_selector: function () {
            return "[id],[name],[data-name]";
        },
        _v_selectot: function () {
            return $.map(this.v_selector().split(","),function (s) {
                return s.split("|")[0];
            }).join(",");
        },
        v_getRootNode: function () {
            return null;
        },
        v_setRootNode: function (doc) {
            var self = this;
            this.$root = $(doc || self.v_getRootNode() || document);
        },
        _v_getSelectorKey: function (el, selectors) {
            selectors = selectors || this.v_selector().split(",");
            var _match, key = [], _kv, _alias, _selector;
            for (var i = 0, len = selectors.length; i < len; i++) {
                _kv = selectors[i].split("|");
                _selector = _kv[0];
                _alias = _kv[1];
                if (el.is(_selector)) {
                    _match = _selector.match(/\[(\w+)\]/);
                    if (_match && $.inArray(_match[1], ["id", "name", "data-name"]) > -1) {
                        key.push(el.attr(_match[1]));
                    }
                    else if (_alias) {
                        key.push(_alias);
                    }
                    else {
                        key.push(_selector
                            .replace(/\./g, "class_")
                            .replace(/#/g, "id_")
                            .replace(/\[(\w+)\]/g, "attr_$1")
                            .replace(/[\W]+/g, "_"));
                    }
                    //return key;
                }
            }
            return key;
        },
        p_defaultEvent: function (e) {
            e.stopPropagation();
            if ($(e.target).is("a")) e.preventDefault();
        },
        find: function (selector, root) {
            return $(selector, root || this.$root);
        }
    });
})();