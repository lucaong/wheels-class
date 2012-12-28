/* Setup tests */
if ( typeof define !== "undefined" && define.amd ) {
  // AMD
  buster.spec.expose();
  describe("When required with AMD", function( run ) {
    require( ["wheels-class"], function( Class ) {
      run( function() {
        runTests.call( this, Class );
      });
    });
  });
} else if ( typeof exports !== "undefined" ) {
  // CommonJS / Node
  var buster = require("buster"),
      Class = require("../wheels-class");
  runTests( Class );
} else {
  // Browser global
  runTests( Wheels.Class );
}


function runTests( Class ) {

  buster.spec.expose();

  describe("Class", function() {

    describe("new", function() {

      it("sets the _class property on class instance", function() {
        var Foo = Class.new();
        expect( Foo._class ).toBe( Class );
      });

      it("sets _instance_proto properties on class instance if an object is passed", function() {
        var prop = function() {},
            Foo = Class.new({ method: prop });
        expect( Foo._instance_proto.method ).toBe( prop );
      });

      it("sets a _superclass property pointing to Function", function() {
        var Foo = Class.new();
        expect( Foo._superclass ).toBe( Function );
      });

      describe("when called passing a function", function() {

        it("executes the function in the scope of the class instance", function() {
          var whats_this,
              Foo = Class.new(function() {
                whats_this = this;
              });
          expect( whats_this ).toBe( Foo );
        });

        it("calls the function passing the class _instance_proto property as the first argument", function() {
          var probe,
              Foo = Class.new(function( proto ) {
                probe = proto;
              });
          expect( probe ).toBe( Foo._instance_proto );
        });

      });

    });

  });

  describe("class", function() {

    describe("new", function() {
      it("instantiates class", function() {
        var Foo = Class.new(),
            foo = Foo.new();
        expect( Foo._instance_proto.isPrototypeOf( foo ) ).toBeTrue();
      });

      it("sets the _class property", function() {
        var Foo = Class.new(),
            foo = Foo.new();
        expect( foo._class ).toBe( Foo );
      });

      it("calls the initialize method, if defined, passing the original arguments of new", function() {
        var spy = this.spy(),
            Foo = Class.new({ initialize: spy }),
            foo = Foo.new( "abc", 123 );
        expect( spy ).toHaveBeenCalledWith( "abc", 123 );
      });

      it("calls the initialize method in the scope of the instance", function() {
        var scope,
            scopeProbe = function() {
              scope = this;
            },
            Foo = Class.new({ initialize: scopeProbe }),
            foo = Foo.new();
        expect( scope ).toBe( foo );
      });

      it("sets a _parent property pointing at Object", function() {
        var Foo = Class.new(),
            foo = Foo.new();
        expect( foo._parent ).toBe( Object );
      });
    });

    describe("subclass", function() {

      it("implements inheritance", function() {
        var Foo = Class.new(),
            Bar = Foo.subclass(),
            bar = Bar.new();
        expect( Bar._instance_proto.isPrototypeOf( bar ) ).toBeTrue();
        expect( Foo._instance_proto.isPrototypeOf( bar ) ).toBeTrue();
      });

      describe("when a function is passed", function() {

        it("executes the function in the scope of the subclass", function() {
          var whats_this,
              Foo = Class.new(),
              Bar = Foo.subclass(function() {
                whats_this = this;
              });
          expect( whats_this ).toBe( Bar );
        });

        it("calls the function passing the subclass _instance_proto property as the first argument", function() {
          var probe,
              Foo = Class.new(),
              Bar = Foo.subclass(function( proto ) {
                probe = proto;
              });
          expect( probe ).toBe( Bar._instance_proto );
        });

      });

      it("sets properties on subclass' _instance_proto property if an object is passed", function() {
        var prop = 123,
            Foo = Class.new(),
            Bar = Foo.subclass({ prop: prop });
        expect( Bar._instance_proto.prop ).toBe( prop );
      });

      it("does not set properties on superclass' _instance_proto property", function() {
        var prop = 123,
            Foo = Class.new(),
            Bar = Foo.subclass({ prop: prop });
        expect( typeof Foo._instance_proto.prop ).toEqual("undefined");
      });

      it("overrides properties on subclass' _instance_proto property", function() {
        var prop = 123,
            Foo = Class.new({ prop: "abc" }),
            Bar = Foo.subclass({ prop: prop });
        expect( Bar._instance_proto.prop ).toBe( prop );
      });

      it("does not override properties on superclass' _instance_proto property", function() {
        var original_prop = "abc",
            prop = 123,
            Foo = Class.new({ prop: original_prop }),
            Bar = Foo.subclass({ prop: prop });
        expect( Foo._instance_proto.prop ).toBe( original_prop );
      });

      it("sets the _superclass property on subclass, pointing at the superclass", function() {
        var Foo = Class.new(),
            Bar = Foo.subclass();
        expect( Bar._superclass ).toBe( Foo );
      });

      it("sets the _parent property on instances, pointing at superclass._instance_proto", function() {
        var Foo = Class.new(),
            Bar = Foo.subclass(),
            bar = Bar.new();
        expect( bar._parent ).toBe( Foo._instance_proto );
      });

    });

    describe("include", function() {

      it("adds the properties of the arguments to the class' _instance_proto property", function() {
        var prop = 123,
            Foo = Class.new();
        Foo.include({ prop: prop });
        expect( Foo._instance_proto.prop ).toBe( prop );
      });

      it("accepts multiple arguments and includes all them in order", function() {
        var prop = 123,
            other_prop = 321,
            Foo = Class.new();
        Foo.include({ prop: prop, other_prop: "abc" }, { other_prop: other_prop });
        expect( Foo._instance_proto.prop ).toBe( prop );
        expect( Foo._instance_proto.other_prop ).toBe( other_prop );
      });

      describe("if an argument has an `_including` method", function() {

        it("it calls it passing the class and the _instance_proto", function() {
          var spy = this.stub().returns({ prop: "foo" }),
              Foo = Class.new();
          Foo.include({ _including: spy });
          expect( spy ).toHaveBeenCalledOnceWith( Foo, Foo._instance_proto );
        });

        it("it calls it and includes the returned value", function() {
          var spy = this.stub().returns({ prop: "foo" }),
              Foo = Class.new();
          Foo.include({ _including: spy });
          expect( Foo._instance_proto.prop ).toEqual( "foo" );
        });

      });

    });

    describe("augment", function() {

      it("adds the properties of the arguments to the class", function() {
        var prop = 123,
            Foo = Class.new();
        Foo.augment({ prop: prop });
        expect( Foo.prop ).toBe( prop );
      });

      describe("if an argument has an `_augmenting` method", function() {

        it("it calls it passing the class", function() {
          var spy = this.stub().returns({ prop: "foo" }),
              Foo = Class.new();
          Foo.augment({ _augmenting: spy });
          expect( spy ).toHaveBeenCalledOnceWith( Foo );
        });

        it("it calls it and extends class with the returned value", function() {
          var spy = this.stub().returns({ prop: "foo" }),
              Foo = Class.new();
          Foo.augment({ _augmenting: spy });
          expect( Foo.prop ).toEqual( "foo" );
        });

      });

    });

    describe("reopen", function() {

      describe("when called passing an object", function() {

        it("adds the object properties to the _instance_proto property", function() {
          var prop = 123,
              Foo = Class.new();
          Foo.reopen({ prop: prop });
          expect( Foo._instance_proto.prop ).toBe( prop );
        });

      });

      describe("when called passing a function", function() {

        it("executes the function in the scope of the class", function() {
          var Foo = Class.new(),
              whats_this;
          Foo.reopen(function() {
            whats_this = this;
          });
          expect( whats_this ).toBe( Foo );
        });

        it("executes the function passing the class _instance_proto property as the first argument", function() {
          var probe,
              Foo = Class.new();
          Foo.reopen(function( proto ) {
            probe = proto;
          });
          expect( probe ).toBe( Foo._instance_proto );
        });

      });

    });

  });

}
