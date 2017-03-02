/**
 * Created by Administrator on 2016/9/26.
 */

const should = require('should');


const cr = require('../lib/cross_river');


describe('过河问题 >', function () {

	describe('ItemState >', function () {

		it('isFinalState()', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			should(state.isFinalState()).be.false();

			state.boat = cr.Direction.Remote;
			state.localGenies = state.localMonks = 0;
			state.remoteGenies = cr.GENIE_COUNT;
			state.remoteMonks = cr.MONK_COUNT;
			should(state.isFinalState()).be.true();
		});

		it('canTakeAction()', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			should(state.action).be.undefined();
			should(state.canTakeAction(cr.actions[cr.ActionIndex.OneMonkGoes])).be.true();
			should(state.canTakeAction(cr.actions[cr.ActionIndex.OneGenieGoes])).be.true();
			should(state.canTakeAction(cr.actions[cr.ActionIndex.OneGenieOneMonkBack])).be.false();
		});

		it('takeAction()', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			var action = cr.actions[cr.ActionIndex.OneMonkGoes];
			should(state.canTakeAction(action)).be.true();
			var next = state.takeAction(action);
			should(state.action).be.undefined();
			should(next.action).be.eql(action);
		});

		it('takeAction() 不能采取的行动，返回null', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			var next = state.takeAction(cr.actions[cr.ActionIndex.OneMonkBack]);
			should(next).be.null();
		});

		it('isValidState()', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			should(state.isValidState()).be.true();
			var action = cr.actions[cr.ActionIndex.OneMonkGoes];
			var next = state.takeAction(action);
			should(next.isValidState()).be.false(); // 本地妖怪多于和
			next = state.takeAction(cr.actions[cr.ActionIndex.OneGenieGoes]);
			should(next.isValidState()).be.true();
		});

		it('print()', function () {
			var state = new cr.ItemState(cr.MONK_COUNT, cr.GENIE_COUNT);
			var action = cr.actions[cr.ActionIndex.OneMonkGoes];
			var next = state.takeAction(action);
			next.print();
		});

	});

});