/**
 * Created by Administrator on 2016/4/14.
 */

describe("Asynchronous specs", function() {
	var value;
	beforeEach(function (done) {
		setTimeout(function () {
			value = 0;
			done();
		}, 1000);
	});
	it("should support async execution of test preparation and expectations", function (done) {
		value++;
		expect(value).toBeGreaterThan(0);
		done();
	});
});