// This version of the StrictRange class is mutable but encapsulates its endpoint
// variables to maintain the invariant that from <= to.
function StrictRange(from, to) {
	// Verify that the invariant holds when we're created
	if (from > to) throw new Error("StrictRange: from must be <= to");

	// Define the accessor methods that maintain the invariant
	function getFrom() {
		return from;
	}

	function getTo() {
		return to;
	}

	function setFrom(f) {  // Don't allow from to be set > to
		if (f <= to) from = f;
		else throw new Error("StrictRange: from must be <= to");
	}

	function setTo(t) {    // Don't allow to to be set < from
		if (t >= from) to = t;
		else throw new Error("StrictRange: to must be >= from");
	}

	// Create enumerable, nonconfigurable properties that use the accessors
	Object.defineProperties(this, {
		from: {get: getFrom, set: setFrom, enumerable: true, configurable: false},
		to: {get: getTo, set: setTo, enumerable: true, configurable: false}
	});
}

// The prototype object is unchanged from previous examples.
// The instance methods read from and to as if they were ordinary properties.
StrictRange.prototype = hideProps({
	constructor: StrictRange,
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
