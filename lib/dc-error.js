var DomcomError, dcError, slice, stackReg, stackReg2, stacktraceMessage;

slice = [].slice;

stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;

stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

stacktraceMessage = function(message, stackIndex = 1) {
  var error, file, itemInfo, line, method, pos, stackItem, stacklist, stacklistLength;
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
