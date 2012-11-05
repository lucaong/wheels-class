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

	describe("Class constructor", function() {

		it("should set the right constructor on class instance", function() {
			var Foo = new Class();
			expect( Foo.constructor ).toBe( Class );
		});

		it("should set prototype properties on class instance if an object is passed", function() {
			var prop = function() {},
					Foo = new Class({ meth: prop });
			expect( Foo.prototype.meth ).toBe( prop );
		});

		it("should execute function in the scope of the class instance if a function is passed", function() {
			var whats_this,
					Foo = new Class(function() {
						whats_this = this;
					});
			expect( whats_this ).toBe( Foo );
		});

	});

	describe("class instance", function() {

		describe("new", function() {
			it("should instantiate class", function() {
				var Foo = new Class(),
						foo = new Foo();
				expect( foo instanceof Foo ).toBeTrue();
			});

			it("should set the right constructor", function() {
				var Foo = new Class(),
						foo = new Foo();
				expect( foo.constructor ).toBe( Foo );
			});

			it("should call the initialize method, if defined", function() {
				var spy = this.spy(),
						Foo = new Class({ initialize: spy }),
						foo = new Foo();
				expect( spy ).toHaveBeenCalled();
			});
		});

		describe("subclass", function() {

			it("should implement inheritance", function() {
				var Foo = new Class(),
						Bar = Foo.subclass(),
						bar = new Bar();
				expect( bar instanceof Bar ).toBeTrue();
				expect( bar instanceof Foo ).toBeTrue();
			});

			it("should execute function in the scope of the subclass if a function is passed", function() {
				var whats_this,
						Foo = new Class(),
						Bar = Foo.subclass(function() {
							whats_this = this;
						});
				expect( whats_this ).toBe( Bar );
			});

			it("should set properties on subclass' prototype if an object is passed", function() {
				var prop = 123,
						Foo = new Class(),
						Bar = Foo.subclass({ prop: prop });
				expect( Bar.prototype.prop ).toBe( prop );
			});

			it("should not set properties on superclass' prototype", function() {
				var prop = 123,
						Foo = new Class(),
						Bar = Foo.subclass({ prop: prop });
				expect( typeof Foo.prototype.prop ).toEqual("undefined");
			});

			it("should override properties on subclass' prototype", function() {
				var prop = 123,
						Foo = new Class({ prop: "abc" }),
						Bar = Foo.subclass({ prop: prop });
				expect( Bar.prototype.prop ).toBe( prop );
			});

			it("should not override properties on superclass' prototype", function() {
				var original_prop = "abc",
						prop = 123,
						Foo = new Class({ prop: original_prop }),
						Bar = Foo.subclass({ prop: prop });
				expect( Foo.prototype.prop ).toBe( original_prop );
			});

		});

		describe("include", function() {

			it("adds the properties of the arguments to the class prototype", function() {
				var prop = 123,
						Foo = new Class();
				Foo.include({ prop: prop });
				expect( Foo.prototype.prop ).toBe( prop );
			});

		});

		describe("augment", function() {

			it("adds the properties of the arguments to the class", function() {
				var prop = 123,
						Foo = new Class();
				Foo.augment({ prop: prop });
				expect( Foo.prop ).toBe( prop );
			});

		});

	});

};