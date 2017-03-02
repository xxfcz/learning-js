/**
 * Created by xxf on 2015/9/29.
 */

// inherit() returns a newly created object that inherits properties from the
// prototype object p.  It uses the ECMAScript 5 function Object.create() if
// it is defined, and otherwise falls back to an older technique.
function inherit(p) {
	if (p == null) throw TypeError(); // p must be a non-null object
	if (Object.create)                // If Object.create() is defined...
		return Object.create(p);      //    then just use it.
	var t = typeof p;                 // Otherwise do some more type checking
	if (t !== "object" && t !== "function") throw TypeError();
	function F() {
	}                   // Define a dummy constructor function.
	F.prototype = p;                  // Set its prototype property to p.
	return new F();                   // Use f() to create an "heir" of p.
}

// Define an extend function that copies the properties of its second and
// subsequent arguments onto its first argument.
// We work around an IE bug here: in many versions of IE, the for/in loop
// won't enumerate an enumerable property of o if the prototype of o has
// a nonenumerable property by the same name. This means that properties
// like toString are not handled correctly unless we explicitly check for them.
var extend = (function () {  // Assign the return value of this function
	// This is the list of special-case properties we check for
	var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty",
		"isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];

	// First check for the presence of the bug before patching it.
	for (var p in { toString: null }) {
		// If we get here, then the for/in loop works correctly and we return
		// a simple version of the extend() function
		return function extend(o) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var prop in source) o[prop] = source[prop];
			}
			return o;
		};
	}
	// If we get here, it means that the for/in loop did not enumerate
	// the toString property of the test object. So return a version
	// of the extend() function that explicitly tests for the nonenumerable
	// properties of Object.prototype.
	return function patched_extend(o) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			// Copy all the enumerable properties
			for (var prop in source) o[prop] = source[prop];

			// And now check the special-case properties
			for (var j = 0; j < protoprops.length; j++) {
				prop = protoprops[j];
				if (source.hasOwnProperty(prop)) o[prop] = source[prop];
			}
		}
		return o;
	};
}());

/*
 * Add a nonenumerable extend() method to Object.prototype.
 * This method extends the object on which it is called by copying properties
 * from the object passed as its argument.  All property attributes are
 * copied, not just the property value.  All own properties (even non-
 * enumerable ones) of the argument object are copied unless a property
 * with the same name already exists in the target object.
 */
Object.defineProperty(Object.prototype,
	"extend",                  // Define Object.prototype.extend
	{
		writable: true,
		enumerable: false,     // Make it nonenumerable
		configurable: true,
		value: function (o) {   // Its value is this function
			// Get all own props, even nonenumerable ones
			var names = Object.getOwnPropertyNames(o);
			// Loop through them
			for (var i = 0; i < names.length; i++) {
				// Skip props already in this object
				if (names[i] in this) continue;
				// Get property description from o
				var desc = Object.getOwnPropertyDescriptor(o, names[i]);
				// Use it to create property on this
				Object.defineProperty(this, names[i], desc);
			}
		}
	});

/*
 * Copy the enumerable properties of p to o, and return o.
 * If o and p have a property by the same name, o's property is left alone.
 * This function does not handle getters and setters or copy attributes.
 */
function merge(o, p) {
	for (prop in p) {                           // For all props in p.
		if (o.hasOwnProperty[prop]) continue;  // Except those already in o.
		o[prop] = p[prop];                     // Add the property to o.
	}
	return o;
}

/*
 * Remove properties from o if there is not a property with the same name in p.
 * Return o.
 */
function restrict(o, p) {
	for (prop in o) {                         // For all props in o
		if (!(prop in p)) delete o[prop];    // Delete if not in p
	}
	return o;
}

/*
 * For each property of p, delete the property with the same name from o.
 * Return o.
 */
function subtract(o, p) {
	for (prop in p) {                         // For all props in p
		delete o[prop];                      // Delete from o (deleting a
		// nonexistent prop is harmless)
	}
	return o;
}

/*
 * Return a new object that holds the properties of both o and p.
 * If o and p have properties by the same name, the values from o are used.
 */
function union(o, p) {
	return extend(extend({}, o), p);
}

