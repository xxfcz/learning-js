/**
 * Created by Administrator on 2016/10/24.
 */

(function () {


	const List = require('./list');
	const alg = require('./algorithm');


	function toArray(first, last) {
		var result = [];
		while (first.ne(last)) {
			result.push(first.get());
			first.inc();
		}
		return result;
	}

	var std = {
		List: List,
		all_of: alg.all_of,
		any_of: alg.any_of,
		none_of: alg.none_of,
		for_each: alg.for_each,
		find: alg.find,
		find_if: alg.find_if,

		toArray: toArray
	};


	// for (var i in alg) {
	// 	if (alg.hasOwnProperty(i))
	// 		std[i] = alg[i];
	// }

	//-----------------------------------------------------------------------------
	// 导出符号
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = std;
	}
	else if (typeof window != 'undefined')
		window.std = std;

})();