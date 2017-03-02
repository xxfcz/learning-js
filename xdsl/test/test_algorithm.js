/**
 * Created by Administrator on 2016/10/24.
 */

const should = require('should');
const _ = require('lodash');

const std = require('../lib/std');


describe('算法 >', function () {

	describe('all_of() >', function () {
		it('所有元素都满足条件，返回true', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var r = std.all_of(list.begin(), list.end(), function (val) {
				return val < 10;
			});
			should(r).be.true();
		});

		it('只有一个元素不满足条件，返回false', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var r = std.all_of(list.begin(), list.end(), function (val) {
				return val >= 10;
			});
			should(r).be.false();
		});

		it('范围为空，则总是返回true', function () {
			var list = new std.List();
			should(list.empty()).be.true();
			var r = std.all_of(list.begin(), list.end(), function (itr) {
				return val < 10;
			});
			should(r).be.true();
			r = std.all_of(list.begin(), list.end(), function (itr) {
				return val >= 10;
			});
			should(r).be.true();
		});

	});

	describe('any_of() >', function () {
		it('至少有一个元素满足条件，返回true', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var r = std.any_of(list.begin(), list.end(), function (val) {
				return val < 2;
			});
			should(r).be.true();
			r = std.any_of(list.begin(), list.end(), function (val) {
				return val < 10;
			});
			should(r).be.true();
		});

		it('没有任何一个元素满足条件，返回false', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var r = std.any_of(list.begin(), list.end(), function (val) {
				return val > 3;
			});
			should(r).be.false();
		});

		it('范围为空，则总是返回false', function () {
			var list = new std.List();
			should(list.empty()).be.true();
			var r = std.any_of(list.begin(), list.end(), function (itr) {
				return val < 10;
			});
			should(r).be.false();
			r = std.any_of(list.begin(), list.end(), function (itr) {
				return val >= 10;
			});
			should(r).be.false();
		});

	});

	describe('none_of() >', function () {
		it('所有元素都不满足条件，返回true', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var r = std.none_of(list.begin(), list.end(), function (val) {
				return val > 10;
			});
			should(r).be.true();
		});

		it('只要有一个元素满足条件，返回false', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);
			list.push_back(300);

			var r = std.none_of(list.begin(), list.end(), function (val) {
				return val >= 10;
			});
			should(r).be.false();
		});

		it('范围为空，则总是返回true', function () {
			var list = new std.List();
			should(list.empty()).be.true();
			var r = std.none_of(list.begin(), list.end(), function (x) {
				return x < 10;
			});
			should(r).be.true();
			r = std.none_of(list.begin(), list.end(), function (x) {
				return x >= 10;
			});
			should(r).be.true();
		});

	});

	it('for_each() >', function () {
		var list = new std.List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);

		std.for_each(list.begin(), list.end(), function (val, itr) {
			itr.set(val * 10);
		});

		should(list.toArray()).be.eql([10, 20, 30]);

	});

	describe('find() >', function () {
		it('搜索原始值', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var itr = std.find(list.begin(), list.end(), 2);
			should(itr.ne(list.end())).be.true();
			itr = std.find(list.begin(), list.end(), 999);
			should(itr.eq(list.end())).be.true();
		});

		it('搜索对象', function () {
			var list = new std.List();
			list.push_back({ x: 1, y: 2 });
			list.push_back({ x: 3, y: 4 });
			list.push_back({ x: 5, y: 6 });

			var itr = std.find(list.begin(), list.end(), { x: 1, y: 2 });
			should(itr.ne(list.end())).be.true();
			itr = std.find(list.begin(), list.end(), { x: 999, y: 2 });
			should(itr.eq(list.end())).be.true();
		});

	});


	describe('杂项 >', function () {
		it('toArray()', function () {
			var list = new std.List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);

			var a = std.toArray(list.begin(), list.end());
			should(a).be.eql([1, 2, 3]);

			a = std.toArray(list.rbegin(), list.rend());
			should(a).be.eql([3, 2, 1]);
		})
	})
});