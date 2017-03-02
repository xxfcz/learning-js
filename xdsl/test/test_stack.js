/**
 * Created by Administrator on 2016/10/27.
 */

const should = require('should');

const Stack = require('../lib/stack');

describe('栈 >', function () {

	it('使用默认容器', function () {

		var stack = new Stack();
		should(stack.empty()).be.true();
		stack.push(10);
		should(stack.top()).be.eql(10);
		stack.pop();
		should(stack.empty()).be.true();
		stack.push(9);
		stack.push(8);
		stack.push(7);
		should(stack.size()).be.eql(3);
	})

});
