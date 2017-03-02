/**
 * Created by Administrator on 2016/9/21.
 */

var assert = require('assert');
var util = require('util');
var _ = require('lodash');
var xu = require('./xutil');

/**
 * 倒水问题
 */

const BUCKET_COUNT = 3;
const bucketCapacity = [8, 5, 3];
const bucketInitState = [8, 0, 0];
const bucketFinalState = [4, 4, 0];


function Action(water, from, to) {
	this.from = from;
	this.to = to;
	this.water = water;
}


//************************************************************************************
// 桶状态 BucketState

/**
 * 构造函数
 * @param {(BucketState|Array.<number>)} [initState] - 桶的初始状态
 * @constructor
 */
function BucketState(initState) {
	this.buckets = new Array(BUCKET_COUNT);
	// 从上帝之桶倒水到0#桶，倒满
	this.curAction = new Action(bucketCapacity[0], NaN, 0);
	if (_.isArray(initState)) {
		// 设置各桶水量
		this.setBuckets(initState);
	}
	else if (xu.typeOf(initState) == 'BucketState') {
		this.setBuckets(initState.buckets);
		this.setAction(initState.curAction);
	}
	else if (arguments.length == 0) {
		this.setBuckets(bucketInitState);
	}
}

BucketState.prototype.isSameState = function (state) {
	if (_.isArray(state))
		return isEqualArray(this.buckets, state);
	else if (xu.typeOf(state) == 'BucketState')
		return isEqualArray(this.buckets, state.buckets);
	else
		throw new Error('参数state要么是整数数组，要么是BucketState');
};

BucketState.prototype.isFinalState = function () {
	return this.isSameState(bucketFinalState);
};

/**
 * 设置各桶水量
 * @param buckets
 */
BucketState.prototype.setBuckets = function (buckets) {
	assert(_.isArray(buckets) && buckets.length == BUCKET_COUNT);
	for (var i = 0; i < BUCKET_COUNT; ++i) {
		this.buckets[i] = buckets[i];
	}
};


BucketState.prototype.setAction = function (w, f, t) {
	if (arguments.length == 1) {
		if (xu.typeOf(w) != 'Action') {
			throw new Error('BucketState::setAction() 带1个参数时必须是Action类型');
		}
		var action = w;
		w = action.water;
		f = action.from;
		t = action.to;
	}
	else if (arguments.length != 3) {
		throw new Error('BucketState::setAction() 参数个数必须是1或3');
	}
	this.curAction.water = w;
	this.curAction.from = f;
	this.curAction.to = t;
};

/**
 * 能从桶 #from 向桶 #to 倒水吗？
 * @param from
 * @param to
 * @returns {boolean}
 */
BucketState.prototype.canTakeDumpAction = function (from, to) {
	assert((from >= 0) && (from < BUCKET_COUNT));
	assert((to >= 0) && (to < BUCKET_COUNT));

	//不是同一个桶，且#from桶中有水，且#to桶中不满
	return ((from != to) && (!this.isBucketEmpty(from)) && (!this.isBucketFull(to)));
};

/**
 * 从from到to倒水，在next中返回新的状态（实际倒水体积）
 * @param from
 * @param to
 * @param next {BucketState} 倒水后的状态
 * @returns {boolean} 此次倒水有效？
 */
BucketState.prototype.dumpWater = function (from, to, next) {
	assert(arguments.length == 3);
	assert(xu.typeOf(from) == 'number');
	assert(xu.typeOf(to) == 'number');
	assert(xu.typeOf(next) == 'BucketState');

	next.setBuckets(this.buckets);
	// #to桶最多能倒进多少水？
	var vol = bucketCapacity[to] - next.buckets[to];

	// #from桶有这么多水吗？
	if (next.buckets[from] >= vol) { // 有
		next.buckets[from] -= vol;
		next.buckets[to] += vol;
	}
	else { //#from桶水不够
		next.buckets[to] += next.buckets[from];
		vol = next.buckets[from];
		next.buckets[from] = 0;
	}

	//是一个有效的倒水动作?
	if (vol > 0) {
		next.setAction(vol, from, to);
	}

	return (vol > 0);
};


BucketState.prototype.isBucketEmpty = function (bucketNo) {
	assert((bucketNo >= 0) && (bucketNo < BUCKET_COUNT));
	return this.buckets[bucketNo] == 0;
};


BucketState.prototype.isBucketFull = function (bucketNo) {
	assert((bucketNo >= 0) && (bucketNo < BUCKET_COUNT));
	return this.buckets[bucketNo] == bucketCapacity[bucketNo];
};


BucketState.prototype.print = function () {
	var s = isNaN(this.curAction.from) ? 'Initially' :
		util.format('Dump %d water from #%d to #%d', this.curAction.water, this.curAction.from + 1, this.curAction.to + 1);
	s += util.format(', bucket states: [%s]', this.buckets.join(','));
	console.info(s);
};


//////////////////////////////////////////////////////////////////////

/**
 * 搜索
 * @param states {Array.<BucketState>}
 */
function searchState(states) {
	var current = _.last(states);
	if (current.isFinalState()) {
		printResult(states);
		return;
	}
	/*使用两重循环排列组合6种倒水状态*/
	for (var i = 0; i < BUCKET_COUNT; ++i) {
		for (var j = 0; j < BUCKET_COUNT; ++j) {
			if (i != j)
				searchStateOnAction(states, current, i, j);
		}
	}
}


/**
 *
 * @param states {Array.<BucketState>}
 * @param current {BucketState}
 * @param from {number}
 * @param to {number}
 */
function searchStateOnAction(states, current, from, to) {
	if (current.canTakeDumpAction(from, to)) {
		var next = new BucketState();
		// 从from向to倒水，如果成功，取得倒水后的状态 next
		var bDump = current.dumpWater(from, to, next);
		// 倒水有效，且新状态未被处理过?
		if (bDump && !isProcessedState(states, next)) {
			next.print();
			states.push(next);
			searchState(states);
			states.pop();
		}
	}
}


/**
 * 判断一个状态是否被处理过
 * @param states {Array.<BucketState>}
 * @param newState {BucketState}
 */
function isProcessedState(states, newState) {
	return -1 != _.findIndex(states, function (s) {
			return newState.isSameState(s);
		});
}


/**
 * 打印本趟搜索结果
 * @param states {Array.<BucketState>}
 */
function printResult(states) {
	printResult.count++;
	console.info(util.format('\nResult #%d found:', printResult.count));
	states.forEach(function (s) {
		s.print();
	});
	console.info('\n');
}
printResult.count = 0;

function solve() {
	var states = [];
	var init = new BucketState();
	states.push(init);
	searchState(states);

	// 穷举结束后states应该还是只有一个初始状态
	assert(states.length == 1);
}


function isEqualArray(a, b) {
	if (!_.isArray(a) || !_.isArray(b))
		return false;
	if (a.length != b.length)
		return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] != b[i])
			return false;
	}
	return true;
}


exports.BucketState = BucketState;
exports.Action = Action;
exports.searchState = searchState;
exports.solve = solve;

//以下为了测试而导出
exports.isEqualArray = isEqualArray;
exports.isProcessedState = isProcessedState;
exports.printResult = printResult;