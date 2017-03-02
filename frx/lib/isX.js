/**
 * Created by Administrator on 2017/3/1.
 */

if (typeof $ === 'undefined')
    $ = {};

$.isNull = function (o) {
    return o === null;
};

$.isUndefined = function (o) {
    return o === void 0;
};

$.isNaN = function (o) {
    return o !== o;
};

function type(obj, str) {

}