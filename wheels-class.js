(function( top ) {
  
  function Class( mixin ) {

    var copyProps = function( obj, mixin ) {
          for ( var k in mixin ) {
            obj[ k ] = mixin[ k ];
          }
          return obj;
        },

        extendProtoOrApply = function( klass, mixin ) {
          if ( typeof mixin === "function" ) {
            mixin.call( klass, klass.prototype );
          } else {
            copyProps( klass.prototype, mixin );
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
        copyProps( klass, superclass );
      }
      copyProps( klass, { _superclass: superclass } );
      klass.prototype = proto;
      copyProps( klass.prototype, { constructor: klass, _parent: superclass.prototype } );
      extendProtoOrApply( klass, mixin );
      return klass;
    };

    klass.augment = function() {
      for ( var i = 0, len = arguments.length; i < len; i++ ) {
        if ( typeof arguments[ i ]._augmenting === "function" ) {
          copyProps( this, arguments[ i ]._augmenting( this ) || arguments[ i ] );
        } else {
          copyProps( this, arguments[ i ] );
        }
      }
    };

    klass.include = function() {
      for ( var i = 0, len = arguments.length; i < len; i++ ) {
        if ( typeof arguments[ i ]._including === "function" ) {
          copyProps( this.prototype, arguments[ i ]._including( this ) || arguments[ i ] );
        } else {
          copyProps( this.prototype, arguments[ i ] );
        }
      }
    };

    klass.reopen = function( mixin ) {
      extendProtoOrApply( this, mixin );
    };

    copyProps( klass, { constructor: Class, _superclass: Function } );
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