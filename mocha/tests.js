var should = chai.should();
var expect = chai.expect;

describe('试一下在前端用mocha', function () {

    it('1+1=2', function () {
        expect(1 + 1).to.equal(2);
        (1 + 1).should.eql(2);
    });

    var breakUrl = function (url) {
        var i = url.indexOf('//');
        i = url.indexOf('/', i + 2);
        var root = url.substring(0, i + 1);
        url = url.replace(root, '');
        var dirs = url.split('/');
        return {
            root: root,        // http://www.1m1m.com/
            dirs: dirs
        }
    };

    var normalizeUrl = function (url) {
        url = url.replace(/\/\.\//g, '/'); //  把 /./ 替换成 /
        var i = url.indexOf('//');
        i = url.indexOf('/', i + 2);
        var root = url.substring(0, i + 1); // http://www.1m1m.com/
        url = url.substring(i + 1);
        console.log(url);
        var dirs = url.split('/');
        var stack = [];
        for (i = 0; i < dirs.length; ++i) {
            if (dirs[i] == '..' && stack.length > 0) {
                stack.pop();
            }
            else {
                stack.push(dirs[i]);
            }
        }
        return root + stack.join('/');
    };

    xit('分解URL', function () {
        var url = 'http://www.1m1m.com/this/is/a/test/../path/../../../js/somejs.js';
        var ret = breakUrl(url);
        expect(ret.root).to.equal('http://www.1m1m.com/');
    });

    it('取URL中的根部分：http://www.1m1m.com', function () {
        var url = 'http://www.1m1m.com/test/path/to/somefile.html?q=李志明';
        var rgx = /^\w+:\/\/.*?(?=\/)/;
        var matches = rgx.exec(url);
        (matches.length).should.eql(1);
        matches[0].should.eql('http://www.1m1m.com');
    });

    describe('消解URL中的 . 和 ..', function () {
        it('一个 . 和 一个 .. ', function () {
            var url = 'http://www.1m1m.com/this/is/a/test/./../js/somejs.js';
            var ret = normalizeUrl(url);
            expect(ret).to.equal('http://www.1m1m.com/this/is/a/js/somejs.js')
        });
        it('三个 .. ', function () {
            var url = 'https://www.1m1m.com/this/is/a/../test/../../js/somejs.js';
            var ret = normalizeUrl(url);
            expect(ret).to.equal('https://www.1m1m.com/this/js/somejs.js')
        })

    });

});