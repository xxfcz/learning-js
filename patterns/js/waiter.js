/**
 * Created by Administrator on 2016/4/14.
 */

"use strict";


// 等待者
var Waiter = function () {
	var dfd = [];   // 已注册的等待对象容器
	var doneCallbacks = [];   // 成功回调函数容器
	var failCallbacks = [];   // 失败回调函数容器
	var slice = Array.prototype.slice;
	var self = this;

	// 监控对象类
	var Promise = function () {
		this.resolved = false;
		this.rejected = false;
	};

	Promise.prototype = {
		// 解决
		resolve: function () {
			this.resolved = true;
			if (!dfd.length)
				return;
			// 遍历所有监控对象
			for (var i = dfd.length - 1; i >= 0; i--) {
				// 若有任意一个是未解决的或是拒绝的，则返回
				if (dfd[i] && (!dfd[i].resolved || dfd[i].rejected))
					return;
				// 否则，清除该监控对象
				dfd.splice(i, 1);
			}
			// 执行解决回调方法
			_exec(doneCallbacks);
		},

		// 拒绝
		reject: function () {
			this.rejected = true;
			if (!dfd.length)
				return;
			dfd.splice(0);  // 清除所有监控对象
			// 执行拒绝回调方法
			_exec(failCallbacks);
		}
	};

	// 创建监控对象
	self.Deferred = function () {
		return new Promise();
	};

	// 回调执行方法
	function _exec(arr) {
		for (var i = 0, len = arr.length; i < len; ++i) {
			try {
				arr[i] && arr[i]();
			}
			catch (e) {
				console.error(e);
			}
		}
	}

	// 监控异步方法
	self.when = function () {
		dfd = slice.call(arguments);
		for (var i = dfd.length - 1; i >= 0; --i) {
			// 无对象，或者已解决/已
			if (!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Promise) {
				dfd.splice(i,1);
			}
		}
		return self;
	};

	// 添加成功回调函数
	self.done = function () {
		doneCallbacks  = doneCallbacks.concat(slice.call(arguments));
		return self;
	};

	// 添加失败回调函数
	self.fail = function () {
		failCallbacks = failCallbacks.concat(slice.call(arguments));
		return self;
	};
};