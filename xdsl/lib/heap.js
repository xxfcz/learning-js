/**
 * Created by Administrator on 2016/10/26.
 */

(function () {

	const assert = require('assert');

	const oo = require('./oo');


	function max(a, b) {
		return a > b;
	}

	function min(a, b) {
		return a < b;
	}

	/**
	 * 堆
	 * @param pred - function(a,b):boolean
	 * @constructor
	 */
	function Heap(pred) {
		assert(arguments.length == 1, '必须提供pred参数');
		this.h = [];
		this.n = 0; //元素个数
		this.pred = pred;
	}

	Heap.prototype.toArray = function () {
		return this.h.slice(0, this.n);
	};


	Heap.prototype.size = function () {
		return this.n;
	};


	/**
	 * 添加元素
	 * @param x {*}
	 */
	Heap.prototype.insert = function (x) {
		var i = this.n;   // 当前考察的插入位置
		var p = parseInt((i + 1) / 2) - 1;
		// 调整堆：x向上冒泡，直到不大于父元素
		while ((i > 0) && this.pred(x, this.h[p])) { // 比父元素大？
			// p下移
			this.h[i] = this.h[p];
			// 更新插入位置
			i = p;
			// 继续向上考察
			p = parseInt((i + 1) / 2) - 1;
		}
		// 插入位置确定了
		this.h[i] = x;
		++this.n;
	};


	/**
	 * 移除最大的元素
	 */
	Heap.prototype.remove = function () {
		assert(this.n > 0);

		// 堆顶元素即为最大元素
		var result = this.h[0];

		// 把堆尾元素暂时移入堆顶
		this.h[0] = this.h[this.n - 1];
		--this.n;

		// 调整堆，使得h[0]是整个堆的最大者 ----------------

		// 初始化考察位置
		var p = 0;
		var c = 2 * p + 1;
		while (c < this.n) {
			// 先比较左右子节点，取较大者
			if (c + 1 < this.n && this.pred(this.h[c + 1], this.h[c])) {
				c += 1;
			}
			if (this.pred(this.h[c], this.h[p])) {
				// 较大的子节点元素上移：交换父子
				var t = this.h[p];
				this.h[p] = this.h[c];
				this.h[c] = t;
				// 继续向下考察
				p = c;
				c = 2 * p + 1;
			}
			else
				c = this.n; // 结束
		}

		return result;
	};


	/////////////////////////////////////////////////////////////////////////
	// 最大堆

	function MaxHeap(pred) {
		if (pred)
			this.superclass(pred);
		else
			this.superclass(max);
	}

	oo.extend(MaxHeap, Heap);


	/////////////////////////////////////////////////////////////////////////
	// 最小堆

	function MinHeap(pred) {
		if (pred)
			this.superclass(pred);
		else
			this.superclass(min);
	}

	oo.extend(MinHeap, Heap);


	const exported = {
		Heap: Heap,
		MaxHeap: MaxHeap,
		MinHeap: MinHeap
	};


	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = exported;
	}
	else if (typeof window != 'undefined') {
		if (!window.std)
			window.std = {};
		window.std.Heap = Heap;
		window.std.MaxHeap = Heap;
		window.std.MinHeap = MinHeap;
	}

})();