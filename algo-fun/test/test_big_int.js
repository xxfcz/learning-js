/**
 * Created by Administrator on 2016/10/11.
 */


const should = require('should');

const BigInt = require('../lib/big_int');

describe('BigInt >', function () {

	describe('构造函数 >', function () {
		it('1', function () {
			var x = new BigInt(1);
			should(x.digits.length).be.eql(1);
			should(x.digits[0]).be.eql(1);
		});

		it('基数-1', function () {
			var x = new BigInt(BigInt.RADIX - 1);
			should(x.digits.length).be.eql(1);
			should(x.digits[0]).be.eql(BigInt.RADIX - 1);
		});

		it('2位数', function () {
			var x = new BigInt(2, 1);
			should(x.digits.length).be.eql(2);
			should(x.digits[0]).be.eql(2);
			should(x.digits[1]).be.eql(1);
		});


		it('每位数值必须小于基数', function () {
			(function () {
				var x = new BigInt(1, BigInt.RADIX);
			}).should.throw();
		});

		it('提供了符号位', function () {
			var x = new BigInt('+', 2);
			should(x.sign).be.eql(0);
			should(x.digits[0]).be.eql(2);

			x = new BigInt('-', 2, 1);
			should(x.sign).be.eql(1);
			should(x.digits[0]).be.eql(2);
			should(x.digits[1]).be.eql(1);
		});

		it('复制构造函数', function () {
			var x = new BigInt(2, 1);
			var y = new BigInt(x);
			should(x.sign).be.eql(y.sign);
			should(x.digits.length).be.eql(y.digits.length);
			should(x.digits[0]).be.eql(y.digits[0]);
			should(x.digits[1]).be.eql(y.digits[1]);

		})
	});

	describe('无符号数加法 .addU() >', function () {
		it('1+2=3', function () {
			var a = new BigInt(1);
			var b = new BigInt(2);

			var c = BigInt.addU(a, b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(3);
		});

		it('一位数加法，有进位，类似于：9+1=10', function () {
			var a = new BigInt(BigInt.RADIX - 1);
			var b = new BigInt(1);

			var c = BigInt.addU(a, b);
			should(c.digits.length).be.eql(2);
			should(c.digits[0]).be.eql(0);
			should(c.digits[1]).be.eql(1);
		});
		it('两位数加法，每位都有进位，类似于：99+1=100', function () {
			var a = new BigInt(BigInt.RADIX - 1, BigInt.RADIX - 1);
			var b = new BigInt(1);

			var c = BigInt.addU(a, b);
			should(c.digits.length).be.eql(3);
			should(c.digits[0]).be.eql(0);
			should(c.digits[1]).be.eql(0);
			should(c.digits[2]).be.eql(1);
		});
		it('三位数加法，每位都有进位，类似于：999+1=1000', function () {
			var a = new BigInt(BigInt.RADIX - 1, BigInt.RADIX - 1, BigInt.RADIX - 1);
			var b = new BigInt(1);

			var c = BigInt.addU(a, b);
			should(c.digits.length).be.eql(4);
			should(c.digits[0]).be.eql(0);
			should(c.digits[1]).be.eql(0);
			should(c.digits[2]).be.eql(0);
			should(c.digits[3]).be.eql(1);
		});
	});

	describe('无符号数比较', function () {
		it('2>1', function () {
			var a = new BigInt(2);
			var b = new BigInt(1);
			should(BigInt.compU(a, b) > 0).be.true();
		});
		it('1=1', function () {
			var a = new BigInt(1);
			var b = new BigInt(1);
			should(BigInt.compU(a, b) == 0).be.true();
		});
		it('12>3', function () {
			var a = new BigInt(2, 1);
			var b = new BigInt(3);
			should(BigInt.compU(a, b) > 0).be.true();
		});
		it('3<12', function () {
			var a = new BigInt(3);
			var b = new BigInt(2, 1);
			should(BigInt.compU(a, b) < 0).be.true();
		});
		it('12=12', function () {
			var a = new BigInt(2, 1);
			var b = new BigInt(2, 1);
			should(BigInt.compU(a, b) == 0).be.true();
		});
		it('12<13', function () {
			var a = new BigInt(2, 1);
			var b = new BigInt(3, 1);
			should(BigInt.compU(a, b) < 0).be.true();
		});
	});

	describe('无符号数减法', function () {
		it('43-2=41', function () {
			var a = new BigInt(3, 4);
			var b = new BigInt(2);

			var c = BigInt.subU(a, b);
			should(c.digits.length).be.eql(2);
			should(c.digits[1]).be.eql(4);
			should(c.digits[0]).be.eql(1);
		});

		it('1-2=-1', function () {
			var a = new BigInt(1);
			var b = new BigInt(2);

			var c = BigInt.subU(a, b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(1);
		});

		// []中的数字表示RADIX意义上的值，如 [9]表示 RADIX-1
		it('10-1=-[9]', function () {
			var a = new BigInt(0, 1);
			var b = new BigInt(1);

			var c = BigInt.subU(a, b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(BigInt.RADIX - 1);
			should(c.sign).be.eql(0);
		});
		it('100-12=-[88]', function () {
			var a = new BigInt(0, 0, 1);
			var b = new BigInt(2, 1);

			var c = BigInt.subU(a, b);
			should(c.digits.length).be.eql(2);  // 结果只有两位
			should(c.digits[0]).be.eql(BigInt.RADIX - 2);   // [8]
			should(c.digits[1]).be.eql(BigInt.RADIX - 2);   // [8]
			should(c.sign).be.eql(0);
		});

	});

	describe('有符号数加法', function () {
		it('1+2=3', function () {
			var a = new BigInt(1);
			var b = new BigInt(2);

			var c = a.add(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(3);
			should(c.sign).be.eql(0);
		});
		it('(-1)+(-2)=(-3)', function () {
			var a = new BigInt('-', 1);
			var b = new BigInt('-', 2);

			var c = a.add(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(3);
			should(c.sign).be.eql(a.sign);
		});
		it('-1+2=1', function () {
			var a = new BigInt('-', 1);
			var b = new BigInt(2);

			var c = a.add(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(0);
		});
		it('1+(-2)=(-1)', function () {
			var a = new BigInt(1);
			var b = new BigInt('-', 2);

			var c = a.add(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(b.sign);
		});
	});

	describe('有符号数减法', function () {
		it('3-2=1', function () {
			var a = new BigInt(3);
			var b = new BigInt(2);

			var c = a.sub(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(0);
		});
		it('-3-(-2)=-1', function () {
			var a = new BigInt('-', 3);
			var b = new BigInt('-', 2);

			var c = a.sub(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(a.sign);
		});
		it('2-3=-1', function () {
			var a = new BigInt(2);
			var b = new BigInt(3);

			var c = a.sub(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(b.sign);
		});
		it('-2-(-3)=1', function () {
			var a = new BigInt('-', 2);
			var b = new BigInt('-', 3);

			var c = a.sub(b);
			should(c.digits.length).be.eql(1);
			should(c.digits[0]).be.eql(1);
			should(c.sign).be.eql(a.sign);
		});
	});

});
