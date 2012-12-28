(function( top ) {
  
  var Class = {};

  Class.new = function Class( mixin ) {

    var copyProps = function( target, mixin ) {
          for ( var k in mixin ) {
            target[ k ] = mixin[ k ];
          }
          return target;
        },

        extendInstanceOrApply = function( klass, mixin ) {
          if ( typeof mixin === "function" ) {
            mixin.call( klass, klass._instance_proto );
          } else {
            copyProps( klass._instance_proto, mixin );
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

        createObject = function( proto ) {
          if ( Object.create ) {
            return Object.create( proto );
          } else {
            var F = function() {};
            F.prototype = proto;
            return new F;
          }
        },

        klass = {};

    klass.new = function klass() {
      var instance = createObject( this._instance_proto || Object );
      if ( typeof instance.initialize === "function" ) {
        instance.initialize.apply( this, arguments );
      }
      return instance;
    };

    klass.subclass = function( mixin ) {
      var superclass = this,
          proto = createObject( superclass._instance_proto ),
          subclass = createObject( superclass );

      copyProps( subclass, { _superclass: superclass, _instance_proto: proto } );
      copyProps( subclass._instance_proto, { _class: subclass, _parent: superclass._instance_proto } );
      extendInstanceOrApply( subclass, mixin );
      return subclass;
    };

    klass.augment = augmenter("_augmenting");

    klass.include = augmenter( "_including", "_instance_proto" );

    klass.reopen = function( mixin ) {
      extendInstanceOrApply( this, mixin );
    };

    copyProps( klass, { _class: this, _superclass: Function } );
    klass._instance_proto = { _parent: Object, _class: klass };
    extendInstanceOrApply( klass, mixin );

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
