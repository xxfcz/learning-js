/**
 * Created by Administrator on 2016/10/24.
 */

(function () {
	/*****************************************************************************/
// 迭代器

	/**
	 * C++风格的迭代器
	 * @interface
	 */
	function CxxIterator() {}

	/**
	 * @param other {CxxIterator|*}
	 * @returns {bool}
	 */
	CxxIterator.prototype.eq = function (other) {};

	/**
	 * @param other {CxxIterator}
	 * @returns {boolean}
	 */
	CxxIterator.prototype.ne = function (other) {
		return !this.eq(other);
	};

	/**
	 * 迭代器自增1
	 * @returns {CxxIterator}
	 */
	CxxIterator.prototype.inc = function () {};

///////////////////////////////////////////////////////////////////////////////

	/**
	 * 输入迭代器
	 * @interface
	 * @implements {CxxIterator}
	 */
	function InputIterator() {}

	oo.extend(InputIterator, CxxIterator);

	/**
	 * 从迭代器取数据
	 * @returns {*}
	 */
	InputIterator.prototype.get = function () {};

///////////////////////////////////////////////////////////////////////////////

	/**
	 * 输出迭代器
	 * @interface
	 * @implements {CxxIterator}
	 */
	function OutputIterator() {}

	oo.extend(OutputIterator, CxxIterator);

	/**
	 * 通过迭代器赋值
	 * @param data
	 * @returns {OutputIterator}
	 */
	OutputIterator.prototype.set = function (data) {};

///////////////////////////////////////////////////////////////////////////////

	/**
	 * 前向迭代器
	 * @interface
	 * @implements {CxxIterator}
	 * @implements {InputIterator}
	 * @implements {OutputIterator}
	 */
	function ForwardIterator() {}

	// TODO: 多重继承
	//oo.extend(ForwardIterator, InputIterator, OutputIterator);
	oo.extend(ForwardIterator, InputIterator);
	ForwardIterator.prototype.set = function (data) {};


///////////////////////////////////////////////////////////////////////////////

	/**
	 * 双向迭代器
	 * @interface
	 * @implements {CxxIterator}
	 * @implements {InputIterator}
	 * @implements {OutputIterator}
	 */
	function BidirectionalIterator() {}

	oo.extend(BidirectionalIterator, ForwardIterator);

	/**
	 * 迭代器自减1
	 * @returns {OutputIterator}
	 */
	OutputIterator.prototype.dec = function () {};


	/**
	 * 随机访问迭代器
	 * @interface
	 */
	function RandomAccessIterator() {}


	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		exports.CxxIterator = CxxIterator;
		exports.InputIterator = InputIterator;
		exports.OutputIterator = OutputIterator;
		exports.ForwardIterator = ForwardIterator;
		exports.BidirectionalIterator = BidirectionalIterator;
	}

})();