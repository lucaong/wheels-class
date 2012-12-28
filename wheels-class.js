(function( top ) {
  
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
        if ( Object.create ) {
          return Object.create( proto );
        } else {
          var F = function() {};
          F.prototype = proto;
          return new F;
        }
      },

      Class = {};

  Class.new = function( mixin ) {

    var klass = {};

    klass.new = function() {
      var instance = createObject( this._instance_proto );
      if ( typeof instance.initialize === "function" ) {
        instance.initialize.apply( this, arguments );
      }
      return instance;
    };

    klass.subclass = function( mixin ) {
      var superclass = this,
          proto = createObject( superclass._instance_proto ),
          subclass = createObject( superclass );

      copyProps( subclass, {
        _superclass:     superclass,
        _instance_proto: proto
      });
      copyProps( subclass._instance_proto, {
        _class:  subclass,
        _parent: superclass._instance_proto
      });
      extendInstanceOrApply( subclass, mixin );
      return subclass;
    };

    klass.augment = function() {
      for ( var i = 0, len = arguments.length, mixin; i < len; i++ ) {
        mixin = arguments[ i ];
        if ( typeof mixin._augmenting === "function" ) {
          mixin = mixin._augmenting( this );
        }
        copyProps( this, mixin );
      }
    };

    klass.include = function() {
      for ( var i = 0, len = arguments.length, mixin; i < len; i++ ) {
        mixin = arguments[ i ];
        if ( typeof mixin._including === "function" ) {
          mixin = mixin._including( this, this._instance_proto );
        }
        copyProps( this._instance_proto, mixin );
      }
    };

    klass.reopen = function( mixin ) {
      extendInstanceOrApply( this, mixin );
    };

    copyProps( klass, {
      _class:      this,
      _superclass: Function
    });

    klass._instance_proto = {
      _parent: Object,
      _class:  klass
    };

    extendInstanceOrApply( klass, mixin );

    return klass;
  };

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
