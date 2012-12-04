(function( top ) {
  
  function Class( mixin ) {

    var extend = function( obj ) {
          var other_objs = Array.prototype.slice.call( arguments, 1 );
          for ( var i = 0, len = other_objs.length; i < len; i++ ) {
            for ( var k in other_objs[ i ] ) {
              obj[ k ] = other_objs[ i ][ k ];
            }
          }
          return obj;
        },

        extendProtoOrApply = function( klass, mixin ) {
          if ( typeof mixin === "function" ) {
            mixin.call( klass, klass.prototype );
          } else {
            extend( klass.prototype, mixin );
          }
        };

    function klass() {
      if ( typeof this.initialize === "function" ) {
        this.initialize.apply( this, arguments );
      }
    }

    klass.subclass = function( mixin ) {
      var superclass = this,
          proto = new superclass();
      function klass() {
        superclass.apply( this, arguments );
      }
      if ( klass.__proto__ ) {
        klass.__proto__ = superclass;
      } else {
        extend( klass, superclass );
      }
      extend( klass, { _superclass: superclass } );
      klass.prototype = proto;
      extendProtoOrApply( klass, mixin );
      extend( klass.prototype, { constructor: klass, _parent: superclass.prototype } );
      return klass;
    };

    klass.augment = function() {
      var args = Array.prototype.slice.apply( arguments );
      args.unshift( this );
      extend.apply( this, args );
    };

    klass.include = function() {
      this.augment.apply( this.prototype, arguments );
    };

    extend( klass, { constructor: Class, _superclass: Function } );
    klass.prototype._parent = Object;
    extendProtoOrApply( klass, mixin );

    return klass;

  }

  // Export Class as
  if ( typeof exports !== "undefined" ) {
    // CommonJS / Node module
    if ( typeof module !== "undefined" && module.exports ) {
      exports = module.exports = Class;
    }
    exports.Class = Class;
  } else if ( typeof define === "function" && define.amd ) {
    // AMD module
    define(function() {
      return Class;
    });
  } else {
    // Browser global
    top.Wheels = top.Wheels || {};
    top.Wheels.Class = Class;
  }

})( this );