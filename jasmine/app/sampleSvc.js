/**
 * Created by Administrator on 2016/4/5.
 */

angular.module('services', [])
	.service('sampleSvc', function ($window, modalSvc) {
		var service = {};
		service.showDialog = function (message, title) {
			if (title) {
				modalSvc.showModalDialog({
					title: title,
					message: message
				});
			} else {
				$window.alert(message);
			}
		};

		service.one = 1;
		service.two = 2;
		return service;
	})

	.service('modalSvc', ['$window', function ($window) {
		this.showModalDialog = function (args) {
			return args;
		};
	}])

	.factory('myFactory', function () {
		var factory = {};
		factory.three = 3;
		return factory;
	})

	.service('Book', function ($log) {

		var bookCount = 0;

		function Book() {
			this.name = "Abc";
			$log.log("Book() called!");
			++bookCount;
		}

		Book.prototype.getCount = function () {
			return bookCount;
		};

		return new Book();
	})

;