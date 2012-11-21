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

Pass an object literal to the constructor to create a class and add the object's properties to the class `prototype` property:

```javascript
var Foo = new Class({
  greet: function() {
    return "Hello :)";
  }
});

var foo = new Foo();
foo.greet(); // => "Hello :)"
```

Alternatively, you can pass a function to the constructor, and it will be executed in the scope of the class. That means that, whithin the function, `this` is the class itself. Also, the function will receive the `prototype` property of the class as the first argument:

```javascript
var Foo = new Class(function( proto ) {

  this.classMethod = function() {
    return "I am a class method";
  }

  proto.instanceMethod = function() {
    return "Hello :)";
  }

});

var foo = new Foo();

Foo.classMethod();    // => "I am a class method"
foo.instanceMethod(); // => "Hello :)"
```

Class inheritance
-----------------

The `subclass` method creates a subclass and accepts the same arguments as the constructor:

```javascript
var Animal = new Class({
  eat: function() {
    return "Yum :)";
  }
});

var Cat = Animal.subclass({
  meow: function() {
    return "Meow!";
  }
});

var nyan = new Cat();
nyan.eat();  // => "Yum :)"
nyan.meow(); // => "Meow!"

// The subclass also stores a reference to the superclass
Cat._superclass === Animal // => true

// And the instance stores a reference to the parent prototype
nyan._parent === Animal.prototype // => true
```

Include and augment
-------------------

The `include` method accepts an object and copies its properties to the class' `prototype` property:

```javascript
var Duck = new Class();

Duck.include({
  quack: function() {
    return "Quack!";
  }
});

var donald = new Duck();
donald.quack(); // => "Quack!"
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
