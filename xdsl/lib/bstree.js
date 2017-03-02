/**
 * Created by Administrator on 2016/10/25.
 */

(function () {

	const assert = require('assert');

	const Stack = require('./stack');

	const ROOT = 'root';
	const LEFT = 'left';
	const RIGHT = 'right';


	function Node(data = null) {
		this.data = (typeof data == 'undefined' ? null : data);
		this.left = null;
		this.right = null;
	}


	/**
	 * 节点的引用
	 * @param p {Node}
	 * @param b {ROOT, LEFT, RIGHT}
	 * @constructor
	 */
	function NodeRef(p, b = ROOT) {
		this.p = p;
		this.b = b;
	}

	NodeRef.prototype.get = function () {
		return this.p[this.b];
	};

	NodeRef.prototype.set = function (v) {
		this.p[this.b] = v;
	};


	// 普通比较器(原始值)
	function compare(a, b) {
		if (a < b)
			return -1;
		else if (a > b)
			return 1;
		else
			return 0;
	}

	function BinarySearchTree(comp = compare) {
		this.head = { root: null };
		this.comp = comp;
	}


	BinarySearchTree.prototype.root = function () {
		return this.head.root;
	};

	/**
	 * 在子树中搜索关键值
	 * @param x {*}
	 * @param nr {NodeRef}
	 * @returns {NodeRef}
	 * @internal
	 */
	BinarySearchTree.prototype.search = function (x, nr) {
		// 若不提供子树起点，则从树根开始搜索
		if (!nr)
			nr = new NodeRef(this.head, ROOT);

		while (nr.p[nr.b]) {
			var ret = this.comp(nr.p[nr.b].data, x);
			if (ret > 0) {       // x 较小，进入左子树
				nr.p = nr.p[nr.b];
				nr.b = LEFT;
			}
			else if (ret < 0) {  // x 较大，进入右子树
				nr.p = nr.p[nr.b];
				nr.b = RIGHT;
			}
			else {               // 找到已有的等值元素
				return nr;
			}
		}
		// 找到插入位置
		return nr;
	};


	BinarySearchTree.prototype.insert = function (x) {
		var pos = this.search(x);
		if (!pos.get()) {
			pos.set(new Node(x));
			return true;   // 插入成功
		}
		return false;  // 已经有了相同的元素
	};


	/**
	 * @callback TraverseCallback
	 * @param {*} value
	 */

	/**
	 * 前序遍历
	 * @param f {TraverseCallback}
	 * @param node {Node}
	 */
	BinarySearchTree.prototype.preorder = function (f, node = this.root()) {
		if (!node)
			return;
		this.preorder(f, node.left);
		f(node.data);
		this.preorder(f, node.right);
	};


	/**
	 * 按中序遍历把全部元素串成数组
	 */
	BinarySearchTree.prototype.toArray = function () {
		"use strict";
		var result = [];
		this.preorder(function (x) {
			result.push(x);
		});
		return result;
	};


	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = {
			BinarySearchTree: BinarySearchTree,
			Node: Node,
			NodeRef: NodeRef,
			LEFT: LEFT,
			RIGHT: RIGHT,
			ROOT: ROOT
		};
	}
	else if (typeof window != 'undefined') {
		// TODO: 导出到 window 对象
	}
})();