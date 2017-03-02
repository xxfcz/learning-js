/**
 * Created by Administrator on 2016/9/21.
 */

const _ = require('lodash');
const should = require('should');


describe('lodash >', function () {
	describe('eq >', function () {
		it('不用于数组的等价', function () {
			var a = [1, 2, 3];
			var b = [1, 2, 3];
			should(_.eq(a, b)).be.false();
		})
	});

	describe('findIndex >', function () {
		it('[1,2,3]中找2', function () {
			var a = [1, 2, 3];
			var i = _.findIndex(a, 2);
			//should(i).be.eql(1);
		});
		it('["A","B","C"]中找B', function () {
			var a = ["A", "B", "C"];
			var i = _.findIndex(a, 'B');
			//should(i).be.eql(1);
		})
	});

	describe('indexOf >', function () {
		it('[1,2,3]中找2', function () {
			var a = [1, 2, 3];
			var i = _.indexOf(a, 2);
			should(i).be.eql(1);
		})
	});
});