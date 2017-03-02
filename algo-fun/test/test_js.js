/**
 * Created by Administrator on 2016/10/11.
 */

const should = require('should');


describe('JavaScript >', function () {
	describe('数值的极限 >', function () {
		it('可以精确到个位的最大的整数是9007199254740992', function () {
			var n = Math.pow(2, 53);
			var m = n + 1;
			var f = 1e16;
			var g = f + 1e15;
			should(n == m).be.true();
			should(n == 9007199254740992).be.true();
		})
	});

	describe('超越极限的运算 >', function () {
		it('2^53 + ', function () {

		});
	});

	describe('const >', function () {
		it('用表达式赋值', function () {
			const RADIX = Math.pow(2, 32);
			should(RADIX).be.eql(4294967296);
		})
	});

	describe('函数的可变参数', function () {

		it('示例', function () {
			function foo(sign, ...args) {
				console.log('arguments.length=', arguments.length);
				console.log('args.length=', args.length);
			}

			foo('+', 1, 2, 3);
			foo(1, 2, 3);
		});
	});


	describe('迭代器for...in', function () {
		it('for...in 数组', function () {
			for (var x of ['a', 'b', 'c']) {
				console.log(x);
			}
		});
	});

	describe('移位运算', function () {
		it('10化成二进制数得B(1010)', function () {
			var n = 10;
			var s = '';
			while (n > 0) {
				var b = n & 1;
				s = '' + b + s;
				n >>= 1;
			}
			should(s).be.eql('1010');
		});

		it('0.5化成二进制数得B(0.1)', function () {
			var x = 0.5;
			should(x.toString(2)).be.eql('0.1');
		});
	});

	describe('整除', function () {
		it('5 div 2 = 2', function () {
			var x = parseInt(5/2);
			should(x).be.eql(2);
		})
	})
});