/**
 * Created by Administrator on 2016/10/26.
 */

const should = require('should');

const heapLib = require('../lib/heap');
const MaxHeap = heapLib.MaxHeap;
const MinHeap = heapLib.MinHeap;


describe('堆 >', function () {

	describe('最大堆 >', function () {

		it('toArray()', function () {
			var h = new MaxHeap();
			h.h[0] = 10;
			h.h[1] = 9;
			h.h[2] = 6;
			h.n = 3;
			var a = h.toArray();
			should(a).be.eql([10, 9, 6]);
		});

		it('insert()', function () {
			var h = new MaxHeap();
			h.insert(6);
			should(h.n).be.eql(1);
			should(h.toArray()).be.eql([6]);
			h.insert(7);
			should(h.n).be.eql(2);
			should(h.toArray()).be.eql([7, 6]);
			h.insert(9);
			should(h.n).be.eql(3);
			should(h.toArray()).be.eql([9, 6, 7]);
			h.insert(10);
			should(h.n).be.eql(4);
			should(h.toArray()).be.eql([10, 9, 7, 6]);
		});

		it('insert() 2', function () {
			var h = new MaxHeap();
			h.insert(10);
			h.insert(7);
			h.insert(9);
			should(h.toArray()).be.eql([10, 7, 9]);

			h.insert(8);
			should(h.toArray()).be.eql([10, 8, 9, 7]);
		});

		it('remove()', function () {
			var h = new MaxHeap();
			h.insert(6);
			h.insert(7);
			h.insert(9);
			h.insert(10);
			should(h.toArray()).be.eql([10, 9, 7, 6]);

			should(h.remove()).be.eql(10);
			should(h.size()).be.eql(3);
			should(h.toArray()).be.eql([9, 6, 7]);

			should(h.remove()).be.eql(9);
			should(h.size()).be.eql(2);
			should(h.toArray()).be.eql([7, 6]);

			should(h.remove()).be.eql(7);
			should(h.remove()).be.eql(6);
			should(h.size()).be.eql(0);
		});

		it('remove() 2', function () {
			var h = new MaxHeap();
			h.insert(10);
			h.insert(8);
			h.insert(9);
			h.insert(7);
			should(h.remove()).be.eql(10);
			should(h.remove()).be.eql(9);
			should(h.remove()).be.eql(8);
			should(h.remove()).be.eql(7);
		});

	});

	describe('最小堆 >', function () {
		it('整数', function () {
			var h = new MinHeap();
			h.insert(10);
			h.insert(8);
			h.insert(9);
			h.insert(7);
			should(h.toArray()).be.eql([7, 8, 9, 10]);
		});

		it('对象', function () {
			function min(a, b) {
				return a.x < b.x && a.y < b.y;
			}

			var h = new MinHeap(min);
			h.insert({ x: 1, y: 2 });
			h.insert({ x: 10, y: 6 });
			h.insert({ x: 9, y: 7 });
			h.insert({ x: 8, y: 5 });
			should(h.toArray()).be.eql([
				{ x: 1, y: 2 },
				{ x: 8, y: 5 },
				{ x: 9, y: 7 },
				{ x: 10, y: 6 }]);
		});

		it('对象 2', function () {
			function min(a, b) {
				return a.x < b.x && a.y < b.y;
			}

			var h = new MinHeap(min);
			h.insert({ x: 1, y: 2 });
			h.insert({ x: 9, y: 7 });
			h.insert({ x: 8, y: 5 });
			h.insert({ x: 10, y: 6 });
			should(h.toArray()).be.eql([
				{ x: 1, y: 2 },
				{ x: 9, y: 7 },
				{ x: 8, y: 5 },
				{ x: 10, y: 6 }]);

			should(h.remove()).be.eql({ x: 1, y: 2 });
			should(h.remove()).be.eql({ x: 8, y: 5 });
			should(h.remove()).be.eql({ x: 10, y: 6 });
			should(h.remove()).be.eql({ x: 9, y: 7 });
		});

	});

});