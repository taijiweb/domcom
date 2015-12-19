var DomcomError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DomcomError = (function(_super) {
  __extends(DomcomError, _super);

  function DomcomError(message, component) {
    this.message = message;
    this.component = component;
  }

  DomcomError.prototype.toString = function() {
    if (this.component) {
      return this.component.toString() + '\n' + this.message;
    } else {
      return this.message;
    }
  };

  return DomcomError;

})(Error);

exports.error = function(message, component) {
  throw new DomcomError(message, component);
};

exports.onerror = function(message, component) {
  if (message instanceof DomcomError) {
    console.log(message);
    throw new Error(message.message);
  } else if (message instanceof Error) {
    throw message;
  } else {
    if (comopenent) {
      console.log(component);
      console.log(message);
    } else {
      console.log(message);
    }
    throw new Error(message);
  }
};
