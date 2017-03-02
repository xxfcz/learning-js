/**
 * Created by Administrator on 2016/4/13.
 */

/**
 * AMD - Asynchronous Module Definition 异步模块定义
 */

~(function (F) {
	var moduleCache = {};
})((function () {
	return window.F = {};
})());

/**
 * 调用方式：
 * 1) F.module(['dom', document], function(dom, doc) { ... });
 * 2) F.module('dom', 'string.trim', function(dom, trim) { ... });
 */

F.module = function (url, modDeps, modCallback) {
	var args = [].slice.call(arguments);
	var callback = args.pop();    // 最后一个参数是回调函数
	// 取得依赖模块。紧邻回调函数，且数据类型是数组
	var deps = args.length && args[args.length - 1] instanceof Array ? args.pop() : [];

	var params = [];    // 依赖模块列表
	var modIDs = "";    // 模块路由
	var depsCount = 0;  // 未加载的依赖模块数量
	var i = 0;  // 依赖模块索引
	var len = deps.length;
	if (len) {
		// 遍历依赖模块
		while (i < len) {
			// 若是模块路由
			if (typeof deps[i] === "string") {
				// 当前模块之父为F
				parent = this;
				// 解析模块路由，并屏蔽掉F
				modIDs = deps[i].replace(/^F\./, '').split('.');
				for (j = 0, jlen = modIDs.length; j < jlen; j++) {
					parent = parent[modIDs[j]] || false;    // 重置父模块
				}
				//将模块添加到依赖列表中
				params.push(parent);
			}
			// 若是模块对象
			else {
				// 直接加入依赖模块列表中
				params.push(deps[i]);
			}
			++i;
		}
	}
	// 执行回调函数
	callback.apply(null, params);
};