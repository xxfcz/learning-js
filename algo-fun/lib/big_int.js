/**
 * Created by Administrator on 2016/10/11.
 */

const assert = require('assert');
const _ = require('lodash');
const xu = require('../lib/xutil');


/*
 大整数运算
 */

// 基数 2^32
const RADIX = Math.pow(2, 32);

// 符号位
const SIGN_POS = '+';
const SIGN_NEG = '-';

/**
 * 构造一个大数
 * @param {string|BigInt} [sign] - 符号位，或者另一个BigInt
 * @param {number} args - 每一位的数值
 * @constructor
 */
function BigInt(sign, ...args) {
	var firstDigit;
	if (typeof sign === 'string') {
		if (sign === '-')
			this.sign = 1; // 符号位，0=非负数，1=负数
		else if (sign === '+')
			this.sign = 0;
		else
			assert(false, '若提供符号位，则必须是"+"或"-"');
		firstDigit = 1;   // 第1位数在第2个参数
	}
	else if (xu.typeOf(sign) == 'BigInt') {
		// 复制构造函数
		var other = sign;
		this.sign = other.sign;
		this.digits = other.digits.slice(0);
		return;
	}
	else {
		// 没有提供符号位
		this.sign = 0;
		firstDigit = 0;   // 第1位数就在第1个参数
	}

	this.digits = []; // 在RADIX进制下，每一位的数值，从最低位开始存储
	for (var i = 0, j = firstDigit; j < arguments.length; ++i, ++j) {
		assert(typeof arguments[j] == 'number', '每一位数必须是数值');
		assert(arguments[j] < RADIX, '每一位数值必须小于' + RADIX);

		this.digits[i] = arguments[j];
	}
}


BigInt.RADIX = RADIX;


BigInt.prototype.isNegative = function () {
	return this.sign == 1;
};


BigInt.prototype.toString = function () {

};


BigInt.prototype.valueOf = function () {
	return this.toString();
};


/**
 * 无符号数加法
 * @static
 * @param lhs {BigInt}
 * @param rhs {BigInt}
 * @returns {BigInt}
 */
BigInt.addU = function (lhs, rhs) {
	var result = new BigInt();
	var len = Math.max(lhs.digits.length, rhs.digits.length);
	var carry = 0; // 进位
	for (var i = 0; i < len; ++i) {
		var a = i < lhs.digits.length ? lhs.digits[i] : 0;
		var b = i < rhs.digits.length ? rhs.digits[i] : 0;
		result.digits[i] = a + b + carry;
		// 处理进位
		if (result.digits[i] >= RADIX) {
			result.digits[i] -= RADIX;
			carry = 1;
		}
		else
			carry = 0;
	}
	// 处理最高位的进位
	if (carry == 1)
		result.digits[len] = 1;

	return result;
};


/**
 * 无符号数减法
 * @static
 * @param x {BigInt}
 * @param y {BigInt}
 * @returns {BigInt}
 */
BigInt.subU = function (x, y) {
	var r = new BigInt();
	var a = x, b = y;
	if (BigInt.compU(a, b) < 0) { // a<b?
		a = y;            // 交换两数
		b = x;
		r.sign = 1;       // 结果为负
	}

	var len = Math.max(a.digits.length, b.digits.length);
	var i;

	var carry = 0; // 借位
	for (i = 0; i < len; ++i) {
		var da = i < a.digits.length ? a.digits[i] : 0;
		var db = i < b.digits.length ? b.digits[i] : 0;
		// 够减？（包括借位）
		if ((da > db) || (da == db && carry == 0)) {
			r.digits[i] = da - db - carry;
		}
		else { // 不够减：从高位借1再减
			r.digits[i] = RADIX + da - db - carry;
			carry = 1;
		}
	}
	// 由于总是用大数减小数，此时最高位的借位必为0

	// 去掉前导0
	while (r.digits[r.digits.length - 1] === 0) {
		r.digits.splice(r.digits.length - 1, 1);
	}

	return r;
};


/**
 * 无符号数比较
 * @param a {BigInt}
 * @param b {BigInt}
 * @returns {number} -1表示a<b, 0表示a=b, 1表示a>b
 */
BigInt.compU = function (a, b) {
	if (a.digits.length > b.digits.length)
		return 1;
	else if (a.digits.length < b.digits.length)
		return -1;

	// 位数相同
	for (var i = 0; i < a.digits.length; ++i) {
		var r = a.digits[i] - b.digits[i];
		if (r != 0)
			return r;
	}
	return 0;
};


BigInt.prototype.add = function (b) {
	var a = this;
	var r;
	// 比较符号位
	if (a.sign == b.sign) {
		// 符号相同：先把绝对值相加
		r = BigInt.addU(a, b);
		// 再把结果的符号位设置成与加数相同
		r.sign = a.sign;
	}
	else {
		// 符号不同：绝对值大减小，结果与绝对值大的同号
		if (BigInt.compU(a, b) >= 0) {
			r = BigInt.subU(a, b);
			r.sign = a.sign;
		}
		else {
			r = BigInt.subU(b, a);
			r.sign = b.sign;
		}
	}
	return r;
};


/**
 * 有符号减法
 * @param b {BigInt}
 * @returns {BigInt}
 */
BigInt.prototype.sub = function (b) {
	var a = this;
	var r;
	// 比较符号位
	if (a.sign != b.sign) {
		// 符号不同：先把绝对值相加
		r = BigInt.addU(a, b);
		// 再把结果的符号位设置成与被减数相同
		r.sign = a.sign;
		// 例如， 3-(-2)=5, -3-2=-5
	}
	else {
		// 符号相同：
		// 比较绝对值，若 |a|>=|b|，则做无符号数减法|a|-|b|，结果取a的符号位；
		// 否则用做无符号数减法|b|-|a|，结果取b的符号位
		if (BigInt.compU(a, b) >= 0) {
			r = BigInt.subU(a, b);
			r.sign = a.sign;
		}
		else {
			r = BigInt.subU(b, a);
			r.sign = b.sign;
		}
	}
	return r;
};


module.exports = BigInt;