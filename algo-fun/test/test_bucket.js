/**
 * Created by Administrator on 2016/9/21.
 */

const should = require('should');

const xu = require('../lib/xutil');
const bucket = require('../lib/bucket');
const BucketState = bucket.BucketState;

describe('倒水问题 >', function () {

	describe('isEqualArray', function () {
		it('[1,2]和[2,1]不同', function () {
			var a = [1, 2], b = [2, 1];
			var eql = bucket.isEqualArray(a, b);
			should(eql).be.false();
		});
		it('[1,2]和[1,2]相同', function () {
			var a = [1, 2], b = [1, 2];
			var eql = bucket.isEqualArray(a, b);
			should(eql).be.true();
		})

	});

	describe('BucketState >', function () {
		it('print()', function () {
			var s1 = new BucketState();
			s1.print();
			var s2 = new BucketState();
			s1.dumpWater(0, 1, s2);
			s2.print();
		});

		it('setAction, 1个参数', function () {
			var s = new BucketState();
			var a = new bucket.Action(10, 1, 2);
			s.setAction(a);
			should(s.curAction.water).be.eql(10);
			should(s.curAction.from).be.eql(1);
			should(s.curAction.to).be.eql(2);
		});

		it('setAction, 3个参数', function () {
			var s = new BucketState();
			s.setAction(10, 1, 2);
			should(s.curAction.water).be.eql(10);
			should(s.curAction.from).be.eql(1);
			should(s.curAction.to).be.eql(2);
		});

		it('setAction, 2个参数, 报错', function () {
			(function () {
				var s = new BucketState();
				s.setAction(10, 1);
			}).should.throw(Error);
		});

		it('setStates', function () {
			var s = new BucketState();
			s.setBuckets([1, 2, 3]);
			should(s.buckets).be.eql([1, 2, 3]);
		});

		it('类型测试', function () {
			var s = new BucketState();
			should(xu.typeOf(s)).be.eql('BucketState');
		});

		it('isSameState()', function () {
			var s1 = new BucketState();
			var s2 = new BucketState();
			should(s1.isSameState(s2)).be.true();

			var s3 = new BucketState();
			s3.buckets[2] = 100;
			should(s1.isSameState(s3)).be.false();
		});

		it('isFinalState()', function () {
			var s1 = new BucketState();
			var s2 = new BucketState([4, 4, 0]);
			should(s1.isFinalState()).be.false();
			should(s2.isFinalState()).be.true();
		});

		it('canTakeDumpAction()', function () {
			// 注意各桶容量：8 5 3
			var s = new BucketState([8, 4, 0]);
			should(s.canTakeDumpAction(0, 1)).be.true();
			should(s.canTakeDumpAction(1, 0)).be.false();
			should(s.canTakeDumpAction(1, 2)).be.true();
			should(s.canTakeDumpAction(2, 1)).be.false();
		});

		it('dumpWater()', function () {
			var s1 = new BucketState([8, 4, 0]);
			var s2 = new BucketState();
			var b = s1.dumpWater(0, 1, s2);
			should(b).be.true();
			should(s2.buckets).be.eql([7, 5, 0]);
			b = s2.dumpWater(0, 2, s1);
			should(b).be.true();
			should(s1.buckets).be.eql([4, 5, 3]);
			b = s1.dumpWater(0, 2, s2);
			should(b).be.false();
		})
	});

	describe('全局函数 >', function () {
		it('isProcessedState()', function () {
			var states = [];
			states.push(new BucketState([0, 1, 2]));
			states.push(new BucketState([7, 3, 1]));
			var b = bucket.isProcessedState(states, new BucketState([7, 3, 1]));
			should(b).be.true();
			b = bucket.isProcessedState(states, new BucketState([2, 3, 1]));
			should(b).be.false();
		});

		it('printResult() 1个状态', function () {
			var states = [];
			var s0 = new BucketState([8, 0, 0]);
			states.push(s0);

			bucket.printResult(states);
		});

		it('printResult() 2个状态', function () {
			var states = [];
			var s0 = new BucketState([8, 0, 0]);
			states.push(s0);

			var next = new BucketState();
			s0.dumpWater(0, 1, next);
			should(next.buckets).be.eql([3, 5, 0]);
			states.push(next);

			bucket.printResult(states);
		});

		it('printResult() 3个状态', function () {
			var states = [];
			var s0 = new BucketState([8, 0, 0]);
			states.push(s0);

			var next = new BucketState();
			s0.dumpWater(0, 1, next);
			should(next.buckets).be.eql([3, 5, 0]);
			states.push(next);

			s0 = new BucketState(next);
			next = new BucketState();
			s0.dumpWater(1, 2, next);
			should(next.buckets).be.eql([3, 2, 3]);

			bucket.printResult(states);
		});

	})
});