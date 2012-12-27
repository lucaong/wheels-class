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

        createObject = function( proto ) {
          if ( typeof Object.create === "function" ) {
            return Object.create( proto );
          } else {
            var constructor = function() {};
            constructor.prototype = proto;
            return new constructor();
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
          proto = superclass.new(),
          subclass = createObject( superclass );

      copyProps( subclass, { _superclass: superclass, _instance_proto: proto } );
      copyProps( subclass._instance_proto, { _class: subclass, _parent_proto: superclass._instance_proto } );
      extendInstanceOrApply( subclass, mixin );
      return subclass;
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
          copyProps( this._instance_proto, arguments[ i ]._including( this ) || arguments[ i ] );
        } else {
          copyProps( this._instance_proto, arguments[ i ] );
        }
      }
    };

    klass.reopen = function( mixin ) {
      extendInstanceOrApply( this, mixin );
    };

    copyProps( klass, { _class: this, _superclass: Function } );
    klass._instance_proto = { _parent_proto: Object, _class: klass };
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
