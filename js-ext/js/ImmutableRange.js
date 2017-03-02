/**
 * Created by xxf on 2015/10/20.
 */

/*
// This function works with or without 'new': a constructor and factory function
function ImmutableRange(from, to) {
	// These are descriptors for the read-only from and to properties.
	var props = {
		from: {value: from, enumerable: true, writable: false, configurable: false},
		to: {value: to, enumerable: true, writable: false, configurable: false}
	};

	if (this instanceof ImmutableRange)                // If invoked as a constructor
		Object.defineProperties(this, props); // Define the properties
	else                                      // Otherwise, as a factory
		return Object.create(ImmutableRange.prototype, // Create and return a new
			props);          // Range object with props
}

// If we add properties to the Range.prototype object in the same way,
// then we can set attributes on those properties.  Since we don't specify
// enumerable, writable, or configurable, they all default to false.
Object.defineProperties(ImmutableRange.prototype, {
	includes: {
		value: function (x) {
			return this.from <= x && x <= this.to;
		}
	},
	foreach: {
		value: function (f) {
			for (var x = Math.ceil(this.from); x <= this.to; x++) f(x);
		}
	},
	toString: {
		value: function () {
			return "(" + this.from + "..." + this.to + ")";
		}
	}
});
*/

//一个简单的不可变类

function ImmutableRange(from, to) {    // Constructor for an immutable Range class
	this.from = from;
	this.to = to;
	var id = this.objectId;
	//freezeProps(this);        // Make the properties immutable
	Object.freeze(this);
}

ImmutableRange.prototype = hideProps({ // Define prototype with nonenumerable properties
	constructor: ImmutableRange,
	includes: function (x) {
		return this.from <= x && x <= this.to;
	},
	foreach: function (f) {
		for (var x = Math.ceil(this.from); x <= this.to; x++) f(x);
	},
	toString: function () {
		return "(" + this.from + "..." + this.to + ")";
	}
});
