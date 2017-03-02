/**
 * Created by Administrator on 2016/9/28.
 */

const should = require('should');


var pm = require('../lib/perfect_match');

const Partner = pm.Partner;


describe('完美匹配 >', function () {
	var boys, girls;

	beforeEach(function () {
		girls = [
			new Partner({ name: 'Laura', prefs: [2, 0, 1] }),
			new Partner({ name: 'Marcy', prefs: [0, 2, 1] }),
			new Partner({ name: 'Nancy', prefs: [1, 0, 2] })
		];
		boys = [
			new Partner({ name: 'Albert', prefs: [2, 0, 1] }),
			new Partner({ name: 'Brad', prefs: [1, 2, 0] }),
			new Partner({ name: 'Chuck', prefs: [0, 1, 2] })
		];
	});


	describe('Partner >', function () {
		it('getPrefOrder()', function () {
			var m = boys[0];
			var o = m.getPrefOrder(0);
			should(o).be.eql(1);
		});
	});


	describe('findFreePartner() >', function () {

		it('一开始找到0号', function () {
			should(pm.findFreePartner(boys)).be.eql(0);
			should(pm.findFreePartner(girls)).be.eql(0);
		});


		it('男1女0配对后，男找到女1号', function () {
			boys[1].current = 0;
			girls[0].current = 1;
			should(pm.findFreePartner(boys)).be.eql(0);
			should(pm.findFreePartner(girls)).be.eql(1);
		});

		it('女的都有对象了，男找到NONE', function () {
			girls[0].current = 0;
			girls[1].current = 1;
			girls[2].current = 2;
			should(pm.findFreePartner(girls)).be.eql(pm.NONE);
		});

	});


	describe('getPrefOrder() >', function () {
		it('女1号在男0号的偏爱序号是2', function () {
			var m = boys[0];
			should(pm.getPrefOrder(m.prefs, 1)).be.eql(2);
		});
		it('男0号在女1号的偏爱序号是0', function () {
			var w = girls[1];
			should(pm.getPrefOrder(w.prefs, 0)).be.eql(0);
		});
		it('男9号不在女1号的偏爱列表中', function () {
			var w = girls[1];
			should(pm.getPrefOrder(w.prefs, 9)).be.eql(pm.INFINITE);
		});
	});


	describe('getPrefOrder() 新人再测 >', function () {
		beforeEach(function () {
			girls = [
				new Partner({ name: 'A', prefs: [2, 3, 1, 0] }),
				new Partner({ name: 'B', prefs: [2, 1, 3, 0] }),
				new Partner({ name: 'C', prefs: [0, 2, 3, 1] }),
				new Partner({ name: 'D', prefs: [1, 3, 2, 0] })
			];

			boys = [
				new Partner({ name: 'a', prefs: [0, 3, 2, 1] }),
				new Partner({ name: 'b', prefs: [0, 1, 2, 3] }),
				new Partner({ name: 'c', prefs: [0, 2, 3, 1] }),
				new Partner({ name: 'd', prefs: [1, 0, 3, 2] })
			];
		});

		it('女A最喜欢男c，后面依次是d、b、a', function () {
			var A = girls[0];
			// 在女士A心目中，各男士的优先序号
			var oa = A.getPrefOrder(0); // 3
			var ob = A.getPrefOrder(1); // 2
			var oc = A.getPrefOrder(2); // 0
			var od = A.getPrefOrder(3); // 1
			should(oa).be.eql(3);
			should(ob).be.eql(2);
			should(oc).be.eql(0);
			should(od).be.eql(1);
		});
	});

	describe('allPartnersMatch() >', function () {
		it('有未配对的', function () {
			// 男0女0互配，男1女1互配，男2女2未配
			boys[0].current = girls[0].current = 0;
			boys[1].current = girls[1].current = 1;
			should(pm.allPartnersMatch(boys)).be.false();
			should(pm.allPartnersMatch(girls)).be.false();
		});

		it('男全部配对', function () {
			// 男0女0互配，男1女1互配，男2配女2，但女2尚未配
			boys[0].current = girls[0].current = 0;
			boys[1].current = girls[1].current = 1;
			boys[2].current = 2;
			should(pm.allPartnersMatch(boys)).be.true();
			should(pm.allPartnersMatch(girls)).be.false();
		});

	});

});