/*
 * Return a new object that holds only the properties of o that also appear
 * in p. This is something like the intersection of o and p, but the values of
 * the properties in p are discarded
 */
function intersection(o, p) {
	return restrict(extend({}, o), p);
}

/*
 * Return an array that holds the names of the enumerable own properties of o.
 */
function keys(o) {
	if (typeof o !== "object") throw TypeError();  // Object argument required
	var result = [];                 // The array we will return
	for (var prop in o) {             // For all enumerable properties
		if (o.hasOwnProperty(prop))  // If it is an own property
			result.push(prop);       // add it to the array.
	}
	return result;                   // Return the array.
}


if (!Function.prototype.bind) {
	Function.prototype.bind = function (o /*, args */) {
		// Save the this and arguments values into variables so we can
		// use them in the nested function below.
		var self = this, boundArgs = arguments;

		// The return value of the bind() method is a function
		return function () {
			// Build up an argument list, starting with any args passed
			// to bind after the first one, and follow those with all args
			// passed to this function.
			var args = [], i;
			for (i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
			for (i = 0; i < arguments.length; i++) args.push(arguments[i]);

			// Now invoke self as a method of o, with those arguments
			return self.apply(o, args);
		};
	};
}

function isFunction(obj) {
	return Object.prototype.toString.call(obj) == '[object Function]';
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) == '[object Array]';
}

/**
 * Return the type of o as a string:
 *   -If o is null, return "null", if o is NaN, return "nan".
 *   -If typeof returns a value other than "object" return that value.
 *    (Note that some implementations identify regexps as functions.)
 *   -If the class of o is anything other than "Object", return that.
 *   -If o has a constructor and that constructor has a name, return it.
 *   -Otherwise, just return "Object".
 **/
function type(o) {
	var t, c, n;  // type, class, name

	// Special case for the null value:
	if (o === null) return "null";

	// Another special case: NaN is the only value not equal to itself:
	if (o !== o) return "nan";

	// Use typeof for any value other than "object".
	// This identifies any primitive value and also functions.
	if ((t = typeof o) !== "object") return t;

	// Return the class of the object unless it is "Object".
	// This will identify most native objects.
	if ((c = classof(o)) !== "Object") return c;

	// Return the object's constructor name, if it has one
	if (o.constructor && typeof o.constructor === "function" &&
		(n = o.constructor.getName())) return n;

	// We can't determine a more specific type, so return "Object"
	return "Object";
}

// Return the class of an object.
function classof(o) {
	return Object.prototype.toString.call(o).slice(8, -1);
}

// Return the name of a function (may be "") or null for non-functions
Function.prototype.getName = function () {
	if ("name" in this) return this.name;
	return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};

// This function creates a new enumerated type.  The argument object specifies
// the names and values of each instance of the class. The return value
// is a constructor function that identifies the new class.  Note, however
// that the constructor throws an exception: you can't use it to create new
// instances of the type.  The returned constructor has properties that
// map the name of a value to the value itself, and also a values array,
// a foreach() iterator function
function enumeration(namesToValues) {
	// This is the dummy constructor function that will be the return value.
	var enumeration = function () {
		throw "Can't Instantiate Enumerations";
	};

	// Enumerated values inherit from this object.
	var proto = enumeration.prototype = {
		constructor: enumeration,                   // Identify type
		toString: function () {
			return this.name;
		}, // Return name
		valueOf: function () {
			return this.value;
		}, // Return value
		toJSON: function () {
			return this.name;
		}    // For serialization
	};

	enumeration.values = [];  // An array of the enumerated value objects

	// Now create the instances of this new type.
	for (name in namesToValues) {         // For each value
		var e = inherit(proto);          // Create an object to represent it
		e.name = name;                   // Give it a name
		e.value = namesToValues[name];   // And a value
		enumeration[name] = e;           // Make it a property of constructor
		enumeration.values.push(e);      // And store in the values array
	}
	// A class method for iterating the instances of the class
	enumeration.foreach = function (f, c) {
		for (var i = 0; i < this.values.length; i++) f.call(c, this.values[i]);
	};

	Object.freeze(enumeration.values);
	Object.freeze(enumeration);

	// Return the constructor that identifies the new type
	return enumeration;
}


