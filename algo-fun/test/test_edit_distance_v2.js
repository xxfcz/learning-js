/**
 * Created by Administrator on 2016/9/13.
 */

var should = require('should');

var EditDistance = require('../lib/edit_distance_v2');

describe("字符串编辑距离，v2, DP >", function () {
	"use strict";
	var ed;

	beforeEach(function () {
		ed = new EditDistance();
	});

	it('两个空串，编辑距离为0', function () {
		var a = '', b = '';
		var d = ed.solve(a, b);
		should(d).be.eql(0);
	});
	it('其中一个空串，编辑距离为另一串长', function () {
		var a = null, b = 'abc';
		var d = ed.solve(a, b);
		should(d).be.eql(b.length);
	});
	it('a <--> ab，编辑距离为1', function () {
		var a = 'a', b = 'ab';
		var d = ed.solve(a, b);
		should(d).be.eql(1);
		d = ed.solve(b, a);
		should(d).be.eql(1);
	});
	it('源删除一字(a)：ab --> b，编辑距离为1', function () {
		"use strict";
		var a = 'ab', b = 'b';
		var d = ed.solve(a, b);
		should(d).be.eql(1);
	});

	it('源插入一字(a)：b --> ab，编辑距离为1', function () {
		"use strict";
		var src = 'b', dst = 'ab';
		var d = ed.solve(src, dst);
		should(d).be.eql(1);
	});

	it('替换一字：a <--> b，编辑距离为1', function () {
		"use strict";
		var src = 'a', dst = 'b';
		var d = ed.solve(src, dst);
		should(d).be.eql(1);
		d = ed.solve(dst, src);
		should(d).be.eql(1);
	});

	it('b <--> abc，编辑距离为2', function () {
		"use strict";
		var src = 'b', dst = 'abc';
		var d = ed.solve(src, dst);
		should(d).be.eql(2);
		d = ed.solve(dst, src);
		should(d).be.eql(2);
	});

	it('abc <--> cba，编辑距离为2', function () {
		"use strict";
		var src = 'abc', dst = 'cba';
		var d = ed.solve(src, dst);
		should(d).be.eql(2);
		ed.solve(dst, src);
		should(d).be.eql(2);
	});

	it('abc <--> bca，编辑距离为2', function () {
		"use strict";
		var src = 'abc', dst = 'bca';
		var d = ed.solve(src, dst);
		should(d).be.eql(2);
		ed.solve(dst, src);
		should(d).be.eql(2);
	});

	it('SNOWY <--> SUNNY，编辑距离为3', function () {
		"use strict";
		var src = 'SNOWY', dst = 'SUNNY';
		var d = ed.solve(src, dst);
		should(d).be.eql(3);
		console.log(ed.ops);
		ed.solve(dst, src);
		should(d).be.eql(3);
	});

	it('This is a string --> That is not a string，5', function () {
		var src = 'This is a string', dst = 'That is not a string';
		var d = ed.solve(src, dst);
		should(d).be.eql(6);
	});

	it('Instagram: Kevin Systrom & Mike Krieger --> INSTAGRAM: KEVIN SYSTROM & MIKE KRIEGER', function () {
		var src = 'Instagram: Kevin Systrom & Mike Krieger',
			dst = 'INSTAGRAM: KEVIN SYSTROM & MIKE KRIEGER';
		var d = ed.solve(src, dst);
		should(d).be.eql(27);
		console.log('[Instagram: Kevin Systrom & Mike Krieger --> INSTAGRAM: KEVIN SYSTROM & MIKE KRIEGER]:', ed.ops);
	});

});
