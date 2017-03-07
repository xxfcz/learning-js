/**
 * Created by Administrator on 2017/2/28.
 */

describe('杂项', function () {

    it('void 0', function (a, b, c) {
        var isVoid0 = c === void 0;
        expect(isVoid0).toEqual(true);
    });

    it('去掉URL中的协议、主机', function () {
        var  url = 'http://localhost:63342/LearningJS/frx/examples/mod1.js';
        var s = url.replace(/^http.*\//g, '');
        console.log('结果是', s);
    });

});