var generic = {
	// Returns a string that includes the name of the constructor function
	// if available and the names and values of all noninherited, nonfunction
	// properties.
	toString: function () {
		var s = '[';
		// If the object has a constructor and the constructor has a name,
		// use that class name as part of the returned string.  Note that
		// the name property of functions is nonstandard and not supported
		// everywhere.
		if (this.constructor && this.constructor.name)
			s += this.constructor.name + ": ";

		// Now enumerate all noninherited, nonfunction properties
		var n = 0;
		for (var name in this) {
			if (!this.hasOwnProperty(name)) continue;   // skip inherited props
			var value = this[name];
			if (typeof value === "function") continue;  // skip methods
			if (n++) s += ", ";
			s += name + '=' + value;
		}
		return s + ']';
	},

	// Tests for equality by comparing the constructors and instance properties
	// of this and that.  Only works for classes whose instance properties are
	// primitive values that can be compared with ===.
	// As a special case, ignore the special property added by the Set class.
	equals: function (that) {
		if (that == null) return false;
		if (this.constructor !== that.constructor) return false;
		for (var name in this) {
			if (name === "|**objectid**|") continue;     // skip special prop in Set.
			if (!this.hasOwnProperty(name)) continue;    // skip inherited
			if (this[name] !== that[name]) return false; // compare values
		}
		return true;  // If all properties matched, objects are equal.
	}
};

// A simple function for creating simple subclasses
function defineSubclass(superclass,  // Constructor of the superclass
                        constructor, // The constructor for the new subclass
                        methods,     // Instance methods: copied to prototype
                        statics)     // Class properties: copied to constructor
{
	// Set up the prototype object of the subclass
	constructor.prototype = inherit(superclass.prototype);
	constructor.prototype.constructor = constructor;
	// Copy the methods and statics as we would for a regular class
	if (methods) extend(constructor.prototype, methods);
	if (statics) extend(constructor, statics);
	// Return the class
	return constructor;
}

// We can also do this as a method of the superclass constructor
Function.prototype.extend = function (constructor, methods, statics) {
	return defineSubclass(this, constructor, methods, statics);
};


// Wrap our code in a function so we can define variables in the function scope
(function () {
	// Define objectId as a nonenumerable property inherited by all objects.
	// When this property is read, the getter function is invoked.
	// It has no setter, so it is read-only.
	// It is nonconfigurable, so it can't be deleted.
	Object.defineProperty(Object.prototype, "objectId", {
		get: idGetter,       // Method to get value
		enumerable: false,   // Nonenumerable
		configurable: false  // Can't delete it
	});

	// This is the getter function called when objectId is read
	function idGetter() {             // A getter function to return the id
		if (!(idprop in this)) {      // If object doesn't already have an id
			if (!Object.isExtensible(this)) // And if we can add a property
				throw Error("Can't define id for nonextensible objects");
			Object.defineProperty(this, idprop, {         // Give it one now.
				value: nextid++,    // This is the value
				writable: false,    // Read-only
				enumerable: false,  // Nonenumerable
				configurable: false // Nondeletable
			});
		}
		return this[idprop];          // Now return the existing or new value
	}

	// These variables are used by idGetter() and are private to this function
	var idprop = "|**objectId**|";    // Assume this property isn't in use
	var nextid = 1;                   // Start assigning ids at this #

}()); // Invoke the wrapper function to run the code right away


// Make the named (or all) properties of o nonwritable and nonconfigurable.
function freezeProps(o) {
	var props = (arguments.length == 1)              // If 1 arg
		? Object.getOwnPropertyNames(o)              //  use all props
		: Array.prototype.splice.call(arguments, 1); //  else named props
	props.forEach(function (n) { // Make each one read-only and permanent
		// Ignore nonconfigurable properties
		if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
		Object.defineProperty(o, n, { writable: false, configurable: false });
	});
	return o;  // So we can keep using it
}

// Make the named (or all) properties of o nonenumerable, if configurable.
function hideProps(o) {
	var props = (arguments.length == 1)              // If 1 arg
		? Object.getOwnPropertyNames(o)              //  use all props
		: Array.prototype.splice.call(arguments, 1); //  else named props
	props.forEach(function (n) { // Hide each one from the for/in loop
		// Ignore nonconfigurable properties
		if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
		Object.defineProperty(o, n, { enumerable: false });
	});
	return o;
}


