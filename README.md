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
  var MyClass = Class.new();
});
```

**Traditional browser script tag**

```html
<script type="text/javascript" src="path/to/wheels-class.js"></script>
<script type="text/javascript">
  var MyClass = Wheels.Class.new();
</script>
```


Usage
=====

Class definition
----------------

A new class is an instance of `Class`, and thus is created using the `Class.new` factory method. Calling `Class.new` passing an object creates a class and adds the object's properties to the instance's prototype (referenced also in `MyNewClass.\_instance\_proto`), so that they become instance properties when the class is instantiated:

```javascript
var Foo = Class.new({
  greet: function() {
    return "Hello :)";
  }
});

var foo = Foo.new();
foo.greet(); // => "Hello :)"
```

Alternatively, you can pass a function to `Class.new`, and it will be executed in the scope of the class, meaning that, whithin the function, `this` is the class itself. Also, the function will receive the instance's prototype object as the first argument:

```javascript
var Foo = Class.new(function( proto ) {

  // `this` is the class, here Foo
  this.classMethod = function() {
    return "I am a class method";
  }

  // first argument is the prototype of the instance (same as Foo._instance_proto)
  proto.instanceMethod = function() {
    return "Hello :)";
  }

});

var foo = Foo.new();

Foo.classMethod();    // => "I am a class method"
foo.instanceMethod(); // => "Hello :)"
```

As seen in these examples, a class `Foo` is instantiated by calling `Foo.new()`. The `new` method returns the newly created instance and, if it has a method called `initialize`, it calls it passing all the original arguments:

```javascript
var Person = Class.new({
  initialize: function( name, color ) {
    this.name = name;
    this.color = color;
  },

  introduce: function() {
    return "Hi, my name is " + this.name + " and my color is " + this.color;
  }
});

var person = Person.new( "Alex", "red" );
person.introduce(); // => "Hi, my name is Alex and my color is red"
```

Class inheritance
-----------------

The `subclass` method creates a subclass and accepts the same arguments as the `Class.new` method:

```javascript
var Animal = Class.new({
  eat: function() {
    return "Yum :)";
  }
});

var Cat = Animal.subclass({
  meow: function() {
    return "Meow!";
  }
});

var nyan = Cat.new();
nyan.eat();  // => "Yum :)"
nyan.meow(); // => "Meow!"

// The subclass also stores a reference to the superclass
Cat._superclass === Animal // => true
```

Class inclusion and manipulation
================================

Include
-------

The `include` class method accepts one or more objects and copies their properties to the instance's prototype:

```javascript
var Duck = Class.new();

Duck.include({
  quack: function() {
    return "Quack!";
  }
});

var donald = new Duck();
donald.quack(); // => "Quack!"
```

If the included object has a method called `\_including`, then instead of simply copying the properties a more advanced algorithm is used: the method it is evaluated passing the including class and its instance prototype as arguments, and the properties of the returned object gets added to the instance's prototype. This enables explicit export of some properties only, as well as manipulation of the including class upon inclusion.


Augment
-------

The `augment` class method accepts one or more objects and copies their properties to the class:

```javascript
var Foo = Class.new();

Foo.augment({
  classMethod: function() {
    return "I am a class method!";
  }
});

Foo.classMethod(); // => "I am a class method!"
```

Similarly to the `include` method, also `augment` supports an advanced behavior when the passed object has a `\_augmenting` method. In this case, instead of directly copying the object's properties, the `\_augmenting` method is evaluated passing the class as the first argument, and the returned object's properties are copied on the class.


Reopen
------

The `reopen` class method has the same interface as the `Class.new` method: if you pass an object, its properties get added to the instance's prototype. If you pass a function, it is executed in the scope of the class, passing the instance's prototype as the first argument.

```javascript
var Human = Class.new(),
    john = Human.new();

// Passing an object
Human.reopen({
  sing: function() {
    return "Goo goo goo joob!";
  }
});

john.sing(); // => "Goo goo goo joob!"

// Passing a function
Human.reopen(function( proto ) {

  // `this` is the class, here Human
  this.cogito = function() {
    return "ergo sum.";
  };

  // proto here is the same as Human._instance_proto
  proto.eat = function() {
    return "Yum!"
  };

});

Human.cogito(); // => "ergo sum."
john.eat();     // => "Yum!"
```
