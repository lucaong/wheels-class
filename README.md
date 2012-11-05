Wheels Class
===========

Simple and powerful classical inheritance for JavaScript. Super lightweight, with no dependencies and fully compatible with CommonJS / npm, AMD and standard browser script tag include.


Install
=======

`wheels-class` can be installed with CommonJS / npm, AMD or standard browser script tag:

**npm**

```shell
npm install wheels-class
```

**AMD / RequireJS**

```javascript
require(["wheels-class"], function( Class ) {
	var MyClass = new Class();
});
```

**Traditional browser script tag**

```html
<script type="text/javascript" src="path/to/wheels-class.js"></script>
<script type="text/javascript">
	var MyClass = new Wheels.Class();
</script>
```


Usage
=====

Class definition
----------------

Pass an object literal to the constructor to create a class and set the object's properties to the class' prototype:

```javascript
var Foo = new Class({
	greet: function() {
		return "Hello :)";
	}
});

var foo = new Foo();
foo.greet(); // => "Hello :)"
```

Passing a function to the constructor causes the function to be executed in the scope of the class:

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

The `subclass` method creates a subclass and accepts the same arguments as the constructor:

```javascript
var Foo = new Class({
	greet: function() {
		return "Hello :)";
	}
});

var Bar = Foo.subclass({
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

The `include` method accepts an object and copies its properties to the class' prototype:

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

The `augment` method accepts an object and copies its properties to the class:

```javascript
var Foo = new Class();

Foo.augment({
	classMethod: function() {
		return "I am a class method!";
	}
});

Foo.classMethod(); // => "I am a class method!"
```
