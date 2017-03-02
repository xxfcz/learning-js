/**
 * Created by Administrator on 2016/4/12.
 */

/**
 * SMD - Synchronous Module Definition 同步模块定义
 */

var F = F || {};

F.define = function (str, fn) {
	var parts = str.split(".");
	var old = parent = this;
	var i = len = 0;
	// 若第一个模块是模块管理器单体对象，则移除
	if (parts[0] === "F") {
		parts = parts.slice(1);
	}
	// 屏蔽对define和module模块方法的改写
	// ...

	// 定义每层模块
	for (var len = parts.length; i < len; i++) {
		// 若父模块中无此模块
		if (typeof parent[parts[i]] === 'undefined') {
			// 声明之
			parent[parts[i]] = {};
		}
		// 缓存下一层级的祖父模块
		old = parent;
		// 缓存下一层级的父模块
		parent = parent[parts[i]];
	}

	// 定义模块方法
	if (fn) {
		old[parts[--i]] = fn();
	}

	return this;
};


/**
 * 调用方式：
 * 1) F.module(['dom', document], function(dom, doc) { ... });
 * 2) F.module('dom', 'string.trim', function(dom, trim) { ... });
 */

F.module = function () {
	var args = [].slice.call(arguments);
	var fn = args.pop();    // 最后一个参数是回调函数
	// 取得依赖模块。若args[0]是数组，则依赖模块为args[0]；否则为args
	var parts = args[0] && args[0] instanceof Array ? args[0] : args;
	var modules = [];    // 依赖模块列表
	var modIDs = "";    // 模块路由
	var i = 0;  // 依赖模块索引
	var ilen = parts.length;
	var parent, j, jlen;
	// 遍历依赖模块
	while (i < ilen) {
		// 若是模块路由
		if (typeof parts[i] === "string") {
			// 当前模块之父为F
			parent = this;
			// 解析模块路由，并屏蔽掉F
			modIDs = parts[i].replace(/^F\./, '').split('.');
			for (j = 0, jlen = modIDs.length; j < jlen; j++) {
				parent = parent[modIDs[j]] || false;    // 重置父模块
			}
			//将模块添加到依赖列表中
			modules.push(parent);
		}
		// 若是模块对象
		else {
			// 直接加入依赖模块列表中
			modules.push(parts[i]);
		}
		++i;
	}
	// 执行回调函数
	fn.apply(null, modules);
};