var DomcomError, dcError, slice, stackReg, stackReg2, stacktraceMessage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

slice = [].slice;

stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;

stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

stacktraceMessage = function(message, stackIndex) {
  var error, file, itemInfo, line, method, pos, stackItem, stacklist, stacklistLength;
  if (stackIndex == null) {
    stackIndex = 1;
  }
  if (message) {
    if (!dcError.prodution) {
      console.log(message);
    }
    message += ':\n';
  } else {
    message = "";
  }
  error = new Error();
  if (!dcError.prodution) {
    console.log(error);
  }
  stacklist = error.stack.split('\n').slice(3);
  stackIndex = 1;
  stacklistLength = stacklist.length;
  while (stackIndex < stacklistLength) {
    stackItem = stacklist[stackIndex];
    itemInfo = stackReg.exec(stackItem) || stackReg2.exec(stackItem);
    if (itemInfo && itemInfo.length === 5) {
      method = itemInfo[1];
      file = itemInfo[2];
      line = itemInfo[3];
      pos = itemInfo[4];
      message += file + ':' + line + ':' + pos + ':' + method + '\n';
    }
    stackIndex++;
  }
  return message;
};

exports.DomcomError = DomcomError = (function(_super) {
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

exports.error = dcError = function(message, component) {
  message = stacktraceMessage(message, 2);
  throw new DomcomError(message, component);
};

exports.onerror = function(message, component) {
  if (message instanceof DomcomError) {
    console.log(message);
    throw new Error(message.message);
  } else if (message instanceof Error) {
    throw message;
  } else {
    if (component) {
      console.log(component);
      console.log(message);
    } else {
      console.log(message);
    }
    throw new Error(message + ':\n' + stacktraceMessage());
  }
};
