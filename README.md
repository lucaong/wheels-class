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

Pass an object to the constructor to create a class and add the object's properties to the class `prototype` property:

```javascript
var Foo = Class.new({
  greet: function() {
    return "Hello :)";
  }
});

var foo = Foo.new();
foo.greet(); // => "Hello :)"
```

Alternatively, you can pass a function to the constructor, and it will be executed in the scope of the class. That means that, whithin the function, `this` is the class itself. Also, the function will receive the `prototype` property of the class as the first argument:

```javascript
var Foo = Class.new(function( proto ) {

  // `this` is the class, here Foo
  this.classMethod = function() {
    return "I am a class method";
  }

  // first argument is the class `prototype` property (here Foo.prototype)
  proto.instanceMethod = function() {
    return "Hello :)";
  }

});

var foo = Foo.new();

Foo.classMethod();    // => "I am a class method"
foo.instanceMethod(); // => "Hello :)"
```

Class inheritance
-----------------

The `subclass` method creates a subclass and accepts the same arguments as the constructor:

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

// And the instance stores a reference to the parent prototype
nyan._parent === Animal.prototype // => true
```

Include, augment and reopen
---------------------------

The `include` method accepts one or more objects and copies their properties to the class' `prototype` property:

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

The `augment` method accepts one or more objects and copies their properties to the class:

```javascript
var Foo = Class.new();

Foo.augment({
  classMethod: function() {
    return "I am a class method!";
  }
});

Foo.classMethod(); // => "I am a class method!"
```

The `reopen` method accepts the same arguments as the `Class` constructor: if you pass an object, its properties get added to the class prototype, if you pass a function it is executed in the scope of the class, passing the prototype as the first argument.

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

  // proto here is Human.prototype
  proto.eat = function() {
    return "Yum!"
  };

});

Human.cogito(); // => "ergo sum."
john.eat();     // => "Yum!"
```
