/**
 * Created by xxf on 2015/10/20.
 */


/****************************************************************
 * SingletonSet
 ****************************************************************/

// The constructor function
function SingletonSet(member) {
	this.member = member;   // Remember the single member of the set
}

// Create a prototype object that inherits from the prototype of Set.
SingletonSet.prototype = inherit(Set.prototype);

// Now add properties to the prototype.
// These properties override the properties of the same name from Set.prototype.
extend(SingletonSet.prototype, {
	// Set the constructor property appropriately
	constructor: SingletonSet,
	// This set is read-only: add() and remove() throw errors
	add: function() { throw "read-only set"; },
	remove: function() { throw "read-only set"; },
	// A SingletonSet always has size 1
	size: function() { return 1; },
	// Just invoke the function once, passing the single member.
	foreach: function(f, context) { f.call(context, this.member); },
	// The contains() method is simple: true only for one value
	contains: function(x) { return x === this.member; }
});

SingletonSet.prototype.equals = function(that){
	return that instanceof Set && that.size()==1 && that.contains(this.member);
};


/****************************************************************
 * NonNullSet
 * 不允许null和undefined作为成员
 ****************************************************************/

/*
 * NonNullSet is a subclass of Set that does not allow null and undefined
 * as members of the set.
 */
function NonNullSet() {
	// 只需链接到父类.
	// 此刻，本构造函数已经创建了一个对象 this
	// 接下来以普通函数调用父类构造函数来初始化该对象
	Set.apply(this, arguments);
}

// 将 NonNullSet 设置为 Set 的子类
NonNullSet.prototype = inherit(Set.prototype);
NonNullSet.prototype.constructor = NonNullSet;

// To exclude null and undefined, we only have to override the add() method
NonNullSet.prototype.add = function() {
	// Check for null or undefined arguments
	for(var i = 0; i < arguments.length; i++)
		if (arguments[i] == null)
			throw new Error("Can't add null or undefined to a NonNullSet");

	// Chain to the superclass to perform the actual insertion
	return Set.prototype.add.apply(this, arguments);
};

