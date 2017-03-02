/**
 * Created by Administrator on 2016/9/28.
 */
/**
 * 完美匹配问题
 */

const assert = require('assert');
const util = require('util');
const _ = require('lodash');


const NONE = -1;
const INFINITE = 0x7FFFFFF;

/**
 * 伙伴
 * @param arg
 * @constructor
 */
function Partner(arg) {
	arg = arg || {};
	this.name = arg.name || "No Name";
	this.next = arg.next || 0;                 // 下一个邀清对象
	this.current = arg.current || NONE;        // 当前舞伴
	// 偏爱列表，从高到低依次排列对方ID
	// 例如，若对方有3人，偏爱顺序为 #1>#2>#3，则填入 [0,1,2]
	this.prefs = arg.prefs || [];
}


Partner.prototype.getPrefOrder = function (id) {
	return getPrefOrder(this.prefs, id);
};


/**
 *
 * @param men {Array.<Partner>}
 * @param women {Array.<Partner>}
 * @constructor
 */
function GaleShapley(men, women) {
	this.men = men;
	this.women = women;
}


/**
 * Gale-Shapley算法求完美匹配
 * @param men {Array.<Partner>}
 * @param women {Array.<Partner>}
 */
function galeShapley(men, women) {
	var mid = findFreePartner(men);
	while (mid >= 0) {
		// 找到了一个自由状态的男人m
		var m = men[mid];
		// 在m的优先列表中找出尚未求婚的、排名最高的女人w
		var wid = m.prefs[m.next];
		var w = women[wid];
		// w是自由状态？
		if (w.current == NONE) {
			// 将(m,w)置为约会状态
			w.current = mid;
			m.current = wid;
		}
		else {
			// m1 <-- w当前约会的男人
			var mid1 = w.current;
			var m1 = men[mid1];
			// w喜爱自由男士mid胜于当前伴侣mid1吗？（mid序号更小？）
			if (w.getPrefOrder(mid1) > w.getPrefOrder(mid)) {
				// 当前伴侣m1恢复自由身
				m1.current = NONE;
				// 结交新伴侣
				w.current = mid;
				m.current = wid;
			}
		}
		// 无论是否配对成功，对同一个女孩只追求一次
		m.next++;
		// 寻找下一个自由男士
		mid = findFreePartner(men);
	}
	return allPartnersMatch(men);
}


/**
 * 在列表中寻找单身
 * @param partners {Array.<Partner>}
 * @returns {number} 单身人士在列表中的索引号（0起）
 */
function findFreePartner(partners) {
	return _.findIndex(partners, { current: NONE });
}


/**
 * 取得指定伙伴在偏爱列表中的序号
 * @param prefs {Array.<number>}
 * @param id {number} 指定伙伴的ID
 * @returns {number} 偏爱序号，越小越偏爱
 */
function getPrefOrder(prefs, id) {
	assert(_.isArray(prefs));
	assert(_.isNumber(id));

	var o = _.indexOf(prefs, id);
	return (o == -1) ? INFINITE : o;
}


/**
 * 列表中所有人都配对了吗？
 * @param partners {Array.<Partner>}
 * @returns {boolean}
 */
function allPartnersMatch(partners) {
	// 若有没配对的，则返回false
	return !_.some(partners, { current: NONE });
}


/**
 * 输出配对情况
 * @param men {Array.<Partner>}
 * @param women {Array.<Partner>}
 */
function printResult(men, women) {
	_.forEach(men, function (m) {
		var w = women[m.current];
		console.log(util.format('%s - %s', m.name, w.name));
	})
}

exports.galeShapley = galeShapley;
exports.printResult = printResult;

exports.Partner = Partner;
exports.findFreePartner = findFreePartner;
exports.getPrefOrder = getPrefOrder;
exports.allPartnersMatch = allPartnersMatch;
exports.NONE = NONE;
exports.INFINITE = INFINITE;