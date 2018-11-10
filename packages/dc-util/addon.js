var getCommonRoot,
  __slice = [].slice;

exports.getCommonRoot = getCommonRoot = function(start, stop, root) {
  var holder, holders, startBranch, stopBranch;
  if (start === stop) {
    return [start, [], []];
  } else {
    root = root || dc;
    holders = {};
    holder = start.holder;
    startBranch = [];
    while (holder && holder !== root) {
      holders[holder.dcid] = holder;
      startBranch.unshift(holder);
      holder = holder.holder;
    }
    stopBranch = [];
    holder = stop.holder;
    while (holder && holder !== root && !holders[holder.dcid]) {
      stopBranch.unshift(holder);
      holder = holder.holder;
    }
    if (holder && holder !== root) {
      startBranch = startBranch.slice(startBranch.indexOf(holder) + 1);
    } else {
      holder = null;
      startBranch = [];
      stopBranch = [];
    }
    return [holder, startBranch, stopBranch];
  }
};

exports.getComponentsBetween = function(start, stop, root) {
  var holder, index, leftMissing, result, rightMissing, startBranch, startEndIndex, startIndex, stopBranch, stopIndex, top, _ref;
  if (start === stop) {
    return [start];
  } else {
    _ref = getCommonRoot(start, stop, root), top = _ref[0], startBranch = _ref[1], stopBranch = _ref[2];
    result = [];
    leftMissing = false;
    holder = startBranch.pop();
    while (holder) {
      index = holder.children.indexOf(start);
      if (!leftMissing) {
        if (index !== 0) {
          leftMissing = true;
          result.push.apply(result, holder.children.slice(index));
        }
      } else {
        result.push.apply(result, holder.children.slice(index + 1));
      }
      start = holder;
      holder = startBranch.pop();
    }
    startEndIndex = result.length;
    rightMissing = false;
    holder = stopBranch.pop();
    while (holder) {
      index = holder.children.indexOf(stop);
      if (!rightMissing) {
        if (index !== holder.children.length - 1) {
          rightMissing = true;
          result.push.apply(result, holder.children.slice(0, +index + 1 || 9e9));
        }
      } else {
        result.splice.apply(result, [startEndIndex, 0].concat(__slice.call(holder.children.slice(0, index))));
      }
      stop = holder;
      holder = stopBranch.pop();
    }
    startIndex = top.children.indexOf(start);
    stopIndex = top.children.indexOf(stop);
    if (!leftMissing && !rightMissing) {
      if (startIndex === 0 && stopIndex === top.children.length - 1) {
        return [top];
      } else {
        return top.children.slice(startIndex, +stopIndex + 1 || 9e9);
      }
    } else {
      if (!leftMissing) {
        result.splice.apply(result, [startEndIndex, 0].concat(__slice.call(top.children.slice(startIndex, stopIndex))));
      } else if (!rightMissing) {
        result.push.apply(result, top.children.slice(startIndex + 1, +stopIndex + 1 || 9e9));
      } else {
        result.splice.apply(result, [startEndIndex, 0].concat(__slice.call(top.children.slice(startIndex + 1, stopIndex))));
      }
      return result;
    }
  }
};

exports.splitComponentByBranch = function(top, branch) {
  var child, children, i, length, nextNeighbours, prevNeighbours;
  prevNeighbours = [];
  nextNeighbours = [];
  while (branch.length) {
    child = branch.pop();
    children = top.children;
    length = children.length;
    if (children.length > 1) {
      i = 0;
      while (i < length && children[i] !== child) {
        prevNeighbours.push(children[i]);
        i++;
      }
      i++;
      while (i < length) {
        nextNeighbours.unshift(children[i]);
        i++;
      }
    }
    top = child;
  }
  prevNeighbours.push.apply(prevNeighbours, nextNeighbours);
  return prevNeighbours;
};

exports.renderList = function(edits) {
  var edit, _i, _len;
  for (_i = 0, _len = edits.length; _i < _len; _i++) {
    edit = edits[_i];
    edit.render();
  }
};
