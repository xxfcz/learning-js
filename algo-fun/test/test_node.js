/**
 * Created by Administrator on 2016/9/21.
 */

const util = require('util');
const xu = require('../lib/xutil');


describe('node >', function () {
	it('inherits', function () {
		function Parent() {
			"use strict";
			this.family = 'Xiao';
		}

		function Child() {
			Parent.call(this);
		}

		util.inherits(Child, Parent);

		var c = new Child();
		console.log(xu.typeOf(c));
	});

	it('arguments', function () {
		function foo(x, y, z) {
			console.log(arguments);
			console.log(arguments[0]);
		}

		foo(1, 2, 3, 4);
	});

	it('xu.typeOf', function () {
		function MyClass() { }

		function foo(x) {
			console.log('\n在foo(x)中, x是', xu.typeOf(x));
		}

		var x = new MyClass();
		console.log('\n在外面，x是', xu.typeOf(x));

		foo(new MyClass());
	})
});