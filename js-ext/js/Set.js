/**
 * Created by xxf on 2015/10/14.
 */
function Set() {          // This is the constructor
	this.values = {};     // The properties of this object hold the set
	this.n = 0;           // How many values are in the set
	this.add.apply(this, arguments);  // All arguments are values to add
}

// Add each of the arguments to the set.
Set.prototype.add = function () {
	for (var i = 0; i < arguments.length; i++) {  // For each argument
		var val = arguments[i];                  // The value to add to the set
		var str = Set._v2s(val);                 // Transform it to a string
		if (!this.values.hasOwnProperty(str)) {  // If not already in the set
			this.values[str] = val;              // Map string to value
			this.n++;                            // Increase set size
		}
	}
	return this;                                 // Support chained method calls
};

// Remove each of the arguments from the set.
Set.prototype.remove = function () {
	for (var i = 0; i < arguments.length; i++) {  // For each argument
		var str = Set._v2s(arguments[i]);        // Map to a string
		if (this.values.hasOwnProperty(str)) {   // If it is in the set
			delete this.values[str];             // Delete it
			this.n--;                            // Decrease set size
		}
	}
	return this;                                 // For method chaining
};

// Return true if the set contains value; false otherwise.
Set.prototype.contains = function (value) {
	return this.values.hasOwnProperty(Set._v2s(value));
};

// Return the size of the set.
Set.prototype.size = function () {
	return this.n;
};

// Call function f on the specified context for each element of the set.
Set.prototype.foreach = function (f, context) {
	for (var s in this.values)                 // For each string in the set
		if (this.values.hasOwnProperty(s))    // Ignore inherited properties
			f.call(context, this.values[s]);  // Call f on the value
};

Set.prototype.toArray = function () {
	var a = [];
	this.foreach(function (v) {
		a.push(v);
	}, this);
	return a;
};

Set.prototype.toString = function () {
	var s = "{", i = 0;
	this.foreach(function (v) {
		s += (i++ > 0 ? "," : "") + v.toString();
	});
	return s + "}";
};

Set.prototype.toLocaleString = function () {
	var s = "{", i = 0;
	this.foreach(function (v) {
		s += (i++ > 0 ? "," : "") + v.toLocaleString();
	});
	return s + "}";
};

Set.prototype.toJSON = Set.prototype.toArray;

Set.prototype.equals = generic.equals;


/****************************************************************
 * 静态成员
 ***************************************************************/

/****
 * 由数组来创建一个Set对象
 * @param a 数组
 */
Set.fromArray = function(a){
	s = new Set();
	s.add.apply(s, a);  // 将a整体上作为方法add()的参数传入
	return s;
};

/****************************************************************
 * 内部成员
 ****************************************************************/

// This internal function maps any JavaScript value to a unique string.
Set._v2s = function (val) {
	switch (val) {
		case undefined:
			return 'u';          // Special primitive
		case null:
			return 'n';          // values get single-letter
		case true:
			return 't';          // codes.
		case false:
			return 'f';
		default:
			switch (typeof val) {
				case 'number':
					return '#' + val;    // Numbers get # prefix.
				case 'string':
					return '"' + val;    // Strings get " prefix.
				default:
					return '@' + objectId(val); // Objs and funcs get @
			}
	}

	// For any object, return a string. This function will return a different
	// string for different objects, and will always return the same string
	// if called multiple times for the same object. To do this it creates a
	// property on o. In ES5 the property would be nonenumerable and read-only.
	function objectId(o) {
		var prop = "|**objectid**|";   // Private property name for storing ids
		if (!o.hasOwnProperty(prop))   // If the object has no id
			o[prop] = Set._v2s.next++; // Assign it the next available
		return o[prop];                // Return the id
	}
};
Set._v2s.next = 100;    // Start assigning object ids at this value.


/*
 * This function returns a subclass of specified Set class and overrides
 * the add() method of that class to apply the specified filter.
 */
function filteredSetSubclass(superclass, filter) {
	var constructor = function() {          // The subclass constructor
		superclass.apply(this, arguments);  // Chains to the superclass
	};
	var proto = constructor.prototype = inherit(superclass.prototype);
	proto.constructor = constructor;
	proto.add = function() {
		// Apply the filter to all arguments before adding any
		for(var i = 0; i < arguments.length; i++) {
			var v = arguments[i];
			if (!filter(v)) throw("value " + v + " rejected by filter");
		}
		// Chain to our superclass add implementation
		superclass.prototype.add.apply(this, arguments);
	};
	return constructor;
}
