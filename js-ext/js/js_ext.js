/**
 * Array extensions
 */

Array.prototype.search = function (f) {
	for (var i = 0, count = this.length; i < count; ++i) {
		if (f(this[i]))
			return this[i];
	}
	return undefined;
};

/**
 * 对重复的元素作指定处理，然后返回元素唯一的数组副本
 * @param comp 比较函数，原型为
 *          Integer r = function (e1, e2)
 *          返回值 r<0表示e1<e2，r=0表示e1=e2，r>0表示e1>e2。
 * @param collect (可选)收集函数，每找出一批重复的元素时被调用，原型为
 *          e = function (ar)
 *          其中参数ar是原数组中、当前批次被标记为重复的那些元素组成的数组。
 *          返回的新元素值e将取代那些重复元素而被用于添加到结果数组中。
 *
 * @returns {Array}
 */
Array.prototype.unique = function (comp, collect) {
	if (!comp)
		throw "必须提供第一个参数comp, 类型为函数: function(e1, e2)";

	var self = this.sort(comp);
	var result = [];

	// 空数组
	if (self.length == 0)
		return result;

	var lb = 0; // 初始化下界
	var ub = lb + 1;
	// 寻找重复元素的上界（不包含）
	while (ub < self.length) {
		if (comp(self[lb], self[ub]) != 0) { // 不同了，遇到上界ub（不包含）
			if (collect)
				result.push(collect(self.slice(lb, ub)));
			else
				result.push(self[lb]);
			lb = ub; // 移动下界
		}
		++ub;
	}
	// 收集最后一组
	if (lb != ub) {
		if (collect)
			result.push(collect(self.slice(lb, ub)));
		else
			result.push(self[lb]);
	}

	return result;
};


/**
 * String extensions
 */

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g,
		function (m, i) {
			return args[i];
		});
};

String.format = function () {
	if (arguments.length == 0)
		return null;

	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(re, arguments[i]);
	}
	return str;
};

/**
 * Date extensions
 */

//日期格式化
Date.prototype.format = function (format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

Date.prototype.addHours = function (n) {
	return new Date(this.getTime() + n * 60 * 60 * 1000);
};

Date.prototype.addDays = function (n) {
	return new Date(this.getTime() + n * 24 * 60 * 60 * 1000);
};

Date.prototype.addMonths = function (n) {
	var d = new Date(this.getTime());
	d.setMonth(this.getMonth() + 1);
	return d;
};

Date.prototype.isSameDay = function (other) {
	return this.getFullYear() == other.getFullYear() &&
		this.getMonth() == other.getMonth() &&
		this.getDate() == other.getDate();
};
