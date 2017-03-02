/**
 * Created by Administrator on 2016/9/13.
 */

/**
 * 计算字符串编辑距离（动态规划法，使用递推）
 */
function editDistance(src, dst) {
	"use strict";
	src = src || '';
	dst = dst || '';
	var d = [];
	var i, j;

	// 距离d[i,j]初始为无穷大
	for (i = 0; i <= src.length; ++i) {
		var row = [];
		for (j = 0; j <= dst.length; ++j) {
			row.push(Math.Infinity);
		}
		d.push(row);
	}

	// 当源串长为0时，距离就是目标串长j
	for (j = 0; j <= dst.length; ++j) {
		d[0][j] = j;
	}
	// 当目标串长为0时，距离就是源串长i
	for (i = 0; i <= src.length; ++i) {
		d[i][0] = i;
	}

	for (i = 1; i <= src.length; ++i) {
		for (j = 1; j <= dst.length; ++j) {
			// 字符src[i-1]与dst[j-1]相同？
			if (src[i - 1] == dst[j - 1]) {
				// 不需要编辑操作
				d[i][j] = d[i - 1][j - 1];
			}
			else {
				var dDel = d[i][j - 1] + 1;      // 源删除字符(src[i])
				var dIns = d[i - 1][j] + 1;      // 源插入字符(dst[j])
				var dRep = d[i - 1][j - 1] + 1;  // 替换字符(src[i]换成dst[j])
				d[i][j] = Math.min(dDel, dIns, dRep);
			}
		}
	}
	return d[src.length][dst.length];
}


module.exports = editDistance;