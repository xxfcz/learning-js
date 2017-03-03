/**
 * Created by Administrator on 2017/3/2.
 */

(function () {
    var $ = window.$;
    if (typeof $ === 'undefined')
        $ = window.$ = {};

    $.extend = (function () {  // Assign the return value of this function
                                 // This is the list of special-case properties we check for
        var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty",
            "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];

        // First check for the presence of the bug before patching it.
        for (var p in { toString: null }) {
            // If we get here, then the for/in loop works correctly and we return
            // a simple version of the extend() function
            return function extend(o) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var prop in source) o[prop] = source[prop];
                }
                return o;
            };
        }
        // If we get here, it means that the for/in loop did not enumerate
        // the toString property of the test object. So return a version
        // of the extend() function that explicitly tests for the nonenumerable
        // properties of Object.prototype.
        return function patched_extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                // Copy all the enumerable properties
                for (var prop in source) o[prop] = source[prop];

                // And now check the special-case properties
                for (var j = 0; j < protoprops.length; j++) {
                    prop = protoprops[j];
                    if (source.hasOwnProperty(prop)) o[prop] = source[prop];
                }
            }
            return o;
        };
    }());

    // types ------------------------------------------------------------------------------------------

    $.isNull = function (o) {
        return o === null;
    };

    $.isUndefined = function (o) {
        return o === void 0;
    };

    $.isNaN = function (o) {
        return o !== o;
    };

    $.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    $.isNumber = function (o) {
        return Object.prototype.toString.call(o) === '[object Number]'
            && !$.isNaN(o) && isFinite(o);
    };

    $.isBoolean = function (o) {
        return (typeof o === 'boolean') || Object.prototype.toString.call(o) === '[object Boolean]';
    };

    $.isString = function (o) {
        return (typeof o === 'string') || Object.prototype.toString.call(o) === '[object String]';
    };

    $.isFunction = function (o) {
        return Object.prototype.toString.call(o) === '[object Function]';
    };

    $.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    $.isRegExp = function (o) {
        return Object.prototype.toString.call(o) === '[object RegExp]';
    };

    $.isWindow = function (o) {
        return Object.prototype.toString.call(o) === '[object Window]';
    };

    $.isDate = function (o) {
        return Object.prototype.toString.call(o) === '[object Date]' && o.toString() !== 'Invalid Date';
    };

// 用 Document 指示 HTMLDocument
    $.isDocument = function (o) {
        // document.nodeType === 9
        return Object.prototype.toString.call(o) === '[object HTMLDocument]' || o.nodeType === 9;
    };

    $.isArguments = function (o) {
        // arguments.callee !== 'undefined'
        return Object.prototype.toString.call(o) === '[object Arguments]' || o.callee;
    };

// HTMLCollection 并入 NodeList
    $.isNodeList = function (o) {
        var s = Object.prototype.toString.call(o);
        return (s === '[object NodeList]') || (s === '[object HTMLCollection]') ||
            (isFinite(o.length) && $.isFunction(o.item)); // 有length属性且为有限值，还有函数item()
    };

    $.isArrayLike = function (o) {

    };

    var class2types = {
        '[object Object]': 'Object',
        '[object Boolean]': 'Boolean',
        '[object Number]': 'Number',
        '[object String]': 'String',
        '[object Date]': 'Date',
        '[object RegExp]': 'RegExp',
        '[object Array]': 'Array',
        '[object Function]': 'Function',
        '[object Null]': 'Null',
        '[object Undefined]': 'Undefined',
        '[object HTMLDocument]': 'Document',
        '[object Window]': 'Window',
        '[object Arguments]': 'Arguments',
        '[object NodeList]': 'NodeList',
        '[object HTMLCollection]': 'NodeList',
        '[object StaticNodeList]': 'NodeList'
    };

    $.type = function (obj, str) {
        var result;
        if (obj === null) {
            result = 'Null';
        }
        else if (obj !== obj) {
            result = 'NaN';
        }
        else if (obj === void 0) {
            result = 'Undefined'
        }
        else {
            result = class2types[Object.prototype.toString.call(obj)] || '#';
            if (result === '#') {

            }
        }

        if (str) {
            return result == str;
        }
        return result;
    };

    // events -------------------------------------------------------------------

    $.on = function (event, handler) {
        if (window.addEventListener) {
            return function (event, handler) {
                window.addEventListener(event, handler);
            }
        }
        else if (window.attachEvent) {
            return function (event, handler) {
                window.attachEvent(event, handler);
            }
        }
    };


    // CSS classes --------------------------------------------------------------

    $.addClass = function (node, className) {
        if (typeof node.classList !== 'undefined') {
            if (!node.classList.contains(className))
                node.classList.add(className);
        }
        else {
            var rgx = new RegExp('\b' + className + '\b', 'g');
            if (!rgx.test(node))
                node.className += ' ' + className;
        }
        return this;
    };
})();
