/**
 * Created by Administrator on 2016/10/24.
 */

/**
 The <algorithm> defines a collection of functions especially designed to be
 used on ranges of elements.

 A range is any sequence of objects that can be accessed through iterators (C++:
 or pointers), such as an array or an instance of some of the (C++: STL)
 containers. Notice though, that algorithms operate through iterators directly
 on the values, not affecting in any way the structure of any possible container
 (it never affects the size or storage allocation of the container).
 */


(function () {

	const _ = require('lodash');

	const xu = require('./xutil');

	/**
	 * @summary Test condition on all elements in range
	 * Returns true if pred returns true for all the elements in the range
	 * [first,last) or if the range is empty, and false otherwise.
	 *
	 * 要求迭代器只读即可。
	 * 注意：此实现版本修改了 first 。
	 *
	 * @param first {ForwardIterator|*}
	 * @param last {ForwardIterator|*}
	 * @param pred {Predicate}
	 * @returns {boolean}
	 */
	function all_of(first, last, pred) {
		while (first.ne(last)) {
			if (!pred(first.get()))
				return false;
			first.inc();
		}
		return true;
	}


	/**
	 * @summary Test if any element in range fulfills condition
	 * Returns true if pred returns true for any of the elements in the range
	 * [first,last), and false otherwise.
	 *
	 * If [first,last) is an empty range, the function returns false.
	 */
	function any_of(first, last, pred) {
		while (first.ne(last)) {
			if (pred(first.get()))
				return true;
			first.inc();
		}
		return false;
	}

	/**
	 * @summary Test if no elements fulfill condition
	 * Returns true if pred returns false for all the elements in the range
	 * [first,last) or if the range is empty, and false otherwise.
	 */
	function none_of(first, last, pred) {
		while (first.ne(last)) {
			if (pred(first.get()))
				return false;
			first.inc();
		}
		return true;
	}


	/**
	 *
	 * @param first {InputIterator|*}
	 * @param last {InputIterator|*}
	 * @param p {Predicate}
	 */
	function for_each(first, last, p) {
		while (first.ne(last)) {
			p(first.get(), first);
			first.inc();
		}
	}

	/**
	 * Find value in range
	 * Returns an iterator to the first element in the range [first,last) that
	 * compares equal to val. If no such element is found, the function returns
	 * last.
	 *
	 * The function uses lodash.eq() (C++: operator==) to compare the individual
	 * elements to val.
	 *
	 * @param first {InputIterator}
	 * @param last {InputIterator}
	 * @param val {*}
	 */
	function find(first, last, val) {
		while (first.ne(last)) {
			if (_.isEqual(first.get(), val))
				return first;
			first.inc();
		}
		return first;
	}


	/**
	 * @summary Find element in range
	 * Returns an iterator to the first element in the range [first,last) for
	 * which pred returns true. If no such element is found, the function returns
	 * last.
	 * @param first {InputIterator}
	 * @param last {InputIterator}
	 * @param pred {Predicate}
	 */
	function find_if(first, last, pred) {
		while (first.ne(last)) {
			if (pred(first.get()))
				return first;
			first.inc();
		}
		return first;
	}


	/**
	 *
	 *
	 */

	const exported = {
		all_of: all_of,
		any_of: any_of,
		none_of: none_of,
		for_each: for_each,
		find: find,
		find_if: find_if
	};


	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = exported;
	}
	else if (typeof window != 'undefined') {
		// TODO: 导出到 window 对象
	}

})();