/*
 * Define a properties() method in Object.prototype that returns an
 * object representing the named properties of the object on which it
 * is invoked (or representing all own properties of the object, if
 * invoked with no arguments).  The returned object defines four useful
 * methods: toString(), descriptors(), hide(), and show().
 */
(function namespace() {  // Wrap everything in a private function scope

	// This is the function that becomes a method of all object
	function properties() {
		var names;  // An array of property names
		if (arguments.length == 0)  // All own properties of this
			names = Object.getOwnPropertyNames(this);
		else if (arguments.length == 1 && Array.isArray(arguments[0]))
			names = arguments[0];   // Or an array of names
		else                        // Or the names in the argument list
			names = Array.prototype.splice.call(arguments, 0);

		// Return a new Properties object representing the named properties
		return new Properties(this, names);
	}

	// Make it a new nonenumerable property of Object.prototype.
	// This is the only value exported from this private function scope.
	Object.defineProperty(Object.prototype, "properties", {
		value: properties,
		enumerable: false, writable: true, configurable: true
	});

	// This constructor function is invoked by the properties() function above.
	// The Properties class represents a set of properties of an object.
	function Properties(o, names) {
		this.o = o;            // The object that the properties belong to
		this.names = names;    // The names of the properties
	}

	// Make the properties represented by this object nonenumerable
	Properties.prototype.hide = function () {
		var o = this.o, hidden = { enumerable: false };
		this.names.forEach(function (n) {
			if (o.hasOwnProperty(n))
				Object.defineProperty(o, n, hidden);
		});
		return this;
	};

	// Make these properties read-only and nonconfigurable
	Properties.prototype.freeze = function () {
		var o = this.o, frozen = { writable: false, configurable: false };
		this.names.forEach(function (n) {
			if (o.hasOwnProperty(n))
				Object.defineProperty(o, n, frozen);
		});
		return this;
	};

	// Return an object that maps names to descriptors for these properties.
	// Use this to copy properties along with their attributes:
	//   Object.defineProperties(dest, src.properties().descriptors());
	Properties.prototype.descriptors = function () {
		var o = this.o, desc = {};
		this.names.forEach(function (n) {
			if (!o.hasOwnProperty(n)) return;
			desc[n] = Object.getOwnPropertyDescriptor(o, n);
		});
		return desc;
	};

	// Return a nicely formatted list of properties, listing the
	// name, value and attributes. Uses the term "permanent" to mean
	// nonconfigurable, "readonly" to mean nonwritable, and "hidden"
	// to mean nonenumerable. Regular enumerable, writable, configurable
	// properties have no attributes listed.
	Properties.prototype.toString = function () {
		var o = this.o; // Used in the nested function below
		var lines = this.names.map(nameToString);
		return "{\n  " + lines.join(",\n  ") + "\n}";

		function nameToString(n) {
			var s = "", desc = Object.getOwnPropertyDescriptor(o, n);
			if (!desc) return "nonexistent " + n + ": undefined";
			if (!desc.configurable) s += "permanent ";
			if ((desc.get && !desc.set) || !desc.writable) s += "readonly ";
			if (!desc.enumerable) s += "hidden ";
			if (desc.get || desc.set) s += "accessor " + n
			else s += n + ": " + ((typeof desc.value === "function") ? "function"
					: desc.value);
			return s;
		}
	};

	// Finally, make the instance methods of the prototype object above
	// nonenumerable, using the methods we've defined here.
	Properties.prototype.properties().hide();
}()); // Invoke the enclosing function as soon as we're done defining it.

function sliceArgs(args, startIndex) {
	return [].slice.call(args, startIndex || 0);
}

module.exports = {
	inherit: inherit,
	extend: extend,
	merge: merge,
	restrict: restrict,
	subtract: subtract,
	union: union,
	intersection: intersection,
	keys: keys,
	isFunction: isFunction,
	isArray: isArray,
	typeOf: type,
	classOf: classof,
	enumeration: enumeration,
	defineSubclass: defineSubclass,
	sliceArgs: sliceArgs
};
