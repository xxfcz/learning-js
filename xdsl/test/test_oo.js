/**
 * Created by Administrator on 2016/10/20.
 */

const should = require('should');

const oo = require('../lib/oo');

describe('在闭包中导出符号 >', function () {
	it('extend()', function () {
		var f = oo.extend;
		should(f).not.be.null();
	});
});

describe('类式继承 >', function () {
	it('extend()', function () {

		function Shape(x, y) {
			this.x = x;
			this.y = y;
		}

		Shape.prototype.draw = function () {
			console.log('A shape is drawing ... done!\n');
			return 1;
		};


		/**
		 * @extends Shape
		 * @param x
		 * @param y
		 * @param w
		 * @param h
		 * @constructor
		 */
		function Rectangle(x, y, w, h) {
			this.uber(x, y);
			this.w = w;
			this.h = h;
		}

		oo.extend(Rectangle, Shape);

		var r = new Rectangle(0, 1, 30, 20);
		should(r).have.property('x');
		should(r).have.property('y');
		should(r).have.property('w');
		should(r).have.property('h');

		should(r.x).be.eql(0);
		should(r.y).be.eql(1);
		should(r.w).be.eql(30);
		should(r.h).be.eql(20);

		should(r.draw()).be.eql(1);

	});

	it('merge', function () {

		function Comparable() {

		}

		Comparable.prototype.eq = function (other) {
			throw new Error('Not implemented!');
		};

		Comparable.prototype.ne = function (other) {
			return !this.eq(other);
		};


		function Complex() {
		}



		oo.merge(Complex.prototype, Comparable.prototype);

		let c1 = new Complex();
		let c2 = new Complex();
		should(function 应该抛出异常() {
			c1.ne(c2);
		}).throw();

		Complex.prototype.eq = function (other) {
			return true;
		};
		should(function 不应抛出异常() {
			c1.ne(c2);
		}).not.throw();


	})
});