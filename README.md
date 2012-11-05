Wheels Class
===========

Simple and powerful classical inheritance for JavaScript. Super lightweight, with no dependencies and fully compatible with CommonJS (Node), AMD and standard browser script tag include.


Usage
=====

Class definition
----------------

Passing an object literal, create a class setting the object's properties to the prototype:

```javascript
var Foo = new Class({
	greet: function() {
		return "Hello :)";
	}
});

var foo = new Foo();
foo.greet(); // => "Hello :)"
```

Passing a function causes the function to be executed in the scope of the class:

```javascript
var Foo = new Class(function() {

	this.classMethod = function() {
		return "I am a class method";
	}

	this.prototype.greet = function() {
		return "Hello :)";
	}

});

var foo = new Foo();

Foo.classMethod(); // => "I am a class method"
foo.greet();        // => "Hello :)"
```

Class inheritance
-----------------

Create a subclass with the `sub` method, which accepts the same arguments as the `Class` constructor:

```javascript
var Foo = new Class({
	greet: function() {
		return "Hello :)";
	}
});

var Bar = Foo.sub({
	whoami: function() {
		return "bar";
	}
});

var bar = new Bar();
bar.greet();  // => "Hello :)"
bar.whoami(); // => "bar"
```

Include and augment
-------------------

The `include` method accepts an object and copy its properties to the class' prototype:

```javascript
var Foo = new Class();

Foo.include({
	quack: function() {
		return "Quack!";
	}
});

var foo = new Foo();
foo.quack(); // => "Quack!"
```

The `augment` method accepts an object and copy its properties to the class:

```javascript
var Foo = new Class();

Foo.augment({
	classMethod: function() {
		return "I am a class method!";
	}
});

Foo.classMethod(); // => "I am a class method!"
```
