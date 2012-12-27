(function( top ) {
  
  function Class( mixin ) {

    var copyProps = function( target, mixin ) {
          for ( var k in mixin ) {
            target[ k ] = mixin[ k ];
          }
          return target;
        },

        extendProtoOrApply = function( klass, mixin ) {
          if ( typeof mixin === "function" ) {
            mixin.call( klass, klass.prototype );
          } else {
            copyProps( klass.prototype, mixin );
          }
        },

        augmenter = function( magic_method, target_prop ) {
          return function() {
            var target = target_prop ? this[ target_prop ] : this;
            for ( var i = 0, len = arguments.length; i < len; i++ ) {
              if ( typeof arguments[ i ][ magic_method ] === "function" ) {
                copyProps( target, arguments[ i ][ magic_method ]( this ) || arguments[ i ] );
              } else {
                copyProps( target, arguments[ i ] );
              }
            }
          }
        },

        klass = function klass() {
          if ( typeof this.initialize === "function" ) {
            this.initialize.apply( this, arguments );
          }
        };

    klass.subclass = function( mixin ) {
      var superclass = this,
          proto = new superclass(),
          klass = function klass() {
            superclass.apply( this, arguments );
          };

      if ( klass.__proto__ ) {
        klass.__proto__ = superclass;
      } else {
        copyProps( klass, superclass );
      }
      klass._superclass = superclass;
      klass.prototype = proto;
      copyProps( klass.prototype, { constructor: klass, _parent: superclass.prototype } );
      extendProtoOrApply( klass, mixin );
      return klass;
    };

    klass.augment = augmenter("_augmenting");

    klass.include = augmenter("_including", "prototype");

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