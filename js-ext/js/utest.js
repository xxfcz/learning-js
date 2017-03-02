/**
 * Created by xxf on 2015/10/16.
 */

const EPS = 1e-6;

function assert(predicate) {
	if (predicate) {
		try {
			throw new Error();
		} catch (e) {
			var loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
			console.info("assert passed:" + loc);
		}
	}
	else {
		try {
			throw new Error();
		} catch (e) {
			console.log("Stack:" + e.stack);
			loc = e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
			console.error("assert failed:" + loc);
		}
	}
}

