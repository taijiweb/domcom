var DomcomError, exports, slice, stackReg, stackReg2, stacktraceMessage;

slice = [].slice;

stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;

stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

//export default
module.exports = exports = {};

stacktraceMessage = function(message, stackIndex = 1) {
  var error, file, itemInfo, line, method, pos, stackItem, stacklist, stacklistLength;
  if (message) {
    if (!dc.prodution) {
      console.log(message);
    }
    message += ':\n';
  } else {
    message = "";
  }
  error = new Error();
  if (!dc.prodution) {
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

exports.DomcomError = DomcomError = class DomcomError extends Error {
  constructor(message1, component1) {
    super();
    this.message = message1;
    this.component = component1;
  }

  toString() {
    if (this.component) {
      return this.component.toString() + '\n' + this.message;
    } else {
      return this.message;
    }
  }

};

exports.error = function(message, component) {
  message = stacktraceMessage(message, 2);
  throw new DomcomError(message, component);
};

export default exports;
