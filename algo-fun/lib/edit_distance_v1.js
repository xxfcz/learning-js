/**
 * Created by Administrator on 2016/9/13.
 */

/**
 * 计算源串到目标串的编辑距离
 * @param src 源串
 * @param dst 目标串
 */
function editDistance(src, dst) {
	src = src || '';
	dst = dst || '';
	editDistance.ops++;
	if (src.length == 0 || dst.length == 0) {
		return Math.abs(src.length - dst.length);
	}

	if (src[0] == dst[0]) {
		return editDistance(src.substring(1), dst.substring(1));
	}

	var dDel = editDistance(src.substring(1), dst) + 1;   // 源删除字符(src[0])
	var dIns = editDistance(src, dst.substring(1)) + 1;   // 源插入字符(dst[0])
	var dRep = editDistance(src.substring(1), dst.substring(1)) + 1;   // 替换字符(src[0]换成dst[0])
	return Math.min(dDel, dIns, dRep);
}

editDistance.ops = 0;

module.exports = editDistance;