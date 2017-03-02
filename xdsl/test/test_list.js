/**
 * Created by Administrator on 2016/10/19.
 */


const should = require('should');

const List = require('../lib/list');


describe('List >', function () {

	it('空链表中插入1个元素', function () {
		var list = new List();
		list.push_back(1);
		var h = list.m_head;
		var n = h.next;
		var p = h.prev;
		should(n).be.equal(p);
	});

	it('空链表中插入2个元素, size() == 2', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		should(list.size()).be.eql(2);
		var a = list.toArray();
		should(a).be.eql([1, 2]);
	});

	it('非空链表中删除尾节点', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.pop_back();
		var a = list.toArray();
		should(a).be.eql([1]);
	});

	it('空链表中删除尾节点: fine', function () {
		var list = new List();
		list.pop_back();
		var a = list.toArray();
		should(a).be.eql([]);
	});

	it('非空链表中取尾节点的数据', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var x = list.back();
		should(x).be.eql(3);
	});

	it('空链表中取尾节点的数据，行为无定义', function () {
		var list = new List();
		list.back();
	});

	it('无元素的链表：empty() == true, size() == 0', function () {
		var list = new List();
		should(list.empty()).be.true();
		should(list.size()).be.eql(0);
	});

	it('有元素的链表：empty() == false', function () {
		var list = new List();
		list.push_back(1);
		should(list.empty()).be.false();
	});

	it('从链表中删除了最后一个元素：empty() == true', function () {
		var list = new List();
		list.push_back(1);
		list.pop_back();
		should(list.empty()).be.true();
	});

	it('clear(): 把非空链表清空', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		list.clear();
		should(list.empty()).be.true();
	});

	it('clear(): 把空链表清空', function () {
		var list = new List();
		list.clear();
		should(list.empty()).be.true();
	});

	describe('insert() >', function () {
		it('在空链表中插入', function () {
			var list = new List();
			var itr = list.end();
			list.insert(itr, 999);
			should(list.front()).be.eql(999);
			should(list.back()).be.eql(999);
			should(list.size()).be.eql(1);
			itr = list.cbegin();
			should(itr.get()).be.eql(999);
		});
		it('在非空链表中插入', function () {
			var list = new List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);
			var itr = list.end();
			var inserted = list.insert(itr, 99);
			should(list.back()).be.eql(99);
			should(inserted.get()).be.eql(99);

			should(list.size()).be.eql(4);
			itr = list.rbegin();
			should(itr.get()).be.eql(99);
		});

		it('插入多个副本', function () {
			var list = new List();
			list.insert_fill(list.begin(), 3, 99);
			should(list.toArray()).be.eql([99, 99, 99]);
		});

		it('插入一个迭代器范围', function () {
			var list = new List();
			var seeds = new List();
			seeds.push_back(1);
			seeds.push_back(2);
			seeds.push_back(3);
			seeds.push_back(4);

			var last_inserted = list.insert_range(list.end(), seeds.begin(), seeds.end());
			should(list.toArray()).be.eql(seeds.toArray());
			// 返回的迭代器指向最后添加的元素
			should(last_inserted.get()).be.eql(4);
		});

		it('插入一个初始化列表（Array）', function () {
			var list = new List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);
			list.push_back(4);

			var last_inserted = list.insert_array(list.end(), [10, 20, 30]);
			should(list.toArray()).be.eql([1, 2, 3, 4, 10, 20, 30]);
			should(last_inserted.get()).be.eql(30);
		});

	});

	describe('迭代器', function () {
		it('各种操作', function () {
			var list = new List();
			list.push_back(1);
			list.push_back(2);
			list.push_back(3);
			var itr = list.begin();
			should(itr.get()).be.eql(1);
			// 前向
			itr.inc();
			should(itr.get()).be.eql(2);
			// 后向
			itr.dec();
			should(itr.get()).be.eql(1);
			// 修改值
			itr.set(10);
			should(itr.get()).be.eql(10);

			var a = list.toArray();
			should(a).be.eql([10, 2, 3]);
		});

		it('空list的迭代器 begin 等价于 end', function () {
			var list = new List();
			var begin = list.begin();
			var end = list.end();
			should(begin.eq(end)).be.true();
		});
	});


});

describe('List.Iterator >', function () {
	it('inc、get、set():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.begin();
		should(itr.get()).be.eql(1);
		itr.inc();
		should(itr.get()).be.eql(2);
		itr.inc();
		itr.set(999);
		should(itr.get()).be.eql(999);
	});
	it('迭代器的比较：eq、ne()', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.begin();
		should(itr.get()).be.eql(1);
		itr.inc();
		should(itr.get()).be.eql(2);
		should(itr.ne(list.end())).be.true();
		itr.inc();
		should(itr.get()).be.eql(3);
		itr.inc();
		should(itr.eq(list.end())).be.true();
	});
});

describe('List的只读迭代器 >', function () {
	it('inc、get():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.begin();
		should(itr.get()).be.eql(1);
		itr.inc();
		should(itr.get()).be.eql(2);
		itr.inc();
	});

	it('迭代器的比较：eq、ne()', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.begin();
		should(itr.get()).be.eql(1);
		itr.inc();
		should(itr.get()).be.eql(2);
		should(itr.ne(list.end())).be.true();
		itr.inc();
		should(itr.get()).be.eql(3);
		itr.inc();
		should(itr.eq(list.end())).be.true();
	});

	it('只读', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		var itr = list.cbegin();
		should(function () {
			itr.set(7);
		}).throw(TypeError);
	});
});

describe('List的反向迭代器 >', function () {
	it('inc、get():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.rbegin();
		should(itr.get()).be.eql(3);
		itr.inc();
		should(itr.get()).be.eql(2);
		itr.inc();
		should(itr.get()).be.eql(1);
	});

	it('dec、set():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.rend();
		itr.dec();
		should(itr.get()).be.eql(1);
		itr.dec();
		should(itr.get()).be.eql(2);
		itr.dec();
		should(itr.get()).be.eql(3);
		itr.set(100);
		should(itr.get()).be.eql(100);
	});
});

describe('List的只读反向迭代器 >', function () {
	it('inc、get():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.crbegin();
		should(itr.get()).be.eql(3);
		itr.inc();
		should(itr.get()).be.eql(2);
		itr.inc();
		should(itr.get()).be.eql(1);
	});

	it('dec():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.crend();
		itr.dec();
		should(itr.get()).be.eql(1);
		itr.dec();
		should(itr.get()).be.eql(2);
		itr.dec();
		should(itr.get()).be.eql(3);
	});


	it('不可set():', function () {
		var list = new List();
		list.push_back(1);
		list.push_back(2);
		list.push_back(3);
		var itr = list.crbegin();
		should(function () {
			itr.set(100);     // TypeError: itr.set() is not a function
		}).throw(TypeError);
	});
});