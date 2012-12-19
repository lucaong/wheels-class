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

		it("sets the right constructor on class instance", function() {
			var Foo = new Class();
			expect( Foo.constructor ).toBe( Class );
		});

		it("sets prototype properties on class instance if an object is passed", function() {
			var prop = function() {},
					Foo = new Class({ meth: prop });
			expect( Foo.prototype.meth ).toBe( prop );
		});

		it("has a _superclass property pointing to Function", function() {
			var Foo = new Class();
			expect( Foo._superclass ).toBe( Function );
		});

		describe("when called passing a function", function() {

			it("executes the function in the scope of the class instance", function() {
				var whats_this,
						Foo = new Class(function() {
							whats_this = this;
						});
				expect( whats_this ).toBe( Foo );
			});

			it("calls the function passing the class prototype property as the first argument", function() {
				var probe,
						Foo = new Class(function( proto ) {
							probe = proto;
						});
				expect( probe ).toBe( Foo.prototype );
			});

		});

	});

	describe("class instance", function() {

		describe("new", function() {
			it("instantiates class", function() {
				var Foo = new Class(),
						foo = new Foo();
				expect( foo instanceof Foo ).toBeTrue();
			});

			it("sets the right constructor", function() {
				var Foo = new Class(),
						foo = new Foo();
				expect( foo.constructor ).toBe( Foo );
			});

			it("calls the initialize method, if defined", function() {
				var spy = this.spy(),
						Foo = new Class({ initialize: spy }),
						foo = new Foo();
				expect( spy ).toHaveBeenCalled();
			});

			it("has a _parent property pointing at Object", function() {
				var Foo = new Class(),
						foo = new Foo();
				expect( foo._parent ).toBe( Object );
			});
		});

		describe("subclass", function() {

			it("implements inheritance", function() {
				var Foo = new Class(),
						Bar = Foo.subclass(),
						bar = new Bar();
				expect( bar instanceof Bar ).toBeTrue();
				expect( bar instanceof Foo ).toBeTrue();
			});

			describe("when a function is passed", function() {

				it("executes the function in the scope of the subclass", function() {
					var whats_this,
							Foo = new Class(),
							Bar = Foo.subclass(function() {
								whats_this = this;
							});
					expect( whats_this ).toBe( Bar );
				});

				it("calls the function passing the subclass prototype property as the first argument", function() {
					var probe,
							Foo = new Class(),
							Bar = Foo.subclass(function( proto ) {
								probe = proto;
							});
					expect( probe ).toBe( Bar.prototype );
				});

			});

			it("sets properties on subclass' prototype if an object is passed", function() {
				var prop = 123,
						Foo = new Class(),
						Bar = Foo.subclass({ prop: prop });
				expect( Bar.prototype.prop ).toBe( prop );
			});

			it("does not set properties on superclass' prototype", function() {
				var prop = 123,
						Foo = new Class(),
						Bar = Foo.subclass({ prop: prop });
				expect( typeof Foo.prototype.prop ).toEqual("undefined");
			});

			it("overrides properties on subclass' prototype", function() {
				var prop = 123,
						Foo = new Class({ prop: "abc" }),
						Bar = Foo.subclass({ prop: prop });
				expect( Bar.prototype.prop ).toBe( prop );
			});

			it("does not override properties on superclass' prototype", function() {
				var original_prop = "abc",
						prop = 123,
						Foo = new Class({ prop: original_prop }),
						Bar = Foo.subclass({ prop: prop });
				expect( Foo.prototype.prop ).toBe( original_prop );
			});

			it("sets the _superclass property on subclass, pointing at the superclass", function() {
				var Foo = new Class(),
						Bar = Foo.subclass();
				expect( Bar._superclass ).toBe( Foo );
			});

			it("sets the _parent property on instances, pointing at superclass.prototype", function() {
				var Foo = new Class(),
						Bar = Foo.subclass(),
						bar = new Bar();
				expect( bar._parent ).toBe( Foo.prototype );
			});

		});

		describe("include", function() {

			it("adds the properties of the arguments to the class prototype", function() {
				var prop = 123,
						Foo = new Class();
				Foo.include({ prop: prop });
				expect( Foo.prototype.prop ).toBe( prop );
			});

			it("accepts multiple arguments and includes all them in order", function() {
				var prop = 123,
						other_prop = 321,
						Foo = new Class();
				Foo.include({ prop: prop, other_prop: "abc" }, { other_prop: other_prop });
				expect( Foo.prototype.prop ).toBe( prop );
				expect( Foo.prototype.other_prop ).toBe( other_prop );
			});

			describe("if an argument has an `_included` method", function() {

				it("it calls it passing the class", function() {
					var spy = this.stub().returns({ prop: "foo" }),
							Foo = new Class();
					Foo.include({ _included: spy });
					expect( spy ).toHaveBeenCalledOnceWith( Foo );
				});

				it("it calls it and includes the returned value, if any", function() {
					var spy = this.stub().returns({ prop: "foo" }),
							Foo = new Class();
					Foo.include({ _included: spy });
					expect( Foo.prototype.prop ).toEqual( "foo" );
				});

				it("it calls it and, if a falsy value is returned, includes the argument object", function() {
					var spy = this.stub().returns( null ),
							Foo = new Class();
					Foo.include({ _included: spy, prop: "bar" });
					expect( Foo.prototype.prop ).toEqual( "bar" );
				});

			});

		});

		describe("augment", function() {

			it("adds the properties of the arguments to the class", function() {
				var prop = 123,
						Foo = new Class();
				Foo.augment({ prop: prop });
				expect( Foo.prop ).toBe( prop );
			});

			describe("if an argument has an `_augmenting` method", function() {

				it("it calls it passing the class", function() {
					var spy = this.stub().returns({ prop: "foo" }),
							Foo = new Class();
					Foo.augment({ _augmenting: spy });
					expect( spy ).toHaveBeenCalledOnceWith( Foo );
				});

				it("it calls it and extends class with the returned value, if any", function() {
					var spy = this.stub().returns({ prop: "foo" }),
							Foo = new Class();
					Foo.augment({ _augmenting: spy });
					expect( Foo.prop ).toEqual( "foo" );
				});

				it("it calls it and, if a falsy value is returned, extends the class with the argument object", function() {
					var spy = this.stub().returns( null ),
							Foo = new Class();
					Foo.augment({ _augmenting: spy, prop: "bar" });
					expect( Foo.prop ).toEqual( "bar" );
				});

			});

		});

		describe("inclusion in another class", function() {

			it("causes the included class' instance properties to be added to the includer class prototype property", function() {
				var Foo = new Class({ prop: 123 }),
						Bar = new Class();
				Bar.include( Foo );
				expect( Bar.prototype.prop ).toEqual( 123 );
			});

			it("does not override the _parent property", function() {
				var Foo = new Class({ prop: 123 }),
						Bar = new Class(),
						Baz = Bar.subclass(),
						original_parent = Baz.prototype._parent;
				Baz.include( Foo );
				expect( Baz.prototype._parent ).toEqual( original_parent );
			});

		});

		describe("augmenting another class", function() {

			it("causes the augmenting class' properties to be added to the augmented class", function() {
				var Foo = new Class(function() {
							this.prop = 123;
						}),
						Bar = new Class();
				Bar.augment( Foo );
				expect( Bar.prop ).toEqual( 123 );
			});

			it("does not override the _superclass property", function() {
				var Foo = new Class(function() {
							this.prop = 123;
						}),
						Bar = new Class(),
						Baz = Bar.subclass(),
						original_superclass = Baz._superclass;
				Baz.augment( Foo );
				expect( Baz._superclass ).toEqual( original_superclass );
			});

			it("does not override the _augmenting property", function() {
				var Foo = new Class(function() {
							this.prop = 123;
						}),
						Bar = new Class(function() {
							this._augmenting = function(){};
						}),
						original_augmenting = Bar._augmenting;
				Bar.augment( Foo );
				expect( Bar._augmenting ).toEqual( original_augmenting );
			});

		});

		describe("reopen", function() {

			describe("when called passing an object", function() {

				it("adds the object properties to the prototype", function() {
					var prop = 123,
							Foo = new Class();
					Foo.reopen({ prop: prop });
					expect( Foo.prototype.prop ).toBe( prop );
				});

			});

			describe("when called passing a function", function() {

				it("executes the function in the scope of the class", function() {
					var Foo = new Class(),
							whats_this;
					Foo.reopen(function() {
						whats_this = this;
					});
					expect( whats_this ).toBe( Foo );
				});

				it("executes the function passing the class prototype property as the first argument", function() {
					var probe,
							Foo = new Class();
					Foo.reopen(function( proto ) {
						probe = proto;
					});
					expect( probe ).toBe( Foo.prototype );
				});

			});

		});

	});

}