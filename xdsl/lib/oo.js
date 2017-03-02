/**
 * Created by Administrator on 2016/10/20.
 */

(function () {

	function extend(Child, Parent) {
		let F = function () {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.prototype.superclass = Parent;
		Child.prototype.inherited = Parent.prototype;
		Child.prototype.static = Child;
		return Child;
	}

	/*
 * Copy the enumerable properties of p to o, and return o.
 * If o and p have a property by the same name, o's property is left alone.
 * This function does not handle getters and setters or copy attributes.
 */
	function merge(o, p) {
		for (prop in p) {                           // For all props in p.
			if (o.hasOwnProperty(prop)) continue;  // Except those already in o.
			o[prop] = p[prop];                     // Add the property to o.
		}
		return o;
	}


	let oo = {
		extend: extend,
		merge: merge
	};


	if (typeof module != 'undefined' && typeof module.exports != 'undefined')
		module.exports = oo;
	else if (typeof window != 'undefined')
		window.oo = oo;
})();

