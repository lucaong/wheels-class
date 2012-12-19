(function( top ) {
  
  function Class( mixin ) {

    var extend = function( obj, mixin ) {
          for ( var k in mixin ) {
            obj[ k ] = mixin[ k ];
          }
          return obj;
        },

        extendProtoOrApply = function( klass, mixin ) {
          if ( typeof mixin === "function" ) {
            mixin.call( klass, klass.prototype );
          } else {
            extend( klass.prototype, mixin );
          }
        },

        excludeProps = function( mixin, excluded_props ) {
          for ( var i = 0, len = excluded_props.length; i < len; i++ ) {
            delete mixin[ excluded_props[ i ] ];
          }
          return mixin;
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
      extend( klass.prototype, { constructor: klass, _parent: superclass.prototype } );
      extendProtoOrApply( klass, mixin );
      return klass;
    };

    klass.augment = function() {
      for ( var i = 0, len = arguments.length; i < len; i++ ) {
        if ( typeof arguments[ i ]._augmenting === "function" ) {
          extend( this, arguments[ i ]._augmenting( this ) || arguments[ i ] );
        } else {
          extend( this, arguments[ i ] );
        }
      }
    };

    klass.include = function() {
      for ( var i = 0, len = arguments.length; i < len; i++ ) {
        if ( typeof arguments[ i ]._included === "function" ) {
          extend( this.prototype, arguments[ i ]._included( this ) || arguments[ i ] );
        } else {
          extend( this.prototype, arguments[ i ] );
        }
      }
    };

    klass._included = function() {
      return excludeProps( extend( {}, this.prototype ), [ "_parent" ] );
    };

    klass._augmenting = function() {
      return excludeProps( extend( {}, this ), [ "_superclass", "_augmenting" ] );
    };

    klass.reopen = function( mixin ) {
      extendProtoOrApply( this, mixin );
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