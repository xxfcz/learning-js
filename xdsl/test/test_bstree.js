/**
 * Created by Administrator on 2016/10/27.
 */

const should = require('should');

const bstree = require('../lib/bstree');
const BSTree = bstree.BinarySearchTree;
const NodeRef = bstree.NodeRef;
const Node = bstree.Node;


describe('二叉搜索树 >', function () {


	describe('内部方法 search() >', function () {

		it('搜索空树', function () {
			var tree = new BSTree();
			var found = tree.search(1);
			should(found).be.eql(new NodeRef({ root: null }, bstree.ROOT));
		});

		it('树中只有一个元素', function () {
			var tree = new BSTree();
			tree.head.root = new Node(3);
			var found = tree.search(1);
			should(found.p.data).be.eql(3);
			should(found.b).be.eql(bstree.LEFT);

			found = tree.search(6);
			should(found.p.data).be.eql(3);
			should(found.b).be.eql(bstree.RIGHT);

			found = tree.search(3);
			should(found.get()).be.eql(tree.root());
		});

		it('2个元素', function () {
			// 创建一个二叉树
			/*                 5
			                  /
			                 3
			 */
			var tree = new BSTree();
			var n5 = new Node(5);
			tree.head.root = n5;
			var n3 = new Node(3);
			n5.left = n3;

			// 搜索1：插入位置为 3 的左叶子
			var found = tree.search(1);
			should(found).be.eql(new NodeRef(n3, bstree.LEFT));

			// 搜索4：插入位置为 3 的右叶子
			found = tree.search(4);
			should(found).be.eql(new NodeRef(n3, bstree.RIGHT));

			// 搜索7：插入位置为 5 的右叶子
			found = tree.search(7);
			should(found).be.eql(new NodeRef(n5, bstree.RIGHT));

			// 搜索5：找到n5
			found = tree.search(5);
			should(found.get()).be.eql(n5);
		})

	});


	describe('insert() >', function () {

		it('在空树中插入元素', function () {
			var tree = new BSTree();
			var b = tree.insert(5);
			should(b).be.true();
			should(tree.insert(5)).be.false();
			should(tree.insert(3)).be.true();
			should(tree.insert(7)).be.true();
			should(tree.insert(10)).be.true();
			should(tree.insert(9)).be.true();

		});
	});


	describe('toArray() >', function () {
		var tree = new BSTree();
		tree.insert(5);
		tree.insert(3);
		tree.insert(7);
		should(tree.toArray()).be.eql([3, 5, 7]);

		tree.insert(1);
		tree.insert(10);
		tree.insert(4);
		tree.insert(2);
		should(tree.toArray()).be.eql([1, 2, 3, 4, 5, 7, 10]);

	});

});