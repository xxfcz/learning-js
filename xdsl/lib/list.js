/**
 * Created by Administrator on 2016/10/12.
 */


(function () {

	const oo = require('./oo');

//-----------------------------------------------------------------------------

	/**
	 * 基于数组的列表
	 * @constructor
	 */
	function ArrayList() {

	}


//-----------------------------------------------------------------------------


// 双向节点
	function DNode(data, prev, next) {
		this.data = data;
		this.prev = prev || null;
		this.next = next || null;
	}

// 双向链表
	function List() {
		// 头节点，不存储实际数据
		this.m_head = new DNode(null, this.m_head, this.m_head);
		this.m_head.next = this.m_head;
		this.m_head.prev = this.m_head;
	}

//-----------------------------------------------------------------------------
// Element access

	/**
	 * @summary Access last element
	 * Returns [c++: a reference to] the last element in the list container.
	 *
	 * Unlike member list::end, which returns an iterator just past this element, this function returns a direct reference.
	 *
	 * Calling this function on an empty container causes undefined behavior.
	 *
	 * @returns {*}
	 */
	List.prototype.back = function () {
		return this.m_head.prev.data;
	};

	/**
	 * @summary Access first element
	 * Returns a reference to the first element in the list container.
	 *
	 * Unlike member list::begin, which returns an iterator to this same element, this function returns a direct reference.
	 *
	 * Calling this function on an empty container causes undefined behavior.
	 *
	 * @returns {*}
	 */
	List.prototype.front = function () {
		return this.m_head.next.data;
	};


//-----------------------------------------------------------------------------
// Iterators


	/**
	 * @summary Return iterator to beginning
	 * Returns an iterator pointing to the first element in the list container.
	 *
	 * Notice that, unlike member list::front, which returns a reference to the
	 * first element, this function returns a bidirectional iterator pointing to it.
	 *
	 * If the container is empty, the returned iterator value shall not be dereferenced.
	 *
	 * @returns {List.Iterator} - An iterator to the beginning of the sequence container.
	 *
	 * (C++: If the list object is const-qualified, the function returns a
	 * const_iterator. Otherwise, it returns an iterator.)
	 *
	 * Member types iterator and const_iterator are bidirectional iterator types
	 * (pointing to an element and to a const element, respectively).
	 *
	 */
	List.prototype.begin = function () {
		var result = new List.Iterator(this);
		result.m_pos = this.m_head.next; // 一开始要指向第一个有效节点
		return result;
	};

	/**
	 * @summary Return iterator to end
	 *
	 * Returns an iterator referring to the past-the-end element in the list container.
	 *
	 * The past-the-end element is the theoretical element that would follow the last element in the list container. It does not point to any element, and thus shall not be dereferenced.
	 *
	 * Because the ranges used by functions of the standard library do not include the element pointed by their closing iterator, this function is often used in combination with list::begin to specify a range including all the elements in the container.
	 *
	 * If the container is empty, this function returns the same as list::begin.
	 * @returns {ListIterator}
	 */
	List.prototype.end = function () {
		var result = new List.Iterator(this);
		result.m_pos = this.m_head;     // 一开始要指向 past-the-end
		return result;
	};


	/**
	 * @summary Return const_iterator to beginning
	 * Returns a const_iterator pointing to the first element in the container.
	 *
	 * A const_iterator is an iterator that points to const content. This
	 * iterator can be increased and decreased (unless it is itself also const),
	 * just like the iterator returned by list::begin, but it cannot be used to
	 * modify the contents it points to, even if the list object is not itself
	 * const.
	 *
	 * If the container is empty, the returned iterator value shall not be called
	 * with set() (C++: dereferenced).
	 *
	 * @returns {ListIteratorC|*}
	 */
	List.prototype.cbegin = function () {
		var result = new List.IteratorC(this);
		result.m_pos = this.m_head.next;
		return result;
	};


	/**
	 * @summary Return const_iterator to end
	 * Returns a const_iterator pointing to the past-the-end element in the
	 * container.
	 *
	 * A const_iterator is an iterator that points to const content. This
	 * iterator can be increased and decreased (unless it is itself also const),
	 * just like the iterator returned by list::end, but it cannot be used to
	 * modify the contents it points to, even if the list object is not itself
	 * const.
	 *
	 * If the container is empty, this function returns the same as list::cbegin.
	 *
	 * The value returned shall not be called with set(). (C++: dereferenced.)
	 *
	 * @returns {ListIteratorC|*}
	 */
	List.prototype.cend = function () {
		var result = new List.IteratorC(this);
		result.m_pos = this.m_head;     // 一开始要指向 past-the-end
		return result;
	};


	/**
	 * @summary Return reverse iterator to reverse beginning
	 * Returns a reverse iterator pointing to the last element in the container
	 * (i.e., its reverse beginning).
	 *
	 * Reverse iterators iterate backwards: increasing them moves them towards
	 * the beginning of the container.
	 *
	 * rbegin points to the element right before the one that would be pointed to
	 * by member end.
	 *
	 * Notice that unlike member list::back, which returns a reference to this
	 * same element, this function returns a reverse bidirectional iterator.
	 *
	 */
	List.prototype.rbegin = function () {
		var result = new List.IteratorR(this);
		result.m_pos = this.m_head.prev;
		return result;
	};


	/**
	 * @summary Return reverse iterator to reverse end
	 */
	List.prototype.rend = function () {
		var result = new List.IteratorR(this);
		result.m_pos = this.m_head;
		return result;
	};


	List.prototype.crbegin = function () {
		var result = new List.IteratorCR(this);
		result.m_pos = this.m_head.prev;
		return result;
	};

	List.prototype.crend = function () {
		var result = new List.IteratorCR(this);
		result.m_pos = this.m_head;
		return result;
	};

//-----------------------------------------------------------------------------
// Capacity

	/*
	 * @summary Test whether container is empty
	 * Returns whether the list container is empty (i.e. whether its size is 0).
	 *
	 * This function does not modify the container in any way. To clear the content of a list container, see list::clear.
	 */
	List.prototype.empty = function () {
		return this.m_head.next === this.m_head;
	};

	/**
	 * Return size
	 * Returns the number of elements in the list container.
	 * @returns {number}
	 */
	List.prototype.size = function () {
		var result = 0;
		var n = this.m_head.next;
		while (n != this.m_head) {
			n = n.next;
			++result
		}
		return result;
	};


	/**
	 * @summary Return maximum size
	 *
	 * Returns the maximum number of elements that the list container can hold.
	 *
	 *This is the maximum potential size the container can reach due to known
	 * system or library implementation limitations, but the container is by no
	 * means guaranteed to be able to reach that size: it can still fail to
	 * allocate storage at any point before that size is reached.
	 *
	 * @returns {number}
	 */
	List.prototype.max_size = function () {
		return Number.MAX_SAFE_INTEGER;
	};

//-----------------------------------------------------------------------------
// Modifiers

	/**
	 * @summary Add element at the end
	 * Adds a new element at the end of the list container, after its current last element. The content of val is copied (or moved) to the new element.
	 *
	 * This effectively increases the container size by one.
	 *
	 * @param val {*} - Value to be copied (for primitives), or attached (for objects) [c++: or moved] to the new element.
	 */
	List.prototype.push_back = function (val) {
		// 找到尾
		var tail = this.m_head.prev;
		// 创建新节点，插在 tail 和 head 之间
		var node = new DNode(val, tail, tail.next);
		// 修正 tail.next
		tail.next = node;
		// 修正 head.prev
		this.m_head.prev = node;
	};


//-----------------------------------------------------------------------------
// Modifiers

	/**
	 * Clear content
	 * Removes all elements from the list container (which are destroyed), and leaving the container with a size of 0.
	 */
	List.prototype.clear = function () {
		var p = this.m_head.next;
		while (p != this.m_head) {
			var node = p;  // 暂存待删除节点的引用
			p = p.next;    // 指针先指向下一节点

			node.next = null;
			node.prev = null;
			node.data = null;
		}
		// 只剩下head节点
		p.next = p;
		p.prev = p;
	};


	/**
	 * @summary Insert elements
	 * The container is extended by inserting new elements before the element at
	 * the specified position.
	 *
	 * This effectively increases the list size by the amount of elements
	 * inserted.
	 *
	 * Unlike other standard sequence containers, list and forward_list objects
	 * are specifically designed to be efficient inserting and removing elements
	 * in any position, even in the middle of the sequence.
	 *
	 * @param pos {CxxIterator}
	 * @param val {*}
	 * @returns {CxxIterator} An iterator that points to the first of the newly inserted elements.
	 *
	 * Member type iterator is a bidirectional iterator type that points to elements.
	 */
	List.prototype.insert = function (pos, val) {
		var n0 = pos.m_pos;
		var n1 = new DNode(val, n0.prev, n0);
		n1.prev.next = n1;
		n0.prev = n1;
		return new List.Iterator(n1);
	};

	List.prototype._insert = function (pos, val) {
		var n0 = pos.m_pos;
		var n1 = new DNode(val, n0.prev, n0);
		n1.prev.next = n1;
		n0.prev = n1;
		return n1;
	};


	List.prototype.insert_fill = function (pos, n, val) {
		var result;
		while (n-- > 0) {
			result = this._insert(pos, val);
		}
		return new List.Iterator(result);
	};


	/**
	 *
	 * @param pos
	 * @param first
	 * @param last
	 */
	List.prototype.insert_range = function (pos, first, last) {
		var result;
		while (first.ne(last)) {
			result = this._insert(pos, first.get());
			first.inc();
		}
		return new List.Iterator(result);
	};


	List.prototype.insert_array = function (pos, il) {
		var result;
		for (var val of il) {
			result = this._insert(pos, val);
		}
		return new List.Iterator(result);
	};

	/**
	 * Removes the last element in the list container, effectively reducing the container size by one.
	 * This destroys the removed element.
	 * @summary Delete last element
	 */
	List.prototype.pop_back = function () {
		// 找到尾
		var tail = this.m_head.prev;
		// 切断联系
		if (tail != this.m_head) {
			tail.prev.next = tail.next;
			tail.next.prev = tail.prev;

			tail.prev = null;
			tail.next = null;
			tail.data = null;
		}
	};

	List.prototype.toArray = function () {
		/**
		 * @type {DNode}
		 */
		var node = this.m_head.next;
		var result = [];
		while (node != this.m_head) {
			result.push(node.data);
			node = node.next;
		}
		return result;
	};


	/**
	 * @param node {DNode}
	 * @implements {BidirectionalIterator}
	 * @constructor
	 */
	function ListIterator(node) {
		this.m_pos = node;
	}

	/**
	 *
	 * @param other {CxxIterator|*}
	 * @returns {bool}
	 */
	ListIterator.prototype.eq = function (other) {
		return this.m_pos == other.m_pos;
	};

	ListIterator.prototype.ne = function (other) {
		return !this.eq(other);
	};

	ListIterator.prototype.inc = function () {
		this.m_pos = this.m_pos.next;
		return this;
	};

	ListIterator.prototype.dec = function () {
		this.m_pos = this.m_pos.prev;
		return this;
	};

	ListIterator.prototype.get = function () {
		return this.m_pos.data;
	};

	ListIterator.prototype.set = function (val) {
		this.m_pos.data = val;
		return this;
	};

	/**
	 * @param node {Node}
	 * @implements {BidirectionalIterator}
	 * @constructor
	 */
	function ListIteratorR(node) {
		this.m_pos = node;
	}

	/**
	 *
	 * @param other {CxxIterator|*}
	 * @returns {bool}
	 */
	ListIteratorR.prototype.eq = function (other) {
		return this.m_pos == other.m_pos;
	};

	ListIteratorR.prototype.ne = function (other) {
		return !this.eq(other);
	};

	ListIteratorR.prototype.inc = function () {
		this.m_pos = this.m_pos.prev;
		return this;
	};

	ListIteratorR.prototype.dec = function () {
		this.m_pos = this.m_pos.next;
		return this;
	};

	ListIteratorR.prototype.get = function () {
		return this.m_pos.data;
	};

	ListIteratorR.prototype.set = function (val) {
		this.m_pos.data = val;
		return this;
	};

	/**
	 * @param node {Node}
	 * @implements {InputIterator,}
	 * @constructor
	 */
	function ListIteratorC(node) {
		this.m_pos = node;
	}

	/**
	 *
	 * @param other {CxxIterator|*}
	 * @returns {bool}
	 */
	ListIteratorC.prototype.eq = function (other) {
		return this.m_pos == other.m_pos;
	};

	ListIteratorC.prototype.ne = function (other) {
		return !this.eq(other);
	};

	ListIteratorC.prototype.inc = function () {
		this.m_pos = this.m_pos.next;
		return this;
	};

	ListIteratorC.prototype.dec = function () {
		this.m_pos = this.m_pos.prev;
		return this;
	};

	ListIteratorC.prototype.get = function () {
		return this.m_pos.data;
	};


	/**
	 * 本来应该实现为双向迭代器，但却又是只读的，所以不能以 BidirectionalIterator 为父类
	 * @param node {Node}
	 * @implements {CxxIterator}
	 * @constructor
	 */
	function ListIteratorCR(node) {
		this.m_pos = node;
	}

	/**
	 *
	 * 本来应该实现为双向迭代器，但却又是只读的，所以不能以
	 * @param other {CxxIterator|*}
	 * @returns {bool}
	 */
	ListIteratorCR.prototype.eq = function (other) {
		return this.m_pos == other.m_pos;
	};

	ListIteratorCR.prototype.ne = function (other) {
		return !this.eq(other);
	};

	ListIteratorCR.prototype.inc = function () {
		this.m_pos = this.m_pos.prev;
		return this;
	};

	ListIteratorCR.prototype.dec = function () {
		this.m_pos = this.m_pos.next;
		return this;
	};

	ListIteratorCR.prototype.get = function () {
		return this.m_pos.data;
	};


	List.Iterator = ListIterator;
	List.IteratorC = ListIteratorC;
	List.IteratorR = ListIteratorR;
	List.IteratorCR = ListIteratorCR;


	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = List;
	}
	else if (typeof window != 'undefined')
		window.List = List;

})();
