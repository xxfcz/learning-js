/**
 * Created by Administrator on 2016/9/26.
 */

const assert = require('assert');
const util = require('util');
const _ = require('lodash');


const GENIES = 3;  // 和尚总数
const MONKS = 3;     // 妖怪总数


const Direction = {
	Local: false,
	Remote: true
};


function ItemState(lg, lm, rg = 0, rm = 0) {
	this.localGenies = lg;            // 左岸妖怪数
	this.localMonks = lm;             // 左岸和尚数
	this.remoteGenies = rg;           // 右岸妖怪数
	this.remoteMonks = rm;            // 右岸和尚数
	this.boat = Direction.Local;      // 船的位置
	this.action = undefined;          // Action
}

/**
 * 判断动作可行性
 * @param action {Action}
 */
ItemState.prototype.canTakeAction = function (action) {
	//船在目标侧，则不可行
	if (this.boat == action.boatDirection)
		return false;
	//移动前后两侧和尚数不够或者超过总数，则不可行
	if ((this.localMonks + action.moveMonks < 0) || (this.localMonks + action.moveMonks > MONKS))
		return false;
	//移动前后两侧妖怪数不够或者超过总数，则不可行
	if ((this.localGenies + action.moveGenies < 0) || (this.localGenies + action.moveGenies > MONKS))
		return false;

	return true;
};


/**
 * 从当前状态采取动作，生成新状态
 * @param action {Action}
 * @returns {ItemState}
 */
ItemState.prototype.takeAction = function (action) {
	var result = null;
	if (this.canTakeAction(action)) {
		result = new ItemState();
		result.localGenies = this.localGenies + action.moveGenies;
		result.localMonks = this.localMonks + action.moveMonks;
		result.remoteGenies = this.remoteGenies - action.moveGenies;
		result.remoteMonks = this.remoteMonks - action.moveMonks;
		result.boat = action.boatDirection;
		result.action = action;
	}
	return result;
};


ItemState.prototype.isFinalState = function () {
	return (this.boat == Direction.Remote)
		&& (this.localMonks == 0) && (this.localGenies == 0 ) &&
		(this.remoteMonks == MONKS) && (this.remoteGenies == GENIES);
};


ItemState.prototype.isValidState = function () {
	// 本地：和尚数不能小于妖怪数
	if ((this.localMonks > 0) && (this.localGenies > this.localMonks)) {
		return false;
	}
	// 对岸：和尚数不能小于妖怪数
	if ((this.remoteMonks > 0) && (this.remoteGenies > this.remoteMonks)) {
		return false;
	}

	return true;
};


/**
 * 判断状态等价
 * @param rhs {ItemState}
 * @returns {boolean}
 */
ItemState.prototype.isSameState = function (rhs) {
	return (this.localGenies == rhs.localGenies) // 本岸妖怪数相等
		&& (this.localMonks == rhs.localMonks)    // 本岸和尚数相等
		&& (this.remoteGenies == rhs.remoteGenies)// 对岸妖怪数相等
		&& (this.remoteMonks == rhs.remoteMonks)  // 对岸和尚数相等
		&& (this.boat == rhs.boat);               // 船在同侧
};


ItemState.prototype.print = function () {
	if (this.action)
		console.info(ActionLabels[this.action.index]);
};


const ActionIndex = {
	OneGenieGoes: 0,
	TwoGeniesGo: 1,
	OneMonkGoes: 2,
	TwoMonksGo: 3,
	OneGenieOneMonkGo: 4,
	OneGenieBack: 5,
	TwoGeniesBack: 6,
	OneMonkBack: 7,
	TwoMonksBack: 8,
	OneGenieOneMonkBack: 9
};

const ActionLabels = [
	'一个妖怪过河',
	'两个妖怪过河',
	'一个和尚过河',
	'两个和尚过河',
	'一个妖怪与一个和尚过河',
	'一个妖怪回来',
	'两个妖怪回来',
	'一个和尚回来',
	'两个和尚回来',
	'一个妖怪与一个和尚回来'
];


function Action() {
	this.index = 0;    // ActionIndex
	this.boatDirection = 0;      // Direction
	this.moveGenies = 0;  // 移动的妖怪数
	this.moveMonks = 0;
}

const actions = [
	{
		index: ActionIndex.OneGenieGoes,
		boatDirection: Direction.Remote,
		moveGenies: -1, // 负数表示从本地移到对岸
		moveMonks: 0
	},
	{
		index: ActionIndex.TwoGeniesGo,
		boatDirection: Direction.Remote,
		moveGenies: -2,
		moveMonks: 0
	},
	{
		index: ActionIndex.OneMonkGoes,
		boatDirection: Direction.Remote,
		moveGenies: 0,
		moveMonks: -1
	},
	{
		index: ActionIndex.TwoMonksGo,
		boatDirection: Direction.Remote,
		moveGenies: 0,
		moveMonks: -2
	},
	{
		index: ActionIndex.OneGenieOneMonkGo,
		boatDirection: Direction.Remote,
		moveGenies: -1,
		moveMonks: -1
	},
	{
		index: ActionIndex.OneGenieBack,
		boatDirection: Direction.Local,
		moveGenies: 1,
		moveMonks: 0
	},
	{
		index: ActionIndex.TwoGeniesBack,
		boatDirection: Direction.Local,
		moveGenies: 2,
		moveMonks: 0
	},
	{
		index: ActionIndex.OneMonkBack,
		boatDirection: Direction.Local,
		moveGenies: 0,
		moveMonks: 1
	},
	{
		index: ActionIndex.TwoMonksGo,
		boatDirection: Direction.Local,
		moveGenies: 0,
		moveMonks: 2
	},
	{
		index: ActionIndex.OneGenieOneMonkGo,
		boatDirection: Direction.Local,
		moveGenies: 1,
		moveMonks: 1
	}
];


/**
 * 搜索
 * @param states {Array.<ItemState>}
 */
function searchState(states) {
	var current = _.last(states);
	if (current.isFinalState()) {
		printResult(states);
		return;
	}
	// 从当前状态出发，尝试10种动作
	for (var i = 0; i < actions.length; ++i) {
		searchStateOnNewAction(states, current, actions[i]);
	}
}


/**
 * 判断当前状态和新动作有否产生一个新状态，若能，则继续处理新状态
 * @param states
 * @param current
 * @param action
 */
function searchStateOnNewAction(states, current, action) {
	var next = current.takeAction(action);
	if (next) {
		if (next.isValidState() && !isProcessedState(states, next)) {
			states.push(next);
			searchState(states);
			states.pop();
		}
	}
}


/**
 * 判断一个状态是否被处理过
 * @param states {Array.<ItemState>}
 * @param newState {ItemState}
 */
function isProcessedState(states, newState) {
	return -1 != _.findIndex(states, function (s) {
			return newState.isSameState(s);
		});
}


/**
 * 打印本趟搜索结果
 * @param states {Array.<ItemState>}
 */
function printResult(states) {
	printResult.count++;
	console.info(util.format('\r\nResult #%d found:', printResult.count));
	states.forEach(function (s) {
		s.print();
	});
	console.info('\r\n');
}
printResult.count = 0;


function solve() {
	var states = [];
	var init = new ItemState(GENIES, MONKS);
	states.push(init);
	searchState(states);

	// 穷举结束后states应该还是只有一个初始状态
	assert(states.length == 1);
}


exports.solve = solve;

exports.ItemState = ItemState;
exports.ActionIndex = ActionIndex;
exports.actions = actions;
exports.MONK_COUNT = MONKS;
exports.GENIE_COUNT = GENIES;
exports.Direction = Direction;