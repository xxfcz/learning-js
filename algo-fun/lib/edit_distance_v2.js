/**
 * Created by Administrator on 2016/9/13.
 */

//*******************************************************
// 计算源串到目标串的编辑距离：动态规划法，使用递归
//
// d[i,j] ===> 从src[0..i]到dst[0..j]的编辑距离

function EditDistance() {
}

EditDistance.prototype.calculate = function (i, j) {
	var src = this.src;
	var dst = this.dst;
	var memo = this.memo;

	this.ops++;

	if (memo[i][j].refCount) {
		memo[i][j].refCount++;
		return memo[i][j].distance;
	}

	var distance = 0;
	if (src.substring(i).length == 0) { // 源串i处无字符了？
		distance = dst.substring(j).length;
	}
	else if (dst.substring(j).length == 0) { // 目标串j处无字符了？
		distance = src.substring(i).length;
	}
	else {
		if (src[i] == dst[j]) {
			distance = this.calculate(i + 1, j + 1);
		}
		else {
			var dDel = this.calculate(i + 1, j) + 1;      // 源删除字符(src[i])
			var dIns = this.calculate(i, j + 1) + 1;      // 源插入字符(dst[j])
			var dRep = this.calculate(i + 1, j + 1) + 1;  // 替换字符(src[i]换成dst[j])
			distance = Math.min(dDel, dIns, dRep);
		}
	}

	memo[i][j].distance = distance;
	memo[i][j].refCount = 1;
	return distance;
};

EditDistance.prototype.solve = function (src, dst) {
	this.src = src = src || '';
	this.dst = dst = dst || '';
	this.memo = [];
	this.ops = 0;
	for (var i = 0; i < src.length + 1; ++i) {
		var row = [];
		for (var j = 0; j < dst.length + 1; ++j) {
			row.push({
				distance: Math.Infinity,
				refCount: 0
			});
		}
		this.memo.push(row);
	}

	return this.calculate(0, 0);
};


module.exports = EditDistance;