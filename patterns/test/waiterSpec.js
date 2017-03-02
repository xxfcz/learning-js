/**
 * Created by Administrator on 2016/4/14.
 */

describe("setTimeout()", function () {

	beforeEach(function () {
		setTimeout(function () {
			console.log('first');
		}, 500);
		console.log('second');

	});

	it("延时", function () {
	});
});


describe("Waiter", function () {
	var waiter, ok;
	beforeEach(function (done) {
		waiter = new Waiter();
		var d = (function () {
			var d = waiter.Deferred();
			setTimeout(function () {
				console.log("标志解决！");
				d.resolve();
			}, 3000);
			return d;
		})();
		waiter.when(d).done(function () {
			ok = true;
			done();
		}).fail(function () {
			ok = false;
			done();
		});
	}, 5000);

	it("彩蛋", function (done) {
		expect(ok).toBeTruthy();
		done();
	})
});