/**
 * Created by Administrator on 2016/4/5.
 */

describe("sampleSvc", function () {
	var mockWindow, mockModalSvc, sampleSvcObj, myFactoryObj;
	beforeEach(function () {
		module(function ($provide) {
			$provide.service('$window', function () {
				this.alert = jasmine.createSpy('alert');
			});
			$provide.service('modalSvc', function () {
				this.showModalDialog = jasmine.createSpy('showModalDialog');
			});
		});
		module('services');

		inject(function ($window, modalSvc, sampleSvc, myFactory) {
			mockWindow = $window;
			mockModalSvc = modalSvc;
			sampleSvcObj = sampleSvc;
			myFactoryObj = myFactory;
		})
	});

	it("one == 1", function () {
		expect(sampleSvcObj.one).toEqual(1);
	});

	/*
		xdescribe("myFactory", function () {
			it("three == 3", function () {
				expect(myFactoryObj.three).toEqual(3);
			});
		});

		xit('should show alert when title is not passed into showDialog', function () {
			var message = "Some message";
			sampleSvcObj.showDialog(message);

			expect(mockWindow.alert).toHaveBeenCalledWith(message);
			//expect(mockModalSvc.showModalDialog).not.toHaveBeenCalled();
		});

		xit('should show modal when title is passed into showDialog', function () {
			var message = "Some message";
			var title = "Some title";
			sampleSvcObj.showDialog(message, title);

			expect(mockModalSvc.showModalDialog).toHaveBeenCalledWith({
				message: message,
				title: title
			});
			expect(mockWindow.alert).not.toHaveBeenCalled();
		});
	*/
});

describe("Book", function () {

	var BookSvc;

	beforeEach(function () {
		module('services');
		inject(function (Book) {
			BookSvc = Book;
		});
	});

	it("Book() called only once", function () {
		expect(BookSvc.getCount()).toEqual(1);
	});

});


describe("Book again", function () {

	var BookSvc;

	beforeEach(function () {
		module('services');
		inject(function (Book) {
			BookSvc = Book;
		});
	});

	it("Book() called only once", function () {
		expect(BookSvc.getCount()).toEqual(1);
	});

});
