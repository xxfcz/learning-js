/**
 * Created by Administrator on 2016/10/27.
 */

(function () {

	const assert = require('assert');

	const List = require('./list');


	/**
	 *
	 * @param Container
	 * @constructor
	 * TODO: 改用 deque 作为默认容器
	 */
	function Stack(Container = List) {
		this.list = new Container();
	}

	Stack.prototype.push = function (x) {
		return this.list.push_back(x);
	};

	Stack.prototype.pop = function () {
		return this.list.pop_back();
	};

	Stack.prototype.top = function () {
		return this.list.back();
	};

	Stack.prototype.empty = function () {
		return this.list.empty();
	};

	Stack.prototype.size = function () {
		return this.list.size();
	};

	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = Stack;
	}
	else if (typeof window != 'undefined') {
		if (!window.std)
			window.std = {};
		window.std.Stack = Stack;
	}

})();